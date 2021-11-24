define([],function(){
    //載入html
    var simpleBaseMapComponentHtml = "";
    var website_url = "http://127.0.0.1:8000/" 
    var loadHtml = function(){
        $.ajax({
            url: 'static/componentTemplates/baseMap/simpleBaseMapComponent.html', 
            type: 'GET', 
            async: false,
            data: {
                //_path: path, _name: pv_name, _t: new Date().getTime()
            },
            error: function (xml) {
               
                alert("View路徑錯誤");
            },
            success: function (xml) {
                
                simpleBaseMapComponentHtml = xml;
            }
        });
    }
    loadHtml()

    window.BaseMap = (function(){
        const simpleBaseMapComponent = {
            name: 'baseMap',
            mixins: [],
            components: {
              
            },
            template: simpleBaseMapComponentHtml,
            data: function () {
               return {
                testData:[],
                parcelData:[],
                filterData:[],
                parcelAttribute:[],
                parcelChecked:false,
                townshipChecked: false,
                villageChecked:false,
                sectionChecked:false,
                hhiChecked:false,
                areaChecked:false,
                ownerChecked:false,
                waterRouteChecked:false,  
                landuseChecked:false,   
                landsuitChecked:false, 
                landproductChecked:false,
                orthoChecked:false,  
                bivariateChecked: false,   
                filterChecked: false,  
                rawfilterChecked:false,          
                parcelOpacity:100,   
                townOpacity:100, 
                villageOpacity:100,  
                sectionOpacity:100,         
                hhiOpacity:100,
                areaOpacity:100,
                ownerOpacity:100,
                landuseOpacity:100,
                landsuitOpacity:100,
                landproductOpacity:100,
                orthoOpacity:100,
                bivariateOpacity:100,
                filterOpacity:100,
                rawfilterOpacity:100,
                transactionOpacity:100,
                county:'',//指定要篩選的縣市
                cluster_area:1.252, 
                cluster_variance:0.12, 
                cluster_ownership: 0.5495,//分類的條件
                taoyuanParcelLayer:undefined,//地籍圖圖層
                townshipLayer: undefined, //行政區界圖
                villageLayer:undefined, //村里界圖
                sectionLayer:undefined,//段籍圖
                AreaLayer:undefined,//面積圖
                HHILayer:undefined, //HHI分佈圖
                OwnerLayer:undefined, //農地所有權人
                landuseLayer:undefined,//國土利用調查成果圖
                waterRouteLayer:undefined,//農田水利灌排渠道系統圖
                orthoLayer:undefined,//全台灣正射影像圖層
                landSuitLayer:undefined,//農地重要性等級   
                landProductLayer:undefined,//農地自然生產力等級
                bivariateLayer:undefined,//雙變數圖層
                filterLayer:undefined,//產權複雜度原資料
                rawfilterLayer:undefined,//原資料篩選結果
                decisionLayer:undefined,//產權複雜度篩選結果
                transactionLayer: undefined, //農地交易單價
                OwnerLegend:undefined,
                HHILegend:undefined,
                AreaLegend:undefined,   
                BivariateLegend: undefined,  
                transactionLegend:undefined,    
                parcelMin: 5,
                areaMin: 0.014,
                hhiMin: 0.033,
                parcelMax: 145,
                areaMax: 38.5,
                hhiMax: 1,
                stdMax:1.5,
                stdMin:0,
                parcel_areaMin: 0.5,
                parcel_ownerCount_Min: 1,
                parcel_areaMax: 2,
                parcel_ownerCount_Max: 10,
                parcel_hhiMin: 0.01,
                parcel_hhiMax: 1,
                transactionChecked:false,
                //H_AVO:[1.252,0.12,0.5945],
                //Q_AVO:[1.695,0.169,0.5],
                area_sum:'',
                area_std:'',
                aw_hhi:'',
                HHLChecked:false,
                HHHChecked:false,
                HLLChecked:false,
                HLHChecked:false,
                LHLChecked:false,
                LLLChecked:false,
                LHHChecked:false,
                LLHChecked:false,
                hhlLayer:undefined,
                hhhLayer:undefined,
                hllLayer:undefined,
                hlhLayer:undefined,
                lhlLayer:undefined,
                lllLayer:undefined,
                lhhLayer:undefined,
                llhLayer:undefined,               
                bookmarks:[],
                bookmarkScale:[],
                bookmarkName:[],
                inputBookMark:'',                
               }
            },
            watch: {
                parcelChecked:function(){
                    if (this.parcelChecked == true){
                        this.addParcelLayer();
                        //this.getParcelFromServer();
                    } else {
                        this.taoyuanParcelLayer.remove()
                        this.parcelChecked = false;
                    }
                },  
                sectionChecked:function(){
                    if (this.sectionChecked == true){
                        this.addSectionLayer()
                    } else {
                        this.sectionLayer.remove()
                        this.sectionChecked = false;
                    }
                },  
                townshipChecked:function(){
                    if (this.townshipChecked == true){
                        this.addTownshipLayer()
                    } else {
                        this.townshipLayer.remove()
                        this.townshipChecked = false;
                    }
                },  
                villageChecked:function(){
                    if (this.villageChecked == true){
                        this.addVillageLayer()
                    } else {
                        this.villageLayer.remove()
                        this.villageChecked = false;
                    }                    
                },  
                areaChecked:function(){
                    if (this.areaChecked == true){
                        this.addAreaLayer()
                    } else {
                        this.AreaLayer.remove()
                        this.areaChecked = false;
                        this.AreaLegend.remove()
                    }                    
                },
                hhiChecked:function(){
                    if (this.hhiChecked == true){
                        this.addHHILayer()
                    } else {
                        this.HHILayer.remove()
                        this.hhiChecked = false;
                        this.HHILegend.remove()
                    }                    
                },
                ownerChecked:function(){
                    if (this.ownerChecked == true){
                        this.addOwnerLayer()
                    } else {
                        this.OwnerLayer.remove()
                        this.OwnerChecked = false;
                        this.OwnerLegend.remove()
                    }                    
                },           
                landuseChecked:function(){
                    if (this.landuseChecked == true){
                        this.addLanduseLayer()
                    } else {
                        this.landuseLayer.remove()
                        this.landuseChecked = false;
                    }      
                },                       
                landsuitChecked:function(){
                    if (this.landsuitChecked == true){
                        this.addLandSuitLayer()
                    } else {
                        this.landSuitLayer.remove()
                        this.landsuitChecked = false;
                    }
                },
                landproductChecked: function(){
                    if (this.landproductChecked == true){
                        this.addLandProductivityLayer()
                    } else {
                        this.landProductLayer.remove()
                        this.landproductChecked = false;
                    }
                },
                orthoChecked:function(){
                    if (this.orthoChecked == true){
                        this.addOrthoLayer()
                    } else {
                        this.orthoLayer.remove()
                        this.orthoChecked = false;
                    }
                },
                bivariateChecked:function(){
                    if (this.bivariateChecked == true){
                        this.addBivariateLayer()
                    } else {
                        this.bivariateLayer.remove()
                        this.bivariateChecked = false;
                        this.BivariateLegend.remove()
                    }
                },
                transactionChecked:function(){
                    if (this.transactionChecked == true){
                        this.addTransactionLayer()
                    } else{
                        this.transactionLayer.remove()
                        this.transactionChecked = false()
                    }
                },
                HHLChecked:function(){
                    if (this.HHLChecked == true){
                        this.addHHLLayer()
                    } else {
                        this.hhlLayer.remove()
                        this.HHLChecked =  false;
                    }
                },
                HHHChecked:function(){
                    if (this.HHHChecked == true){
                        this.addHHHLayer()
                    } else {
                        this.hhhLayer.remove()
                        this.HHHChecked = false;
                    }
                },
                HLLChecked:function(){
                    if (this.HLLChecked== true){
                        this.addHLLLayer()
                    } else {
                        this.hllLayer.remove()
                        this.HLLChecked = false;
                    }
                },
                HLHChecked:function(){
                    if (this.HLHChecked == true){
                        this.addHLHLayer()
                    } else {
                        this.hlhLayer.remove()
                        this.HLHChecked = false;
                    }
                },
                LHLChecked: function(){
                    if (this.LHLChecked == true){
                        this.addLHLLayer()
                    } else {
                        this.lhlLayer.remove()
                        this.LHLChecked = false;
                    }
                },
                LLLChecked: function(){
                    if (this.LLLChecked == true){
                        this.addLLLLayer()
                    } else {
                        this.lllLayer.remove()
                        this.LLLChecked = false;
                    }
                },
                LHHChecked: function(){
                    if (this.LHHChecked == true){
                        this.addLHHLayer()
                    } else {
                        this.lhhLayer.remove()
                        this.LHHChecked = false;
                    }
                },
                LLHChecked:function(){
                    if (this.LLHChecked == true){
                        this.addLLHLayer()
                    } else {
                        this.llhLayer.remove()
                        this.LLHChecked = false;
                    }
                },
                //opacity:function(){
                //    var self = this;
                //    var layers = Object.values(map._layers)
                //    layers.forEach(lyr => {
                //        if(lyr.options.layers){
                //            var id = lyr._leaflet_id
                //            map._layers[id].setOpacity(self.opacity/100)
                //        }
                //    });
                //}    

                /*調整個別圖層透明度*/
                parcelOpacity:function(){
                    var self = this;
                    this.taoyuanParcelLayer.setOpacity(self.parcelOpacity/100)
                },
                townOpacity:function(){
                    var self = this;
                    this.townshipLayer.setOpacity(self.townOpacity/100)
                },
                villageOpacity:function(){
                    var self = this;
                    this.villageLayer.setOpacity(self.villageOpacity/100)
                },
                sectionOpacity:function(){
                    var self = this;
                    this.sectionLayer.setOpacity(self.sectionOpacity/100)
                },
                ownerOpacity:function() {
                    var self = this;
                    this.OwnerLayer.setOpacity(self.ownerOpacity/100)
                },
                areaOpacity: function(){
                    var self = this;
                    this.AreaLayer.setOpacity(self.areaOpacity/100)
                }, 
                hhiOpacity: function(){
                    var self = this;
                    this.HHILayer.setOpacity(self.hhiOpacity/100)
                },
                landuseOpacity: function(){
                    var self = this;
                    this.landuseLayer.setOpacity(self.landuseOpacity/100)
                },
                landsuitOpacity: function(){
                    var self = this;
                    this.landSuitLayer.setOpacity(self.landsuitOpacity/100)
                },
                landproductOpacity: function(){
                    var self = this;
                    this.landProductLayer.setOpacity(self.landproductOpacity/100)
                },
                orthoOpacity: function(){
                    var self = this;
                    this.orthoLayer.setOpacity(self.orthoOpacity/100)
                },
                bivariateOpacity: function(){
                    var self = this;
                    this.bivariateLayer.setOpacity(self.bivariateOpacity/100)
                },
                filterOpacity: function(){
                    var self = this;
                    this.filterLayer.setOpacity(self.filterOpacity/100)
                },
                rawfilterOpacity: function(){
                    var self = this;
                    this.rawfilterLayer.setOpacity(self.rawfilterOpacity/100)
                },
                transactionOpacity: function(){
                    var self = this;
                    this.transactionLayer.setOpacity(self.transactionOpacity/100)
                },            
            },
            computed: {
            },
            methods: {               
                //********各類圖層設定 *********/
                addParcelLayer:function(){
                    var self= this;
                    this.taoyuanParcelLayer = L.tileLayer.betterWms("http://35.76.62.63:8000/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_parcel' ,
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        attribution:'Taoyuan Land Parcels',
                        zIndex: 850
                    }).addTo(map);          
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                    }                                          
                },
                addSectionLayer:function(){
                    this.sectionLayer = L.tileLayer.wms("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}", {
                        id:"LANDSECT",
                        format: 'image/png',
                        zIndex:850
                    }).addTo(map); 
                },        
                addVillageLayer: function(){
                    this.villageLayer = L.tileLayer.wms("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}", {
                        id:"Village",
                        format: 'image/png',
                        zIndex:850
                    }).addTo(map);
                },
                addTownshipLayer: function(){
                    this.townshipLayer = L.tileLayer.wms("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}", {
                        id:"TOWN",
                        format: 'image/png',
                        zIndex:850
                    }).addTo(map);
                },            
                addAreaLayer:function(){
                    var self = this;
                    this.AreaLayer = L.tileLayer.wms("http://35.76.62.63:8000/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_area_static',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        zIndex: 800,
                        attribution:'Taoyuan Area Size',
                    }).addTo(map);           
                    //加入圖例
                    var legend_url ='http://35.76.62.63:8000/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + 'COA:'+self.county+'_area_static';
                    this.AreaLegend = L.wmsLegend(legend_url);
                    this.AreaLegend.addTo(map);    
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                    }                      
                },
                addOwnerLayer:function(){
                    var self= this;
                    this.OwnerLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_owners_static',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        zIndex: 800
                    }).addTo(map);           
                    //加入圖例
                    var legend_url ='http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=30&HEIGHT=20&LAYER=' + 'COA:taoyuan_owners_static';
                    this.OwnerLegend = L.wmsLegend(legend_url);
                    this.OwnerLegend.addTo(map);        
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                    }                  
                },
                addHHILayer:function(){
                    var self= this;
                    this.HHILayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_hhi',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        zIndex: 800
                    }).addTo(map);           
                    //加入圖例
                    var legend_url ='http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LEGEND_OPTIONS=forceTitle:true&LAYER=' + 'COA:taoyuan_hhi';
                    this.HHILegend = L.wmsLegend(legend_url);
                    this.HHILegend.addTo(map);  
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                    }                        
                },
                addLanduseLayer: function(){
                    this.landuseLayer = L.tileLayer.wms("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}", {
                        id:"LUIMAP",
                        format: 'image/png',
                        zIndex:700
                    }).addTo(map);
                },
                addLandSuitLayer:function(){
                    this.landSuitLayer = L.tileLayer.wms("http://211.22.161.200/arcgis/services/ALDOC_WMS/TALIS_WMS_TW/MapServer/WMSServer?",{
                        layers:'0',
                        format: 'image/png',
                        transparent: true,
                        zIndex:700
                    }).addTo(map);
                },  
                addLandProductivityLayer:function(){
                    this.landProductLayer = L.tileLayer.wms("http://211.22.161.200/arcgis/services/ALDOC_WMS/TALIS_WMS_TW/MapServer/WMSServer?",{
                        layers:'1',
                        format: 'image/png',
                        transparent: true,
                        zIndex:700
                    }).addTo(map);
                },  
                addOrthoLayer: function(){
                    this.orthoLayer = L.tileLayer.wms("https://wmts.nlsc.gov.tw/wmts/{id}/default/GoogleMapsCompatible/{z}/{y}/{x}", {
                        id:"PHOTO2",
                        format: 'image/png',
                        zIndex:600
                    }).addTo(map);
                },  
                addBivariateLayer: function(){
                    this.bivariateLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:taoyuan_bivariate',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        zIndex: 800
                    }).addTo(map);        
                    //加入圖例（自製雙變數圖例圖片）
                    L.Control.Watermark = L.Control.extend({
                        onAdd: function(map) {
                            var img = L.DomUtil.create('img');                    
                            img.src = '../static/image/legend/Bivariate_Legend.png';
                            img.style.width = '150px';       
                            img.style.paddingBottom = '20px';        
                            return img;
                        },                    
                        onRemove: function(map) {
                            // Nothing to do here
                        }
                    });
                    
                    L.control.watermark = function(opts) {
                        return new L.Control.Watermark(opts);
                    };
                    this.BivariateLegend = L.control.watermark({ position: 'bottomright' }).addTo(map);
                },   

                /***產權複雜聚集區加入條件篩選 ****/
                addFilterLayer: function(){
                    var self = this;    
                    var conditon1 = 'area_std <='+ self.stdMax + ' AND '+ 'area_std >='+ self.stdMin;
                    var conditon2 =  'area_sum >=' + self.areaMin+ ' AND '+ 'area_sum <'+ self.areaMax;
                    var conditon3 =  'aw_hhi >=' + self.hhiMin+ ' AND '+ 'aw_hhi <'+ self.hhiMax;
                    this.filterLayer = L.tileLayer.betterWms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        zIndex: 1000,
                        cql_filter: conditon1 + ' AND ' + conditon2 + ' AND ' + conditon3
                    }).addTo(map);   
                    this.filterChecked = true;  
                    this.getParcelFromServer();  
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                    }                     
                },  
                removeFilterLayer: function(){
                    this.filterLayer.remove();
                    this.filterLayer =  undefined;
                    this.filterChecked = false;                   
                },    

                /****************原始農地條件篩選 ****************/
                addRawFilterLayer: function(){
                    var self = this;    
                    var condition1 = 'land_ar >'+ self.parcel_areaMin*10000 + ' AND ' + 'land_ar <='+ self.parcel_areaMax*10000; 
                    var condition2 =  'Count >' + self.parcel_ownerCount_Min + ' AND ' + 'Count <='+ self.parcel_ownerCount_Max; 
                    var condition3 = 'adj_HHI >'+ self.parcel_hhiMin + ' AND ' + 'adj_HHI <='+ self.parcel_hhiMax; 
                    this.rawfilterLayer = L.tileLayer.betterWms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_parcel',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        zIndex: 900,
                        styles:'raw_land_filter',
                        cql_filter: condition1 + ' AND ' + condition2 + ' AND ' + condition3
                    }).addTo(map);   
                    this.rawfilterChecked = true;   
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                    };   
                    this.getParcelFromServer(); 
                    this.getFilterFromServer();                                 
                },    
                removeRawFilterLayer: function(){
                    this.rawfilterLayer.remove();
                    this.rawfilterLayer =  undefined;
                    this.rawfilterChecked = false;
                    this.filterData.length = 0;
                    this.parcelData.length = 0;
                },   

                //------統計資料---------//
                getParcelFromServer:function(){
                    var self = this;   
                    var parcel_url ='http://localhost:8080/geoserver/COA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=COA%3A'+self.county+'_parcel&maxFeatures=50&outputFormat=application%2Fjson'       
                    var promise = new Promise(function(resolve, reject){
                        $('#loading')[0].style.display = 'flex'
                        //save initial api that has already retrieved//
                        $.get(parcel_url, function(data, status){
                            self.parcelData.push(data)
                            $('#loading')[0].style.display = 'none'
                            resolve(self.parcelData)
                        });                        
                    })
                    return promise; 
                    //var parcel_url ='http://localhost:8080/geoserver/COA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=COA%3A'+self.county+'_parcel&maxFeatures=50&outputFormat=application%2Fjson'       
                    //var promise = new Promise(function(resolve, reject){
                    //    $('#loading')[0].style.display = 'flex'
                    //    //save initial api that has already retrieved//
                    //    $.get(parcel_url, function(data, status){
                    //        self.parcelData.push(data.features)
                    //        $('#loading')[0].style.display = 'none'
                    //        resolve(self.parcelData)
                    //    });                        
                    //})
                    //return promise;                                         
                },    
                getFilterFromServer:function(){
                    var self = this;       
                    var condition1 = 'land_ar >'+ self.parcel_areaMin*10000 + ' AND ' + 'land_ar <='+ self.parcel_areaMax*10000; 
                    var condition2 =  'Count >' + self.parcel_ownerCount_Min + ' AND ' + 'Count <='+ self.parcel_ownerCount_Max; 
                    var condition3 = 'adj_HHI >'+ self.parcel_hhiMin + ' AND ' + 'adj_HHI <='+ self.parcel_hhiMax; 
                    var filter_url = 'http://localhost:8080/geoserver/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=COA:'+self.county+'_parcel&outputFormat=application/json&CQL_FILTER='+condition1+'&'+condition2+'&'+condition3
                    var promise = new Promise(function(resolve, reject){
                        $('#loading')[0].style.display = 'flex'
                        //save initial api that has already retrieved//
                        $.get(filter_url, function(data, status){
                            self.filterData.push(data)
                            $('#loading')[0].style.display = 'none'
                            resolve(self.filterData)
                        });                        
                    })
                    return promise;                                         
                },     
                computeStats: function () {
                    var self = this;
                    var geoJSON = self.parcelData[0]
                    console.log(geoJSON)
                },
            
                /** 符合各執行方式(產權複雜聚集區分類) **/
                addHHLLayer: function(){
                    var self = this;           
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                        var area_sum = 1.252;
                        var area_std = 0.12;
                        var aw_hhi = 0.5645;
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                        var area_sum = 1.28;
                        var area_std = 0.169;
                        var aw_hhi = 0.5;
                    }                  
                    var condition = 'area_sum>'+area_sum+ ' AND ' + 'area_std>'+area_std+ ' AND ' + 'aw_hhi>'+aw_hhi
                    this.hhlLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        styles:'Type1',
                        zIndex: 1000,
                        cql_filter: condition
                    }).addTo(map);   
                    this.HHLChecked = true;                  
                },
                addHHHLayer:function(){
                    var self = this;           
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                        var area_sum = 1.252;
                        var area_std = 0.12;
                        var aw_hhi = 0.5645;
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                        var area_sum = 1.28;
                        var area_std = 0.169;
                        var aw_hhi = 0.5;
                    }    
                    var condition = 'area_sum>'+area_sum + ' AND ' + 'area_std>'+area_std+ ' AND ' + 'aw_hhi<='+aw_hhi
                    this.hhhLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        styles:'Type2',
                        zIndex: 1000,
                        cql_filter: condition
                    }).addTo(map);   
                    this.HHHChecked = true; 
                },
                addHLLLayer:function(){
                    var self = this;
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                        var area_sum = 1.252;
                        var area_std = 0.12;
                        var aw_hhi = 0.5645;
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                        var area_sum = 1.28;
                        var area_std = 0.169;
                        var aw_hhi = 0.5;
                    }    
                    var condition = 'area_sum>'+area_sum + ' AND ' + 'area_std<='+area_std+ ' AND ' + 'aw_hhi>'+aw_hhi
                    this.hllLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        styles:'Type3',
                        zIndex: 1000,
                        cql_filter: condition
                    }).addTo(map);   
                    this.HLLChecked = true; 
                },  
                addHLHLayer:function(){
                    var self = this;
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                        var area_sum = 1.252;
                        var area_std = 0.12;
                        var aw_hhi = 0.5645;
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                        var area_sum = 1.28;
                        var area_std = 0.169;
                        var aw_hhi = 0.5;
                    }    
                    var condition = 'area_sum>'+area_sum+ ' AND ' + 'area_std<='+area_std+ ' AND ' + 'aw_hhi<='+aw_hhi
                    this.hlhLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        styles:'Type4',
                        zIndex: 1000,
                        cql_filter: condition
                    }).addTo(map);   
                    this.HLHChecked = true; 
                },              
                addLHLLayer: function(){
                    var self = this;
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                        var area_sum = 1.252;
                        var area_std = 0.12;
                        var aw_hhi = 0.5645;
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                        var area_sum = 1.28;
                        var area_std = 0.169;
                        var aw_hhi = 0.5;
                    }    
                    var condition = 'area_sum<='+area_sum+ ' AND ' + 'area_std>'+area_std+ ' AND ' + 'aw_hhi>'+aw_hhi
                    this.lhlLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        styles:'Type5',
                        zIndex: 1000,
                        cql_filter: condition
                    }).addTo(map);   
                    this.LHLChecked = true; 
                },
                addLLLLayer:function(){
                    var self = this;
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                        var area_sum = 1.252;
                        var area_std = 0.12;
                        var aw_hhi = 0.5645;
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                        var area_sum = 1.28;
                        var area_std = 0.169;
                        var aw_hhi = 0.5;
                    }    
                    var condition = 'area_sum<='+area_sum+ ' AND ' + 'area_std<='+area_std+ ' AND ' + 'aw_hhi>'+aw_hhi
                    this.lllLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        styles:'Type6',
                        zIndex: 1000,
                        cql_filter: condition
                    }).addTo(map);   
                    this.LLLChecked = true; 
                },
                addLHHLayer:function(){
                    var self = this;
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                        var area_sum = 1.252;
                        var area_std = 0.12;
                        var aw_hhi = 0.5645;
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                        var area_sum = 1.28;
                        var area_std = 0.169;
                        var aw_hhi = 0.5;
                    }    
                    var condition = 'area_sum<='+area_sum + ' AND ' + 'area_std>'+area_std+ ' AND ' + 'aw_hhi<='+aw_hhi
                    this.lhhLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        styles:'Type7',
                        zIndex: 1000,
                        cql_filter: condition 
                    }).addTo(map);   
                    this.LHHChecked = true; 
                }, 
                addLLHLayer:function(){
                    var self = this;
                    if (self.county == "taoyuan") {
                        map.setView([24.934999, 121.202545], 12);
                        var area_sum = 1.252;
                        var area_std = 0.12;
                        var aw_hhi = 0.5645;
                    } else {
                        map.setView([23.477892, 120.319866], 12);
                        var area_sum = 1.28;
                        var area_std = 0.169;
                        var aw_hhi = 0.5;
                    }    
                    var condition = 'area_sum<='+area_sum+ ' AND ' + 'area_std<='+area_std+ ' AND ' + 'aw_hhi<='+aw_hhi
                    this.llhLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'COA:'+self.county+'_spatial_cluster',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        styles:'Type8',
                        zIndex: 1000,
                        cql_filter: condition
                    }).addTo(map);   
                    this.LLHChecked = true; 
                },              
                
                // 農地交易圖層//
                addTransactionLayer: function(){
                    this.transactionLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                        layers: 'taoyuan_farmland_price',
                        format: 'image/png',
                        transparent: true,
                        version: '1.1.0',
                        zIndex: 1000                   
                    }).addTo(map);   
                    this.transactionChecked = true;
                    //加入圖例
                    var legend_url ='http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=30&HEIGHT=20&LAYER=' + 'COA:taoyuan_farmland_price';
                    this.transactionLegend = L.wmsLegend(legend_url);
                    this.transactionLegend.addTo(map);    
                },
                //-----疊圖篩選測試------
                //addTransactionLayer: function(){
                //    this.transactionLayer = L.tileLayer.wms("http://localhost:8080/geoserver/COA/wms", {
                //        layers: "COA:taoyuan_farmland_price,COA:taoyuan_county",
                //        format: 'image/png',
                //        transparent: true,
                //        version: '1.1.0',
                //        zIndex: 1000, 
                //        Request: 'GetMap',
                //        cql_filter: "INTERSECTS(the_geom, querySingle('taoyuan:taoyuan_county', 'the_geom','TOWNCODE = 68000130')); INCLUDE"
                //    }).addTo(map);   
                //    this.transactionChecked = true;
                //},
                //********* 設定地圖書籤 *******//
                addBookMarks: function () {
                    var currentLat =  map.getCenter().lat;
                    var currentLng =  map.getCenter().lng;
                    var currentScale = map.getZoom();
                    this.bookmarkName.push(this.inputBookMark);
                    this.bookmarks.push([currentLat, currentLng]); 
                    this.bookmarkScale.push(currentScale)
                    this.inputBookMark = ''; //clearImput
                  },
                removeBookMarks: function (index) {
                  this.bookmarks.splice(index, 1);
                  this.bookmarkScale.splice(index, 1); 
                  this.bookmarkName.splice(index, 1); // 使用陣列方法splice(指定的index開始，刪除一筆)，依照抓到的 index 刪除
                },
                zoomToBookMarks:function(index) {
                    map.setView(this.bookmarks[index],this.bookmarkScale[index])
                  
                },
                clearBookMarks: function () {
                  // 清除所有
                  this.bookmarks = [];
                  this.bookmarkScale = [];
                  this.bookmarkName = [];
                }
            },
            mounted: function () {
            }
        };
        return {
            simpleBaseMapComponent: simpleBaseMapComponent
        }
    }())
    return BaseMap
}); 
