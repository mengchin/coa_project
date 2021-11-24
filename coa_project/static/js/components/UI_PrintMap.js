define([], function() {
   //載入html
   var printComponentHtml = "";
   var loadHtml = function(){
       $.ajax({
           url: 'static/componentTemplates/print/printComponent.html', 
           type: 'GET', 
           async: false,
           data: {
           },
           error: function (xml) {
               alert("html path error");
           },
           success: function (xml) {
                printComponentHtml = xml;
           }
       });
   }
   loadHtml()

   window.PrintMap = (function(){       
       const printComponent = {
            name: 'print',
            mixins: [],
            components: {
            },
            template: printComponentHtml,
            data: function () {
                return { 
                    printform: {
                        printTitle: '',
                        printDescription:''
                    },
                    print: undefined,                     
                }           
            },
            watch:  {
            },
            props:{ 
            },
            computed: { 
               
            }, 
            methods: {                
                PrintMap: function(){                       
                    window.print();  
                },
                initDraggable:function(){
                    $(".panel-info-container").draggable();
                },
                              
            },
            mounted: function () {
                this.initDraggable();
            }
        };
        return {
            printComponent: printComponent
        }
   }())
   return PrintMap    

});
