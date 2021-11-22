define([],function(){
    //載入html
    var newCalculationComponentHtml = "";
    var website_url = "http://127.0.0.1:8000/" 
    var loadHtml = function(){
        $.ajax({
            url: 'static/componentTemplates/newcalculation/newcalculationComponent.html', 
            type: 'GET', 
            async: false,
            data: {
                //_path: path, _name: pv_name, _t: new Date().getTime()
            },
            error: function (xml) {
                               alert("View路徑錯誤");
            },
            success: function (xml) {                
                newCalculationComponentHtml = xml;
            }
        });
    }
    loadHtml()
    //var GetData = function(){
    //    var defaultData = []
    //    var labels = []
    //    $.ajax({
    //        url: 'taoyuan-chart', 
    //        method: 'GET', 
    //        data: {              
    //        },
    //        error: function () {
    //            alert("路徑錯誤");
    //        },
    //        success: function (data) {
    //            labels = data.labels   
    //            defaultData  = data.data  
    //            console.log(labels)        
    //            console.log(defaultData)  
    //        }
    //    });                   
    //}
    //GetData()


    
    window.NewCalculation = (function(){
        const newcalculationComponent = {
            name: 'newCalculation',
            mixins: [],
            components: {
              
            },
            template: newCalculationComponentHtml,
            data: function () {
               return {
                    ChartLabels:[],
                    ChartData:[]
                    }
            },
            watch: {
               
            },
            computed: {
            },
            methods: {    
                GetData:function(){
                    $.ajax({
                        url: 'taoyuan-chart', 
                        method: 'GET', 
                        data: {              
                        },
                        error: function () {
                            alert("路徑錯誤");
                        },
                        success: function (data) {
                            console.log(data.labels)
                        }
                    });                   
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
            newcalculationComponent: newcalculationComponent
        }
    }())
    return NewCalculation
}); 