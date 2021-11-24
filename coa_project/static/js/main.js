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
        updatePrintTitle(state, payload) {
            state.value = payload
        },
        updatePrintDescription(state, payload) {
            state.value = payload
        }
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
        },
    }
  }

/********************************
 * 設定要轉換語言的項目
 * *****************************/
 const messages = {
    en: {
      version:{
        basic:'Basic',
        advanced:'Advanced'
      },
      title: {
        version:'Version',
        websitename: 'COA Land Fragmentation Evaluation System Test',
        basemapComponentName: 'BaseMap',
        calculationComponentName: 'HHI Calculation',
        spatialComponentName: 'Spatial Anaylsis',
        newcalculationComponentName:'Calculation ＆ Statistics',
        rankComponentName: 'Rank Fragmented Areas',
        printComponentName:'Export Map'
      },
      simpleBasemap:{
        navbar_layer: "Layers",
        navbar_decision:"Decision Supports",
        navbar_rawfilter:"Filter Parcels",
        geoboundaries:"Parcels and Boundaries",
        attributes:"Parcel Attributes",
        others: "Others",  
        theme:"Decision Supports", 
        statistics:'Statistics',
        originCount:'Original Data',
        filteredCount:'Filtered Data',
        filteredRatio:'Proportion',
        bivariate:'Bivariate Map Test',
        parcelName: "Farmland Parcels",
        townshipName:'Township Boundaries',
        sectionName:'Land Sections',
        villageName:"Village Boundaries",      
        area: 'Area Size',
        owner: 'Ownership Status',
        hhi:'Land Fragmented Index HHI',
        transactionPrice:"Land Transaction",
        landuseName:'Land Use Investigation Maps',
        waterRouteName:"Water Routes",
        orthoName:"Ortho Image",
        landsuitName:'Farmland Importance Level',
        landproductName:'Farmland Productivity Level',
        opacity:"Opacity",
        cluster:"HHI Spatial Clusters",
        selectCounty:"Select County",
        county:{taoyuan:"Taoyuan",
                chiayi: "Chiayi"
        },
        addBookMarks:'Add Bookmark',
        removeBookMarks:'Remove',
        zoomTo:'ZoomTo',
        clearBookMarks:'Clear All',
        conditionSetting:"Set Conditions",
        land_area:"Area Size(ha)",
        owner_count:"Owner Counts",
        parcelhhi:"HHI",
        transaction:"Transactions",
        parcelcnt:"Number of Parcels",
        area_sum: "Total Area Size (ha)",
        aw_hhi: "Area Weighted HHI",
        area_std:"Std of Area Size",
        filterConditions: "Display Farmlands",
        resetConditions: "Reset",
        type: "AVO Types",
        condition:"Conditions",
        Type1: {title:"Type 1(HHL)",
            condition1:"Total Area Size > 1.252 (ha)",
            condition2:"Standard Deviation of Area Size > 0.12",
            condition3: "Area-weighted HHI > 0.5945"
        },
        Type2: {title:"Type 2(HHH)",
            condition1:"Total Area Size > 1.252 (ha)",
            condition2:"Standard Deviation of Area Size > 0.12",
            condition3: "Area-weighted HHI <= 0.5945"
        },
        Type3:{title:"Type 3(HLL)",
            condition1:"Total Area Size > 1.252 (ha)",
            condition2:"Standard Deviation of Area Size <= 0.12",
            condition3: "Area-weighted HHI > 0.5945"
        },
        Type4:{title:"Type 4(HLH)",
            condition1:"Total Area Size > 1.252 (ha)",
            condition2:"Standard Deviation of Area Size <= 0.12",
            condition3: "Area-weighted HHI <= 0.5945"
        },
        Type5: {title:"Type 5(LHL)",
            condition1:"Total Area Size <= 1.252 (ha)",
            condition2:"Standard Deviation of Area Size > 0.12",
            condition3: "Area-weighted HHI > 0.5945"
        },
        Type6:{ title:"Type 6(LLL)",
            condition1:"Total Area Size<= 1.252 (ha)",
            condition2:"Standard Deviation of Area Size <= 0.12",
            condition3: "Area-weighted HHI > 0.5945"
        },
        Type7:{ title: "Type 7(LHH)",
            condition1:"Total Area Size <= 1.252 (ha)",
            condition2:"Standard Deviation of Area Size > 0.12",
            condition3: "Area-weighted HHI > 0.5945"
        },
        Type8:{  title:"Type 8(LLH)",   
            condition1:"Total Area Size <= 1.252 (ha)",
            condition2:"Standard Deviation of Area Size <=s 0.12",
            condition3: "Area-weighted HHI <= 0.5945"
        }   
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
        spatialTitle1: 'Global',
        spatialTitle2: 'Local',
        spatialTitle: 'Spatial Analysis',
        selectArea:' Select Area',
        defineMethod: 'Choose Spatial Analysis Approach',
        executeGlobal: 'Start Analysis',
        clearGlobal: 'Clear',
        executeMethod: 'Start Analysis',
        clearSpatial: 'Clear Analysis Result',
        removeSpatialLayer: 'Remove Layer',
        showSpatialLayer: 'Display Layer',
        clusterTitle: 'Calculate Attributes',
        mergeSpatialParcels: 'Start Calculation',
        showClusterLayer: 'Display Layer',
        removeClusterLayer: 'Remove Layer',
        showMoranPlot: "Display Moran's Scatter Plot",
        MoranPlot: "Moran's I Test: HHI",
        Intro:"Help",
        Report:"Export Report"
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
      },
      printmap:{
          maptitle: "Map Title ",
          mapdescription: "Map Description"
      }
    },

    tw: {
      version:{
        basic:'簡易版',
        advanced:'專業版'
      },
      title: {
        version:'選擇版本',
        websitename: '行政院農業委員會地理資訊測試系統',
        basemapComponentName: '套疊圖層',
        calculationComponentName: '係數計算',
        newcalculationComponentName:'統計計算',
        spatialComponentName: '空間分析',
        rankComponentName: '條件排序',
        printComponentName:'列印設定'
      },
      simpleBasemap:{
        navbar_layer: "圖層套疊",
        navbar_decision:"決策支援",
        navbar_rawfilter:"農地篩選",
        geoboundaries:"地理區界",
        attributes:"地籍屬性",  
        others: "其他圖層", 
        theme:"決策支援",      
        bivariate:'雙變數地圖測試',
        statistics:'農地資訊敘述統計',
        originCount:'原始資料總農地數',
        filteredCount:'篩選後總農地數',
        filteredRatio:'符合篩選條件的農地比例',
        parcelName: "農地地籍圖",
        sectionName:"全台段籍圖",
        townshipName:'全台行政區界圖',
        villageName:"全台村里界圖",  
        landuseName:'國土利用現況調查成果圖',  
        area: '農地面積大小',
        owner: '農地所有權狀態',
        parcelhhi:"農地產權複雜度HHI",
        hhi:"農地產權複雜度HHI",
        transactionPrice:"農地交易單價",
        waterRouteName:"農田水利灌排渠道系統圖",
        orthoName:"全臺灣正射影像圖",
        landsuitName:'農地重要性等級圖',
        landproductName:'農地自然生產力等級圖',
        opacity:"透明度",
        cluster:"產權複雜度聚集區",
        selectCounty: "指定區域",
        county:{taoyuan:"桃園市",
                chiayi: "嘉義縣"
        },
        addBookMarks:'新增地圖書籤',
        removeBookMarks:'刪除',
        zoomTo:'縮放至',
        clearBookMarks:'清除所有書籤',
        conditionSetting:"設定條件",
        land_area:"農地面積",
        owner_count:"所有權人數",
        transaction:"農地交易紀錄",
        parcelcnt:"聚集區內農地數",
        area_sum: "聚集區面積(公頃)",
        area_std:"聚集區面積標準差",
        aw_hhi: "聚集區面積加權HHI ",
        filterConditions: "篩選合適農地群",
        resetConditions: "重設指定條件",
        type: "產權複雜聚集區類別",
        condition:"需要評估條件",
        Type1: {title:"第一類（HHL）",
            condition1:"聚集區總面積 > 1.252 (公頃)",
            condition2:"聚集區農地面積標準差 > 0.12",
            condition3: "面積加權HHI > 0.5945"
        },
        Type2: {title:"第二類（HHH）",
            condition1:"聚集區總面積 > 1.252 (公頃)",
            condition2:"聚集區農地面積標準差 > 0.12",
            condition3: "面積加權HHI <= 0.5945"
        },
        Type3:{title:"第三類（HLL）",
            condition1:"聚集區總面積 > 1.252 (公頃)",
            condition2:"聚集區農地面積標準差 <= 0.12",
            condition3: "面積加權HHI > 0.5945"
        },
        Type4:{title:"第四類（HLH）",
            condition1:"聚集區總面積 > 1.252 (公頃)",
            condition2:"聚集區農地面積標準差 <= 0.12",
            condition3: "面積加權HHI <= 0.5945"
        },
        Type5: {title:"第五類（LHL）",
            condition1:"聚集區總面積 <= 1.252 (公頃)",
            condition2:"聚集區農地面積標準差 > 0.12",
            condition3: "面積加權HHI > 0.5945"
        },
        Type6:{ title:"第六類（LLL）",
            condition1:"聚集區總面積 <= 1.252 (公頃)",
            condition2:"聚集區農地面積標準差 <= 0.12",
            condition3: "面積加權HHI > 0.5945"
        },
        Type7:{ title: "第七類（LHH）",
            condition1:"聚集區總面積 <= 1.252 (公頃)",
            condition2:"聚集區農地面積標準差 > 0.12",
            condition3: "面積加權HHI <= 0.5945"
        },
        Type8:{  title:"第八類（LLH）",   
            condition1:"聚集區總面積 <= 1.252 (公頃)",
            condition2:"聚集區農地面積標準差 <= 0.12",
            condition3: "面積加權HHI <= 0.5945"
        }
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
      newcalculation:{

      },
      spatialanalysis:{
        methodAlert: '請先選擇空間分析方法',
        layerAlert: '請先執行空間分析',
        removeAlert: '請先清除原有圖層',
        selectArea: '指定分析區域',
        spatialTitle1: '全域',
        spatialTitle2: '區域',
        spatialTitle: '產權複雜度空間分析',
        defineMethod: '選擇空間分析方法',
        executeGlobal: '開始分析',
        clearGlobal: '重新計算',
        executeMethod: '執行空間分析',
        clearSpatial: '清除分析結果',
        removeSpatialLayer: '清除圖層',
        showSpatialLayer: '顯示圖層', 
        clusterTitle: '產權複雜農地聚集區屬性計算',
        mergeSpatialParcels: '合併計算聚集區內屬性',
        showClusterLayer: '繪製產權複雜聚集區',
        removeClusterLayer: '清除聚集區圖層',
        showMoranPlot: "顯示Moran's I 散佈圖",
        MoranPlot: "產權複雜度HHI Moran's I 檢定結果",
        Intro:"幫助",
        Report:"產製報告"
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
      },
      printmap:{
        maptitle: "地圖標題",
        mapdescription: "地圖敘述"
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
    components:{},
    data: function () {
        return {
            currentComponentName:"",
            toShowPanelInfoContainer:false,
            showEnterWindow: false,
            showExpertVersion:false,
            showSimpleVersion:false,
            showSidePanel: false,
            showPrint:false,
            versionCheck:''
        };
    },
    watch:{
    },
    methods: {
        PrintSimpleMap: function(){
            window.print();  
        },
        shrinkSimplePanel: function() {
            this.toShowPanelInfoContainer = false;
        },
        showSimplePanel: function() {
            this.toShowPanelInfoContainer = true;
        },
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
        //切換視窗功能
        enterCheckWindow: function(){
            this.showEnterWindow = true;
        },
        changeCurrentComponentName:function(componentName){
            this.toShowPanelInfoContainer = true;
            this.currentComponentName = componentName
        },
        closePanel:function(){
            this.toShowPanelInfoContainer = false;
            this.currentComponentName = ""
        },
        changeToExpertVersion:function() {
            this.showEnterWindow = false;
            this.showExpertVersion = true;
            this.showSimpleVersion= false;
            this.toShowPanelInfoContainer = false;
        },
        changeToSimpleVersion:function() {
            this.showSimpleVersion= true;
            this.showExpertVersion = false;
            this.toShowPanelInfoContainer = true;
            this.changeCurrentComponentName('simpleBaseMapComponent')
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
            require(['static/js/components/UI_BaseMap','static/js/components/UI_Calculation', 'static/js/components/UI_SpatialAnalysis', 'static/js/components/UI_RankConditions','static/js/components/simpleUI_SpatialAnalysis', 'static/js/components/simpleUI_BaseMap', 'static/js/components/UI_PrintMap','static/js/components/UI_NewCalculation'], function (UI_BaseMapComponents,UI_CalculationComponents, UI_SpatialComponents, UI_RankComponents, simpleUI_spatialComponents, simpleUI_BaseMapComponents, UI_PrintMapComponents,  UI_NewCalculationComponents) {
              
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
                for (var key in simpleUI_spatialComponents) {
                    vm.$options.components[key] = simpleUI_spatialComponents[key];
                }
                for (var key in simpleUI_BaseMapComponents) {
                    vm.$options.components[key] = simpleUI_BaseMapComponents[key];
                } 
                for (var key in UI_PrintMapComponents) {
                    vm.$options.components[key] = UI_PrintMapComponents[key];
                }  
                for (var key in UI_NewCalculationComponents) {
                    vm.$options.components[key] =  UI_NewCalculationComponents[key];
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
window.app = app;



