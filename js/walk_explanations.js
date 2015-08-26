"use strict";



//handle buttons
function buttons() {


  //************************************************************
  // begin of help functions
  //************************************************************

  function forward() {
    /*
    advance in the storyline
    */ 
    
    var i_dataIdx = +d3.select(".ink-selected").attr("data-index")
    if (i_dataIdx+1>4){
      var i_now = 4
    }else{
      var i_now = i_dataIdx+1
    }
    
    //repaint
    repaint(i_now)
 
  }; 


  function backward() {
    /*
    go back in the storyline
    */ 
    
    var i_dataIdx = +d3.select(".ink-selected").attr("data-index")
    if (i_dataIdx-1<0){
      var i_now = 0
    }else{
      var i_now = i_dataIdx-1
    }
    
    //repaint index and buttons
    repaint(i_now)
 
  }; 

  function repaint(i_idx) {
    /*
    repaint index and buttons
    */ 

    //what is selected now
    var i_dataIdx = +d3.select(".ink-selected").attr("data-index")    
    //repaint numbers
    list_ink.forEach(function(d){  
      d.forEach(function(e){
        var i_now = +e.attributes['data-index'].value
        if (i_now==i_dataIdx && i_dataIdx!=i_idx){
          d3.select("#" + e.attributes['id'].value).attr("class", "ink-step")
        }else if (i_now==i_idx && i_dataIdx!=i_idx){
          d3.select("#" + e.attributes['id'].value).attr("class", "ink-step ink-selected")
        }
      });      
    })    
     
    //repaint buttons
    if (i_idx==0){
      d3.select(".ink-previous").classed("ink-disabled", true)
      d3.select(".ink-next").classed("ink-disabled", false)
    }else if (i_idx==4){
      d3.select(".ink-previous").classed("ink-disabled", false)
      d3.select(".ink-next").classed("ink-disabled", true)      
    }else{
      d3.select(".ink-previous").classed("ink-disabled", false)
      d3.select(".ink-next").classed("ink-disabled", false)   
    }
 
  }; 


  //************************************************************
  // end of help functions
  //************************************************************  


    d3.select(".ink-previous").on("click", backward);
    d3.select(".ink-next").on("click", forward);

    var list_ink = d3.selectAll(".ink-step")

    list_ink.on("click", function(d) {
      var i_now = +this.attributes['data-index'].value
      repaint(i_now);
       // d3.select(".ink-selected")
       //      .classed(".ink-selected", false);
       // d3.select(this)
       //      .classed(".ink-selected", true);
        });




}//finish function buttons