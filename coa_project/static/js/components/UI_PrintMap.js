define([], function() {
   //載入html
   var printComponentHtml = "";
   var website_url = "http://127.0.0.1:8000/" 
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
                    print: undefined
                     
                }           
            },
            watch:  {
            },
            computed: {
            
            }, 
            methods: {                
                PrintMap: function(){   
                }               
            },
            mounted: function () {
            }
        };
        return {
            printComponent: printComponent
        }
   }())
   return PrintMap    

});