define([],function(){
    //載入html
    var calculationComponentHtml = "";
    var loadHtml = function(){
        $.ajax({
            url: 'static/componentTemplates/calculation/calculationComponent.html', 
            type: 'GET', 
            async: false,
            data: {
            },
            error: function (xml) {
                alert("html path error");
            },
            success: function (xml) {
                calculationComponentHtml = xml;
            }
        });
    }
    loadHtml()

    window.Calculation = (function(){
        /********************************
         *  共用 撈資料 api
         * ******************************/
        var calculationComponentMixins = {
            data:function () {
                return {
                    testData:[],
                    colors:['#74a77b','#b9c799','#f3e8c6','#ebba88','#e88462','#de425b']  //小到大
                };
            },
            methods: {
              getTestMixins: function () {
                var self = this;
                var promise = new Promise(function(resolve, reject){
                    $.get(common_api_url+'test_shp', function(data, status){
                        self.testData = data.shapes
                        self.testData.forEach(function(item){
                            item.hhi = parseFloat(item.hhi)
                        })
                        resolve(self.testData)
                    });
                })
                return promise;
              },
              checkColorByRangeMixin:function(range,values){
                 var self = this;
                 var valuesColor = []
                 values.forEach(function(val){
                     if(val >= range[0] && val <  range[1] ){
                         valuesColor.push(self.colors[0])
                     }
                     if(val >= range[1] && val <  range[2]){
                        valuesColor.push(self.colors[1])
                     }
                     if(val >= range[2] && val <  range[3]){
                        valuesColor.push(self.colors[2])
                     }
                     if(val >= range[3] && val <  range[4]){
                        valuesColor.push(self.colors[3])
                     }
                     if(val >= range[4] && val <  range[5]){
                        valuesColor.push(self.colors[4])
                     }
                     if(val >= range[5] && val <=  range[6]){
                        valuesColor.push(self.colors[5])
                     }
                 })
                 return valuesColor
              },
              changeColorByAttributeMixin:function(geoJsonlayer){
                var values = []
                for (let item of  geoJsonlayer.toGeoJSON().features){
                    values.push(item.properties.hhi)
                }
                var max = values.reduce(function(a, b) {
                    return Math.max(a, b);
                });
                var min = values.reduce(function(a, b) {
                    return Math.min(a, b);
                });
                var interval = (min + max)/6
                var range = [ min, min + interval, min+ 2*interval, min + 3*interval,min + 4*interval, min + 5*interval,max]
                var colors = this.checkColorByRangeMixin(range,values)
                // for (var i = 0; i < geoJsonlayer.toGeoJSON().features.length ; i++){
                //     colorsParcel.push({'name': geoJsonlayer.toGeoJSON().features[i].properties.name , 'color':colors[i]})
                // }
                var i = 0
                this.geoJsonLayer.eachLayer(function(item){
                    item.setStyle({fillColor:colors[i]})
                    i+= 1
                })

            },
            }
          }
        const calculationComponent = {
                    name: 'calculation',
                    mixins: [calculationComponentMixins],
                    components: {

                    },
                    template: calculationComponentHtml,
                    data: function () {
                       return {
                            chosenPolygons:[],
                            geoJsonLayer:undefined,
                            showPanelHHI:false,
                            taoyuanData:[],
                            geoJsonFormatData:[], //geojson 格式的資料

                       }
                    },
                    watch: {
                        taoyuanData:function(){
                            return this.$store.state.orginalTaoyuanData
                        }
                    },
                    computed: {

                    },
                    methods: {
                            shrinkPanel:function(){},
                            addGeoJsonLayer:function(geoJsonData){
                                var self = this;
                                var layer = L.geoJSON(geoJsonData,{
                                    onEachFeature:self.onEachShape
                                }).addTo(map);
                                self.geoJsonLayer = layer
                            },
                            addGeoJsonDataByDragMap:function(intersect){
                                if(this.geoJsonLayer !== undefined){
                                    // 判斷是否重複繪製
                                    //create hashMap 減少 time complexity
                                    var hashMap = {}
                                    for (let feature of this.geoJsonLayer.toGeoJSON().features) {
                                        if(hashMap[feature.properties.name] == undefined){
                                            hashMap[feature.properties.name] = 1
                                        }
                                    }
                                    var filteredData = intersect.filter(function(item){
                                        //如果未繪製過 則要進行繪製
                                        if( hashMap[item.properties.name] == undefined ){
                                            return item
                                        }
                                    })
                                    this.geoJsonLayer.addData(filteredData)
                                    this.changeColorByAttributeMixin(this.geoJsonLayer)
                                    $('#loading')[0].style.display = 'none'
                                }
                            },
                            /**
                             * 根據四角範圍去繪製地圖
                             */
                             getDataByMapExtent:function(){
                                 var self = this
                                 self.taoyuanData = self.$store.state.orginalTaoyuanData
                                 $('#loading')[0].style.display = 'flex'
                                 self.geoJsonFormatData = self.convertToGeoJson(self.taoyuanData)
                                 var intersect = self.checkIsIntersect(self.geoJsonFormatData)
                                 //繪製地圖
                                 self.addGeoJsonLayer(intersect);
                                 //註冊地圖拖曳事件 要動態載入 shape
                                 map.on("dragend",function(){
                                     //check zoom level
                                     if(map.getZoom() > 13){
                                        //確認目前地圖範圍有交集哪些資料
                                        var intersecByDrag = self.checkIsIntersect(self.geoJsonFormatData)
                                        //確認目前地圖已繪製哪些shape
                                        $('#loading')[0].style.display = 'flex'
                                        self.addGeoJsonDataByDragMap(intersecByDrag);
                                     }else{
                                         alert("Please narrow down the scope (zoom level), or it won't load new data")
                                     }
                                 })

                             },
                             /**
                              * 確認是否有和當前四角交集的資料
                              * @param {*} geoJsonData  geoJson格式的資料
                              * @returns geoJson格式的資料
                              */
                             checkIsIntersect:function(geoJsonData){
                                this.orginalGeoJsonData = geoJsonData
                                var mapPoly  = {
                                    "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                      "type": "Polygon",
                                      "coordinates": [[
                                        [map.getBounds()._northEast.lng, map.getBounds()._northEast.lat],
                                        [map.getBounds().getSouthEast().lng, map.getBounds().getSouthEast().lat],
                                        [map.getBounds().getSouthWest().lng,map.getBounds().getSouthWest().lat],
                                        [map.getBounds().getNorthWest().lng,map.getBounds().getNorthWest().lat],
                                        [map.getBounds()._northEast.lng, map.getBounds()._northEast.lat]
                                      ]]
                                    }
                                  }
                                var intersect = geoJsonData.filter(function(item){
                                    var intersection = turf.intersect(mapPoly,item)
                                    if(intersection !== null){ return item }
                                 })
                                 console.log('總共有 = ', intersect.length)
                                 $('#loading')[0].style.display = 'none'
                                 return intersect
                             },

                            /**
                             * 從資料庫撈取資料
                             */
                            getTestFromDB:function(){
                                var self = this;
                                if(self.geoJsonLayer){self.geoJsonLayer.remove()}
                                this.getTestMixins().then(function(){
                                    var collection = self.convertToGeoJson(self.testData)
                                    var layer = L.geoJSON(collection,{
                                        onEachFeature:self.onEachShape
                                    }).addTo(map);

                                    self.geoJsonLayer = layer
                                    map.panTo(layer.getBounds().getCenter());
                                    //map.panTo(new L.LatLng(22.33062601424799,120.8807663173828))
                                });
                            },
                            /**
                             * 將資料庫的 binary geometry  格式轉換成 wkt 格式並組成 geojson
                             * Wicket package (https://gis.stackexchange.com/questions/162842/convert-wkt-to-geojson-with-leaflet)
                             * @param {*} dataArray
                             * @returns
                             */
                            convertToGeoJson:function(dataArray){
                                var collection = []
                                //var collection = {"type":"FeatureCollection","features":[]}
                                dataArray.forEach(function(item){
                                    var wkt_geom = item.geom
                                    var wkt = new Wkt.Wkt();
                                    wkt.read(wkt_geom);
                                    var feature = { "type": "Feature",'properties': {name:item.name, hhi: item.hhi} , "geometry": wkt.toJson()};
                                    collection.push(feature)
                                })
                                //map.panTo(new L.LatLng(22.33062601424799,120.8807663173828))
                                return collection
                            },
                            /**
                             * 針對 geojson 上每個shape 進行相關事件註冊
                             * @param {*} feature  shape
                             * @param {*} layer  geojson 圖層
                             */
                            onEachShape:function(feature, layer){
                                var self = this; /*  */
                                layer.on('mouseover', function (e) {
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
                            /**
                             * 產製 infowindow 內容
                             */
                            generateInfowindowsTemplate:function(properties){
                                var tempate = "<div class='d-flex flex-column'>"
                                var keys = Object.keys(properties)
                                for (var i= 0; i< keys.length ; i++) {
                                    var value = properties[keys[i]];
                                    var row = "<div> "+ keys[i] +" : " +  value + "</div>"
                                    tempate += row
                                }
                                tempate += "</div>";
                                return tempate;
                            },
                            calculateHHI:function(){
                                debugger
                              //移除 geojson click 事件
                              //計算係數HHI
                              var text = "";
                              this.chosenPolygons.forEach(function(item){
                                  text += item.properties.name + " | "
                              })
                              alert("you have choose those polygons : " + text)
                            },
                            choosePolygonForHHI:function(){
                               var self = this;
                               if(self.geoJsonLayer != undefined){
                                   self.geoJsonLayer.on('click',function(e){
                                       var clickedPolygon = e.sourceTarget.feature
                                       e.sourceTarget.setStyle({fillColor:"red"})
                                       self.chosenPolygons.push(clickedPolygon)
                                   })
                               }
                            },
                            goToHHIcalculate:function(){
                                this.showPanelHHI = true;
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
                    calculationComponent: calculationComponent
                }
        }())
    return Calculation
});