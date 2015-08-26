"use strict";



//handle buttons
function buttons() {


  //************************************************************
  // begin of help functions
  //************************************************************

  function move() {
    /*
    advance in narrative
    */ 
    
    var i_dataIdx = +d3.select(".ink-selected").attr("data-index")
    
    list_ink.forEach(function(d){
        debugger;
        d;
    })
  //   d3.selectAll("bar")
  // .classed("my-selector", function (d, i) {
  //   return !d3.select(this).classed("my-selector");
  // });

    // if (i_dataIdx=="3") {
    //     // d3.select(".ink-selected").attr("class", ".ink-selected")
    //     d3.select("data-index").attr("class", ".ink-selected")
    // } else if (i_dataIdx=="4") {

    // } else {

    // }     
    
    // d3.select(".reset").attr("style","display:none;");   
 
  }; 


  function repaint(i_idx) {
    /*
    advance in narrative
    */ 
    if (i_idx)
    debugger;
    // d3.select(".reset").attr("style","display:none;");   
 
  }; 


  //************************************************************
  // end of help functions
  //************************************************************  


    d3.select(".ink-previous").on("click", move);
    d3.select(".ink-next").on("click", move);

    var list_ink = d3.selectAll(".ink-step")

    list_ink.on("click", function(d) {
        debugger;
       d3.select(".ink-selected")
            .classed(".ink-selected", false);
       d3.select(this)
            .classed(".ink-selected", true);
        });




}//finish function buttons