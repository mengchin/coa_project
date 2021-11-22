define([],function(){
    //載入html
    var rankComponentHtml = "";
    var website_url = "http://127.0.0.1:8000/"
    var loadHtml = function(){
        $.ajax({
            url: 'static/componentTemplates/rankParcels/rankComponent.html',
            type: 'GET',
            async: false,
            data: {
                //_path: path, _name: pv_name, _t: new Date().getTime()
            },
            error: function (xml) {

                alert("View路徑錯誤");
            },
            success: function (xml) {

                rankComponentHtml = xml;
            }
        });
    }
    loadHtml()

    window.Rank = (function(){
        var self = this;      
        const rankComponent = {
            name: 'rank',
            mixins: [],
            components: {

            },
            template: rankComponentHtml,
            data: function () {
            return {                 
                listproperties:[], //排序列表裡要顯示的東西
                isDisable: false, //設定圖層為未產製的狀態
                showRankCondition:false, //顯示排序條件視窗
                showRankPanel:false, //顯示排序成果列表
                area:null, //篩選農地總面積
                parcelcount:null,  //篩選農地總筆數
                condition_1: 'hhi', //排序條件1
                condition_2: 'area_sum', //排序條件2
               }
            },

            watch: {
            },
            computed: {
            },
            methods: {
                removeLayer: function(){
                    var self = this;
                    this.$store.state.ClusterLayer.remove();
                    this.$store.state.ClusterLayer = undefined;
                    this.isDisable = false;
                },
                
                /**    Retrieve Data from API     **/
                getData: function(){
                    debugger
                    var self = this;
                    if (this.$store.state.ClusterArea.length > 0) {
                        alert("資料已載入,可直接設定篩選條件")
                    } else {
                        // Get data //
                        var promise = new Promise(function(resolve, reject){
                            $('#loading')[0].style.display = 'flex'
                            //save initial api that has already retrieved//
                            $.get(website_url+'api/geoland/hotspots', function(data, status){
                                self.$store.state.ClusterArea.push(data)
                                $('#loading')[0].style.display = 'none'
                                resolve(self.$store.state.ClusterArea)
                            });
                        })
                        return promise;
                    }                    
                },
                // Draw Layer//
                addLayer: function(){   
                    var self = this;
                        if(self.$store.state.ClusterArea.length > 0 && self.isDisable == false) {         
                            var gstarFeature = this.$store.state.ClusterArea[0];                     
                            this.$store.state.ClusterLayer= L.geoJSON(gstarFeature,{
                                filter: function(feature, layer) {
                                    return feature.properties.area_sum > self.area && feature.properties.P_in_cl > self.parcelcount;
                                },
                                onEachFeature: self.addFeatureInfo
                            }).addTo(map);    
                            this.isDisable = true;  

                        } else if(self.$store.state.ClusterArea.length > 0 && self.isDisable == true ){
                            alert("請先清除原有圖層")
                        } else {                            
                            alert("請先載入產權聚集區資料")
                        }                   
                },

                addFeatureInfo: function(feature,layer) {
                    var thisLayer = layer;
                    var $listItem = $('<li>').html("Cluster ID: " + thisLayer.feature.properties.cluster_ID).appendTo('#ranklist ul');
                    $listItem.on('click', function(){
                       var thisbound = thisLayer.getBounds();
                       map.fitBounds(thisbound);
                    });
                },
                
                addRankList: function() {
                    var self = this;
                    var gstarFeature = this.$store.store.ClusterArea[0].feature;
                    self.listproperties.push(gstarFeature)
                },

                goToRankCondition:function(){
                    this.showRankCondition = true;
                },

                goToRankPanel:function(){
                    this.showRankPanel = true;
                    //this.addRankList();
                },

                /**    Initialization of Draggable Panel     **/
                initDraggable:function(){
                    $(".panel-info-container").draggable();

                }
            },
            mounted: function () {
                this.initDraggable();
            }
        };
        return {
            rankComponent: rankComponent
        }
    }())
    return Rank
});