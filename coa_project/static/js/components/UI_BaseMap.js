define([],function(){
    //載入html
    var baseMapComponentHtml = "";
    var website_url = "http://127.0.0.1:8000/" 
    var loadHtml = function(){
        $.ajax({
            url: 'static/componentTemplates/baseMap/baseMapComponent.html', 
            type: 'GET', 
            async: false,
            data: {
                //_path: path, _name: pv_name, _t: new Date().getTime()
            },
            error: function (xml) {
               
                alert("View路徑錯誤");
            },
            success: function (xml) {
                
                baseMapComponentHtml = xml;
            }
        });
    }
    loadHtml()

    window.BaseMap = (function(){
        const baseMapComponent = {
            name: 'baseMap',
            mixins: [],
            components: {
              
            },
            template: baseMapComponentHtml,
            data: function () {
               return {
                checked:false, //開關圖層
                opacity:100, //地圖透明度初始值             
                taoyuanLayer:undefined,//地籍圖圖層
                legend:undefined,
                class_method: '', //指定屬性分類分段方式
                classifyattributes: '',//指定要顯示的屬性
                classnumbers: '', //指定類別數
                parcels:[], //拉完地籍圖原始api後存在此陣列
                showMapClass:false,//展開條件指定列
                classifycolumn: '', //指定要顯示的屬性
                parcelLayer:undefined, //地籍圖圖層
                classification: '', //指定屬性分類分段方式
               }
            },
            watch: {
                checked:function(){
                    if (this.checked == true){
                        this.addLayer()
                    } else {
                        this.taoyuanLayer.remove()
                        this.legend.remove()
                    }
                },
                opacity:function(){
                    var self = this;
                    var layers = Object.values(map._layers)
                    layers.forEach(lyr => {
                        if(lyr.options.layers){
                            var id = lyr._leaflet_id
                            map._layers[id].setOpacity(self.opacity/100)
                        }
                    });
                }
            },
            computed: {
            },
            methods: {
                removeLayer: function(){
                    var self = this;
                    this.taoyuanLayer.remove();
                    this.taoyuanLayer =  undefined;
                    this.checked = false;
                },
 
                addLayer:function(){
                    var self = this; 
                    //指定類別分類
                    var layerstyle = self.classifyattributes +'_'+ self.class_method + '_' + self.classnumbers;
                    this.taoyuanLayer = L.tileLayer.wms("http://localhost:8080/geoserver/taoyuan/wms", {
                        layers: self.classifyattributes ,
                        format: 'image/png',
                        transparent: true,
                        styles: layerstyle,
                        version: '1.1.0',
                        attribution:'taoyuan land parcels',
                        zIndex: 1000
                    });
                    this.taoyuanLayer.addTo(map);           
                    //加入圖例
                    var legend_url ='http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + self.classifyattributes;
                    this.legend = L.wmsLegend(legend_url);
                    this.legend.addTo(map);        
                },


                /**
                 * 自行指定類別
                 */
                //拉桃園市地籍圖的API
                getParcels: function () {
                    var self = this;
                    var promise = new Promise(function(resolve, reject){
                        $('#loading')[0].style.display = 'flex'
                        $.get(website_url+'api/geoland/hotspots', function(data, status){
                            self.parcels.push(data)
                            $('#loading')[0].style.display = 'none'
                            resolve(self.parcels)
                        });
                    })
                    return promise;
                  },
                
                // 縮放指定分類的條件//
                goToMapClass: function(){
                    this.showMapClass = true;
                },

                // Draw Layer//
                addParcelLayer: function(parcelFeature){
                    var self = this;   
                    var parcelFeature = this.parcels[0];            
                    var layer = L.choropleth(parcelFeature,{
                        valueProperty: self.classifycolumn, // which property in the features to use
	                    scale: ['yellow', 'red'], // chroma.js scale - include as many as you like
	                    steps: self.classnumbers, // number of breaks or steps in range
	                    mode: self.classification, // q for quantile, e for equidistant, k for k-means
	                    style: {
		                    color: 'black', // border color
		                    weight: 2,
		                    fillOpacity: 0.8
	                    },
                    }).addTo(map);
                    self.parcelLayer = layer
                },

                initDraggable:function(){
                    $(".panel-info-container").draggable();
                }
            },
            mounted: function () {
                this.initDraggable();
            }
        };
        return {
            baseMapComponent: baseMapComponent
        }
    }())
    return BaseMap
}); 