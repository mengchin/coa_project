const common_api_url = "http://127.0.0.1:8000/api/geoland/";
const UI_Control = {}
/****
 *  Vuex 處理
 */
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
      orginalTaoyuanData :[],
      ClusterArea: [],
      ClusterLayer: undefined,

    },
    mutations: {
    }
  })
/*******
 *  共用方法
 *******/ 
var calculationMixins = {
    data:function () {
        return {
            testData:[],
            colors:[]
        };
    },
    methods: {
      getTestMixins: function () {
        var self = this;
        var promise = new Promise(function(resolve, reject){
            $('#loading')[0].style.display = 'flex'
            $.get(common_api_url+'test_shp', function(data, status){
                self.testData = data.shapes
                self.testData.forEach(function(item){
                    item.hhi = parseFloat(item.hhi)
                })
                resolve(self.testData)
            });
        })
        return promise;
      }
    }
  }

/********************************
 * 設定要轉換語言的項目
 * *****************************/
const messages = {
    en: {
      title: {
        websitename: 'COA Land Fragmentation Evaluation System Test',
        basemapComponentName: 'BaseMap',
        calculationComponentName: 'HHI Calculation',
        spatialComponentName: 'Spatial Anaylsis',
        rankComponentName: 'Rank Fragmented Areas',
      },
      basemap:{
        basemapName: 'Taoyuan Land Parcels',
        classAttributes: 'Attributes',
        classNumber: 'Number of Classes',
        classifyMethod: 'Classification',
        opacity: 'Transparancy'
      },
      calculation:{
        getparcelData: 'Retrieve farmland data',
        firststep: 'First Step',
        secondstep: 'Second Step',
        thirdstep: 'Third Step',
        start: 'Start HHI calculation',
        choose: 'Choose land parcels',
        choosewarning: "if you have done selection, just click button 'Show HHI'",
        calculate: 'Show HHI'

      },
      spatialanalysis:{
        methodAlert: 'Please select a method for spatial analysis.',
        layerAlert: 'Please execute spatial analysis before displaying results.',
        removeAlert: 'Please remove the existing layer.',
        spatialTitle1: 'Spatial Analysis: Global',
        spatialTitle2: 'Spatial Analysis: Local',
        defineMethod: 'Choose Spatial Analysis Approach',
        executeGlobal: 'Start Analysis',
        executeMethod: 'Start Spatial Analysis',
        removeSpatialLayer: 'Remove Layer',
        showSpatialLayer: 'Display Layer',
        clusterTitle: 'Calculate Attributes',
        mergeSpatialParcels: 'Start Calculation',
        showClusterLayer: 'Display Layer',
        removeClusterLayer: 'Remove Layer',
        showMoranPlot: "Display Moran's Scatter Plot",
        MoranPlot: "Moran's I Test: HHI"
      },
      rankareas: {
        ranktitle: 'Rank Areas by Defined Conditions',
        firstep: 'First Step',
        secondstep: 'Second Step',
        firstcondition:'First Condition',
        secondcondition:'Second Condition',
        getGstarData: 'Retrieve clustered area data',
        setconditions: 'Set rank conditions',
        restriction: 'Restricted Conditions',
        rankevaluation: 'Ranked Conditions',
        areasize: 'Sum of area size is larger than (unit:ha)',
        parcelsum: 'Total number of parcels in this area',
        showrank: 'Show Ranked Result',
        clearrank:'Clear Conditions',
        startrank:'Start Evaluation',
        ranklist: 'Rank List'

      }     
      
    },
    tw: {
      title: {
        websitename: '行政院農業委員會地理資訊測試系統',
        basemapComponentName: '套疊圖層',
        calculationComponentName: '係數計算',
        spatialComponentName: '空間分析',
        rankComponentName: '條件排序',
      },
      basemap:{
        basemapName: '桃園市地籍圖',
        classAttributes: '分類欄位',
        classNumber: '類別數',
        classifyMethod: '分類方式',
        opacity: '透明度'
      },
      calculation:{
        getparcelData: '載入農地資料',
        firststep: '第一步',
        secondstep: '第二步',      
        thirdstep: '第三步',
        start: '開始計算',
        choose: '選擇農地',
        choosewarning: '若已在地圖上選擇農地,則點選『顯示HHI』查看農地產權複雜度',
        calculate: '顯示HHI'
      },
      spatialanalysis:{
        methodAlert: '請先選擇空間分析方法',
        layerAlert: '請先執行空間分析',
        removeAlert: '請先清除原有圖層',
        spatialTitle1: '產權複雜度空間分析：全域',
        spatialTitle2: '產權複雜度空間分析：區域',
        defineMethod: '選擇空間分析方法',
        executeGlobal: '開始分析',
        executeMethod: '執行空間分析',
        removeSpatialLayer: '清除空間分析結果',
        showSpatialLayer: '顯示空間分析結果', 
        clusterTitle: '產權複雜農地聚集區屬性計算',
        mergeSpatialParcels: '合併計算集中區內屬性',
        showClusterLayer: '繪製產權複雜集中區',
        removeClusterLayer: '清除集中區圖層',
        showMoranPlot: "顯示Moran's I 散佈圖",
        MoranPlot: "產權複雜度HHI Moran's I 檢定結果"
      },
      rankareas:{
        ranktitle: '設定條件排序產權複雜聚集區',
        firstep: '第一步',
        secondstep: '第二步',
        firstcondition:'條件ㄧ',
        secondcondition:'條件二',
        getGstarData: '載入產權聚集區資料',
        setconditions: '設定排序條件',
        restriction: '約制條件',
        rankevaluation: '排序條件',     
        areasize: '總面積需大於 (單位：公頃）',
        parcelsum: '區域內農地總筆數大於',
        showrank: '顯示排序結果',
        clearrank:'清除並重新排序',
        startrank:'開始排序',
        ranklist: '排序列表'
      }     
    }
}

