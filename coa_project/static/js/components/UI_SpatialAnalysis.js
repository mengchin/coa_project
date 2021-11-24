define([],function(){    
    //載入html
    var spatialComponentHtml = "";
    var website_url = "http://127.0.0.1:8000/"
    var loadHtml = function(){
        $.ajax({
            url: 'static/componentTemplates/spatialAnalysis/spatialComponent.html',
            type: 'GET',
            async: false,
            data: {
                //_path: path, _name: pv_name, _t: new Date().getTime()
            },
            error: function (xml) {

                alert("View路徑錯誤");
            },
            success: function (xml) {

                spatialComponentHtml = xml;
            }
        });
    }
    loadHtml()

    window.SpatialMap = (function(){
        const spatialComponent = {
            name: 'spatial',
            mixins: [],
            components: {

            },
            template: spatialComponentHtml,
            data: function () {
               return {
                towncode:'',
                showoutput: false,
                isCheck:false, //勾選是否加入圖層
                legendColor:[
                        {color:'#e31a1c',name:"0.7 - 1.0"},
                        {color:'#fd8d3c',name:"0.5 - 0.7"},
                        {color:'#fecc5c',name:"0.3 - 0.5"},
                        {color:'#ffffb2',name:"0.1 - 0.3"},
                        {color:'#bdbdbd',name:"0 - 0.1"},
                        ], // Area-weighted HHI 圖例
                globalMethod: '', //指定全域空間分析方法
                globalData: [], //全域空間分析結果
                globalMethodName: '',
                showGlobalResult: false,
                spatialMethod: '', //指定區域空間分析方法
                spatialData: [], //區域空間分析結果
                spatialLayer: undefined, //空間分析圖層
                SpatialIsDisable: false, //空間分析圖層開關
                ClusterIsDisable: false,//聚集區圖層開關
                MoransPlot: false, // Moran's I散佈圖開關
                Moran : `<img src = "http://35.76.62.63:8000/api/geoland/morans_scatter">`,
                InfoWindow: false
               }
            },
            watch: {
             },
            computed: {
            },

            methods: {
            //checkClusterLayer: function(){
            //    var self = this;
            //    if(this.isCheck == true){
            //        this.$store.state.ClusterLayer.hide()
            //        this.isCheck = false
            //    } else{
            //        this.isCheck = true
            //        if (this.$store.state.ClusterArea.length > 0 && this.$store.state.ClusterLayer == undefined){
            //            this.addClusterLayer(this.$store.state.ClusterArea[0])
            //        }else {
            //            this.getClusterJson().then(function(){
            //              self.addClusterLayer(self.$store.state.ClusterArea[0])
            //            })
            //        }
            //    }
            //},

            //************************* 共用部份 *******************//
            // 提交表單傳值到後端 //

            // 圖層彈跳視窗顯示及內容//
            /**
             * 針對 geojson 上每個feature 進行相關事件註冊
             * @param {*} feature  shape
             * @param {*} layer  geojson 圖層
             */
            onEachShape:function(feature, layer){
                var self = this; 
                layer.on('click', function (e) {
                    /* 這裏的 this scope 指的是 layer 回傳的 shape */
                    this.feature.type === 'Feature'  && self.setInfowindow(e,this.feature.properties)
                });
            },                
            setInfowindow:function(e,properties){
                var self = this;
                var popup = L.popup()
                             .setLatLng(e.latlng)
                             .setContent(self.generateInfowindowsTemplate(properties))
                             .openOn(map);
            },
            // 產製 infowindow 內容 //
            generateInfowindowsTemplate:function(properties){
                var template = "<div class='d-flex flex-column'>"
                var keys = Object.keys(properties)
                for (var i= 0; i< keys.length ; i++) {
                    var value = properties[keys[i]];
                    var row = "<div> "+ keys[i] +" : " +  value + "</div>"
                    template += row
                }
                template += "</div>";
                return template;
            },
            //--------圖層控制---------//
            addSpatialLayer: function(){   
                var self = this;
                    if(self.spatialData.length > 0 && self.SpatialIsDisable == false) {         
                        var spatialFeature = this.spatialData[0];       
                        this.spatialLayer= L.geoJSON(spatialFeature,{
                            onEachFeature: self.onEachShape,
                            style: self.SpatialStyle
                        }).addTo(map);    
                        this.SpatialIsDisable = true;  
                    } else if(self.spatialData.length > 0 && self.SpatialIsDisable == true){
                        alert(i18n.t("spatialanalysis.removeAlert"))
                    } else {                            
                        alert(i18n.t("spatialanalysis.layerAlert"))
                    }                   
            },
            removeSpatialLayer: function(){
                var self = this;
                this.spatialLayer.remove();
                this.spatialLayer = undefined;
                this.SpatialIsDisable = false;
            },

            addClusterLayer: function(){   
                var self = this;
                    if(self.$store.state.ClusterArea.length > 0 && self.ClusterIsDisable == false) {         
                        var clusterFeature = this.$store.state.ClusterArea[0];                     
                        this.$store.state.ClusterLayer = L.geoJSON(clusterFeature,{
                            onEachFeature: self.onEachShape,
                            style: self.clusterStyle
                        }).addTo(map);  
                        this.ClusterIsDisable = true;  
                    } else if(self.$store.state.ClusterArea.length > 0 && self.ClusterIsDisable == true){
                        alert(i18n.t("spatialanalysis.removeAlert"))
                    } else {                            
                        alert(i18n.t("spatialanalysis.layerAlert"))
                    }                   
            },
            removeClusterLayer: function(){
                var self = this;
                this.$store.state.ClusterLayer.remove();
                this.$store.state.ClusterLayer = undefined;
                this.ClusterIsDisable = false;
            },

                //******* 依照指定的方法拉不同空間分析結果的api *********//
                // 全域空間分析結果 
                getGlobalData: function(){
                    var self = this;
                    // Get data //
                    if (self.globalMethod == "") {
                        alert(i18n.t("spatialanalysis.methodAlert"));                        
                    } else if (self.globalMethod == "Moran's I Value:"){
                        this.globalMethodName = "Moran's I 空間自相關統計" 
                        data_api = 'api/geoland/morans'+ "/" + this.towncode
                        var promise = new Promise(function(resolve, reject){
                            $('#loading')[0].style.display = 'flex'
                            //save initial api that has already retrieved//
                            $.get(website_url+ data_api, function(data, status){
                                self.globalData.push(data)
                                $('#loading')[0].style.display = 'none'
                                resolve(self.globalData)
                            });                        
                        })
                    } else {
                        this.globalMethodName = "Geary's C 空間自相關統計" 
                        data_api = 'api/geoland/geary'+ "/" + this.towncode
                        var promise = new Promise(function(resolve, reject){
                            $('#loading')[0].style.display = 'flex'
                            //save initial api that has already retrieved//
                            $.get(website_url+ data_api, function(data, status){
                                self.globalData.push(data)
                                $('#loading')[0].style.display = 'none'
                                resolve(self.globalData)
                            });                        
                        })
                        return promise;
                    };
                    
                },

                // LISA 和 Getis Ord G* 結果（所有農地）
                getSpatialData: function(){
                    var self = this;
                    // Get data //
                    if (self.spatialMethod == "") {
                        alert(i18n.t("spatialanalysis.methodAlert"));                        
                    } else if (self.spatialMethod == "Gstar"){
                        data_api = 'api/geoland/Gstar'+ "/" + this.towncode
                        var promise = new Promise(function(resolve, reject){
                            $('#loading')[0].style.display = 'flex'
                            //save initial api that has already retrieved//
                            $.get(website_url+ data_api, function(data, status){
                                self.spatialData.push(data)
                                $('#loading')[0].style.display = 'none'
                                resolve(self.spatialData)
                            });
                        })
                        return promise;
                    } else {
                        data_api = 'api/geoland/LISA'+ "/" + this.towncode
                        var promise = new Promise(function(resolve, reject){
                            $('#loading')[0].style.display = 'flex'
                            //save initial api that has already retrieved//
                            $.get(website_url+ data_api, function(data, status){
                                self.spatialData.push(data)
                                $('#loading')[0].style.display = 'none'
                                resolve(self.spatialData)
                            });
                        })
                        return promise;
                    };
                    
                },

                // Getis Ord G*結果（合併聚集區內農地）
                getClusterData: function(){
                    var self = this;
                    // Get data //
                    var promise = new Promise(function(resolve, reject){
                        $('#loading')[0].style.display = 'flex'
                        //save initial api that has already retrieved//
                        $.get(website_url+'api/geoland/hotspots'+ "/" + this.towncode, function(data, status){
                            self.$store.state.ClusterArea.push(data)
                            $('#loading')[0].style.display = 'none'
                            resolve(self.$store.state.ClusterArea)
                        });
                    })
                    return promise;
                },

                /*****  清除空間分析結果以利後續重新計算 *****/
                clearGlobalData: function() {
                    this.globalMethod = '';
                    this.globalData.length = 0
                    
                },

                clearSpatialData: function() {
                    this.spatialData.length = 0
                    this.spatialLayer.remove();
                    this.spatialLayer = undefined;
                    this.SpatialIsDisable = false;
                },

                /*******  空間分析圖層及資料展示  ************/           
                //指定LISA圖層樣式及顏色//
                LISAColor: function(h) {
		            return h > 3    ? '#f4a582' : // HL
                   		   h > 2    ? '#0571b0' : // LL
                           h > 1    ? '#92c5de' : // LH
                   		   h > 0    ? '#ca0020' : // HH
		                              '#bdbdbd' ;
		        },

                //指定Getis Ord G*圖層樣式及顏色//
		        GstarColor: function(h) {
		            return h > 1    ? '#0571b0' : // ColdSpots
                   		   h > 0    ? '#ca0020' : // HotSpots
		                              '#bdbdbd' ;
		        },

		        SpatialStyle: function(feature) {
		            var self = this ;
                    if (self.spatialMethod == "Gstar"){
                        return {
                		    weight: 2,
                		    opacity: 1,
                		    color: 'DimGray',
                		    fillOpacity: 0.8,
		        		    fillColor: self.GstarColor(feature.properties.lg_type)
    	        	    };
                    } else {
                        return {
                		    weight: 2,
                		    opacity: 1,
                		    color: 'DimGray',
                		    fillOpacity: 0.8,
		        		    fillColor: self.LISAColor(feature.properties.li_type)
    	        	    };
                    }

		        },

                /*******  產權聚集區圖層及資料展示  ************/
                //指定聚集區圖層樣式及顏色//
		        clusterColor: function(h) {
		            return h > 0.7  ? '#e31a1c' :
                		   h > 0.5  ? '#fd8d3c' :
                   		   h > 0.3 ?  '#fecc5c' :
                   		   h > 0.1 ?  '#ffffb2' :
		                              '#bdbdbd' ;
		                   },

		        clusterStyle: function(feature) {
		            var self = this ;
    	        	return {
                		weight: 3,
                		opacity: 1,
                		color: 'DarkRed'
                		//dashArray: '2',
                		//fillOpacity: 0.7,
		        		//fillColor: self.clusterColor(feature.properties.aw_hhi)
    	        	};
		        },

                //**************** Moran's I 散布圖 *********************//
                // 顯示 Moran's Scatter Plot //
                showMoransPlot: function(){
                    this.MoransPlot = true;
                },

                // 關閉 Moran's Scatter Plot //
                closeMoransPlot:function(){
                    this.MoransPlot = false;
                },

                //***************** 分析功能說明 *************//
                // 顯示視窗 //
                showIntro: function(){
                    this.InfoWindow = true;
                },

                // 關閉視窗 //
                closeIntro:function(){
                    this.InfoWindow = false;
                },

                //******** 側邊視窗拖曳 ********/
		        initDraggable:function(){
                   $(".panel-info-container").draggable();

                },

                //********  列印報表 ******/
                PrintReport:function() {
                    window.print()
                }  
            },

            mounted: function () {
                 this.initDraggable();
            }
        };
        return {
            spatialComponent: spatialComponent
        }
    }())
    // Window name//
    return SpatialMap
});

