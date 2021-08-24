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
                parcelChecked:false,
                hhiChecked: false,
                opacity:100, //地圖透明度初始值             
                taoyuanLayer:undefined,//地籍圖圖層
                taoyuanHHILayer:undefined,//HHI圖層
                legend:undefined
               }
            },
            watch: {
                parcelChecked:function(){
                    if (this.parcelChecked == true){
                        this.addParcelLayer()
                    } else {
                        this.taoyuanLayer.remove()
                        this.parcelChecked == false;
                    }
                },
                hhiChecked:function(){
                    if (this.hhiChecked == true){
                        this.addHHILayer()
                    } else {
                        this.taoyuanHHILayer.remove()
                        this.legend.remove()
                        this.hhiChecked == false;
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
                removeParcelLayer: function(){
                    var self = this;
                    this.taoyuanLayer.remove();
                    this.taoyuanLayer =  undefined;
                    this.parcelChecked == false;
                },
 
                addParcelLayer:function(){
                    var self = this; 
                    //指定類別分類    
                    this.taoyuanLayer = L.tileLayer.betterWms("http://localhost:8080/geoserver/taoyuan/wms", {
                        layers: 'taoyuan:taoyuan_hhi' ,
                        format: 'image/png',
                        transparent: true,
                        styles: 'taoyuan:taoyuan_general',
                        version: '1.1.0',
                        attribution:'Taoyuan Land Parcels',
                        zIndex: 1000
                    });
                    this.taoyuanLayer.addTo(map);                  
                },
                addHHILayer:function(){
                    var self = this; 
                    //指定類別分類    
                    this.taoyuanHHILayer = L.tileLayer.wms("http://localhost:8080/geoserver/taoyuan/wms", {
                        layers: 'taoyuan:taoyuan_hhi' ,
                        format: 'image/png',
                        transparent: true,
                        styles: 'taoyuan:taoyuan_hhi_jenks_5',
                        version: '1.1.0',
                        attribution:'Calculated HHI value of each Taoyuan land parcels',
                        zIndex: 1000
                    });
                    this.taoyuanHHILayer.addTo(map);           
                    //加入圖例
                    var legend_url ='http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + 'taoyuan:taoyuan_hhi';
                    this.legend = L.wmsLegend(legend_url);
                    this.legend.addTo(map);        
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
            simpleBaseMapComponent: simpleBaseMapComponent
        }
    }())
    return BaseMap
}); 