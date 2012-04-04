//
//  main.js
//
//  A project template for using arbor.js
//
function jump(node) {
    if (node !== null && node.name.match("o")) // 
        location.href = "http://arborjs.org/reference";
}

function loadfile (){
    //var httpObj = jQuery.getJSON("usrl", function (data) {
    //document.write("*** get_data ***");      
    
    var httpObj = $.getJSON("user.json", null, function (data, status) {
      var nodes = data.nodes
      /* $.each (nodes, function (name, info){
              // Ç∆ÇËÇ†Ç¶Ç∏ÅAâΩÇ‡ÇµÇ»Ç¢     
      })
      sys.merge({nodes:nodes, edges:data.edges})
      $("#dataset").html()
      */
      // Ç∆ÇËÇ†Ç¶Ç∏ÅAèoóÕ
        for (i in data) {
            $("#test_result").append(i + ":" + data[i]).append("<br/>");
        }
     return data;
    })
}