const i18n = new VueI18n({
    locale: 'tw',
    messages,
})

/********************************
 *  主要 Vue app  
 * ******************************/ 
const app = new Vue({    
    el: '#app',
    i18n:i18n,
    store: store,
    mixins:[calculationMixins],
    //components:{" baseMapComponent" : UI_BaseMap_Component},
    data: function () {
        return {
            currentComponentName:"",
            toShowPanelInfoContainer:false,
        };
    },
    watch:{
    },
    methods: {
        shrinkPanel:function(){},
        btnZoomHandler: function (isZoomIn) {
            if (isZoomIn) {
                map.zoomIn();
            } else {
                map.zoomOut();
                
            }
        },
        /**
         * 初始基本套疊圖層
         */
        initBaseLayer:function(){
            const map = L.map('map',{zoomControl: false}).setView([24.934999, 121.202545], 12);
            //設為全域 
            window.map  = map
            // 設定地圖名稱以及對應的TileLayer
            var mapLayers = {
                '臺灣通用電子地圖(新)': L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP98/default/GoogleMapsCompatible/{z}/{y}/{x}', {
                    attribution: '&copy; <a href="https://wmts.nlsc.gov.tw">NLSC</a>'
                }),
                'Carto Map': L.tileLayer('http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                    attribution: '&copy;'
                }), 
                'OpenStreetMap': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                })
            }
            mapLayers['臺灣通用電子地圖(新)'].addTo(map); // 使用中文地圖作為預設
            L.control.layers(mapLayers).addTo(map); // 加入地圖切換控制項

        },
        /**
         * 初始化 zoom-in zoom-out
         */
        initZoomIn:function(){
            var zoomLevel = document.getElementById("zoomLevel");
            zoomLevel.innerText = " zoom 層級 :" + map.getZoom()
            map.on('zoomend', function () {
            
                zoomLevel.innerText = "zoom 層級 :" + map.getZoom()
            });
            map.addEventListener('mousemove', function (evt) {
                var span = document.getElementById('currentWGS84Txt')
                span.innerText = " " + evt.latlng.lng.toFixed(6) + ", " + evt.latlng.lat.toFixed(6) + " ";
                
            });
        },
        /**
         * 地圖放大縮小按鈕位置調整
         */
        changeZoomBtnPos:function(){
            //add zoom control with your options
            L.control.zoom({
                 position:'topright'
            }).addTo(map);
        },
        changeCurrentComponentName:function(componentName){
            this.toShowPanelInfoContainer = true;
            this.currentComponentName = componentName
        },
        closePanel:function(){
            this.toShowPanelInfoContainer = false;
            this.currentComponentName = ""
        },
        getTaoyuanFromDB:function(){
            var self = this;
            //if(self.geoJsonLayer){self.geoJsonLayer.remove()}
            self.getTestMixins().then(function(){
                $('#loading')[0].style.display = 'none'
                 self.$store.state.orginalTaoyuanData = self.testData
            })
        },
         /**
          * add layer
        */
          addLayer:function(){
            var taoyuanLayer = L.tileLayer.wms("http://localhost:8080/geoserver/taoyuan/wms", {
                layers: 'taoyuan:Gentaoyuan',
                format: 'image/png',
                transparent: true,
                version: '1.1.0',
                attribution: "test"
            });
            taoyuanLayer.setOpacity(1)
            taoyuanLayer.addTo(map);

        },
    
        changeLanguage(lang) {
            this.$i18n.locale = lang;
          },

    },
    beforeCreate:function (){
        var vm = this;
        if (Object.keys(vm.$options.components).length < 1) {
            require(['static/js/components/UI_BaseMap','static/js/components/UI_Calculation', 'static/js/components/UI_SpatialAnalysis', 'static/js/components/UI_RankConditions'], function (UI_BaseMapComponents,UI_CalculationComponents, UI_SpatialComponents, UI_RankComponents) {
              
                for (var key in UI_BaseMapComponents) {
                    vm.$options.components[key] = UI_BaseMapComponents[key];
                }
                for (var key in UI_CalculationComponents) {
                    vm.$options.components[key] = UI_CalculationComponents[key];
                }
                for (var key in UI_SpatialComponents) {
                    vm.$options.components[key] = UI_SpatialComponents[key];
                }
                for (var key in UI_RankComponents) {
                    vm.$options.components[key] = UI_RankComponents[key];
                }
            });
        }
    },
    created:function(){
        var self = this;
        
    },
    mounted: function () {
        var self = this;
        //執行地圖初始化的相關方法
        self.initBaseLayer();
        self.initZoomIn();
        self.changeZoomBtnPos();
        //self.getTaoyuanFromDB();
        //測試 套疊 QGIS 產生的 style 的 桃園資料圖層
        //self.addLayer();        
    }
   
        
});
window.app = app  



