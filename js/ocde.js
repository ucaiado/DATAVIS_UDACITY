
"use strict";
/**
 * ============================================================
 * Load and plot data from data/boxplot_data.csv and data/
 * countries_agregated.csv.
 *
 * Created on 08/26/2015 
 *
 * @author: 'ucaiado'
 * ============================================================
 */

//************************************************************
// begin of help functions
//************************************************************


function ordinalInvert(f_value, f_width, arr_leftEdges, fc_Scale){
    /**
     * Map a given number from fc_Scale range to a specific label 
     * @param: f_value -  float with the scale number to be classified
     * @param: f_width -  float with the width of each bar
     * @param: arr_leftEdges -  array of floats with left edges from fc_Scale
     * @param: fc_Scale -  scale function used to classify values
     * @return : string of the desired label
     */

    //look for what the minimum and maximum value selected are related to
    var f;
    for(f=0; f_value > (arr_leftEdges[f] + f_width); f++) {}
    return fc_Scale.domain()[Math.min(5,f)]    
}


function boxplot_filter(data, s_filter){
    /**
     * Filter data to be used in box-plot
     * @param: s_filter -  string with the index to be filtered
     * @return : array with the data filtered
     */
    var arr_data = data.filter(function(d){ 
        return  (d['index']==s_filter);
    });

    return arr_data

}

function group_data(bar_data){
     /**
     * sum up data count in box_plot by unique class in index to plot bar chart
     * @return: bar_data - a new array of data filtered 
     */  

    //group data by index, summing up the count
    var bar_data = d3.nest()
        .key(function(d) { return d['index'];})
        .rollup(function(d) { 
            return d3.sum(d, function(g) {
                return g['count'];
            });
        })
        .entries( bar_data.filter(function(d){ 
            //i am not using (2.313, 3.69](2.313, 3.69] because there are too 
            //few datapoints
            return  (d['index']=="(-5.95, -4.573](-5.95, -4.573]") ||
                    (d['index']=="(-4.573, -3.196](-4.573, -3.196]") ||
                    (d['index']=="(-3.196, -1.819](-3.196, -1.819]") ||
                    (d['index']=="(-1.819, -0.441](-1.819, -0.441]") ||
                    (d['index']=="(-0.441, 0.936](-0.441, 0.936]") ||
                    (d['index']=="(0.936, 2.313](0.936, 2.313]");
        }));

    //rename keys
    bar_data.forEach(function(d){
        d.key = d.key.split("]")[0]+"]";
        return d
    });

    return bar_data
};



function filter_to_scatter(scatter_data, s_filter){
    /**
    * Filter the data to be used in the scatter
    */  
    var arr_data = scatter_data.filter(function(d){ 
        return  (d['index']==s_filter);
    });

    return arr_data
}



//************************************************************
// end of help functions
//************************************************************


function instantiateAllplots(data, data2){
    /**
     * Insert all plots at once.
     * plot a histogram of unique social-index buckets in the SocialBars id
     * plot a boxplot of the math scores splited by the time spend studying 
     * buckets
     * @param: data -  array with the data to be used in the bar and boxplot
     * @param: data2 - array with the data to be uses in the scatter plot
     */ 

    //=========begin BARCHART=========
    //group data
    var org_data = data;
    var org_data2 = data2;
    var data = group_data(data);

    // whitespace on either side of the bars in units of MPG
    var bar_margin = {top: 70, right: 10, bottom: 75, left: 10};
    var bar_width = 500 - bar_margin.left - bar_margin.right;
    var bar_height = 400 - bar_margin.top - bar_margin.bottom;
    var i_barWidth =  bar_width + bar_margin.left + bar_margin.right;
    var i_barHeight = bar_height + bar_margin.top + bar_margin.bottom;        
    //calculate the extent of each dimension of the datase
    var values_extent =[0, d3.max(data, function(d) { return d.values; })]

    // Set a map function to convert datum to pixels.
    var bar_xScale = d3.scale.ordinal()
        .domain( data.map(function(d) { return d.key; }))
        .rangeBands([0, bar_width], 0.03);            
        
    var bar_yScale = d3.scale.linear()
        .range([bar_height, 0])
        .domain(values_extent).nice(); 

    var barWidth = bar_width / data.length;

    //construct the SVG container for the chart
    var bar_svg = d3.select("#SocialBars").append("svg")
        .classed('navigator', true)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 "+ i_barWidth + " "+ i_barHeight)
        .append("g")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("transform", "translate(" + bar_margin.left + "," + 
            bar_margin.top + ")");

    // Column chart
    var columnGroup = bar_svg.selectAll(".g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d,i){return "translate(" + i * barWidth + ",0)";});

    // Now you can use both of them to space columns evenly:
    columnGroup.append("rect")
        .attr("class", "column")
        .attr("width", bar_xScale.rangeBand())
        .attr("height", function (d) {
            return bar_height - bar_yScale(d.values);
        })
        .attr("y", function (d){
            return bar_yScale(d.values);
        });

    //append text
    columnGroup.append("text")
        .attr("class", "sociallabel")
            .attr("x", bar_xScale.rangeBand() / 2)
            .attr("text-anchor", "middle")
            .attr("y", function(d) { 
                return bar_yScale(d.values) -15;
            })
            .attr("dy", ".55em")
            .text(function(d) { return d.values })

    bar_svg.append("text")
        .attr("class", "my-canvas-legend my-canvas-legend-bottom")
        .attr("text-anchor", "middle")
        .attr("x", bar_width / 6)
        .attr("y", bar_height + bar_margin.bottom/2)
        .text("Social Status Buckets");             


    //format axis
    var xAxis = d3.svg.axis()
        .scale(bar_xScale)
        .ticks(6)
        .orient("bottom");

    // insert Axis
    bar_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + bar_height + ")")
        .call(xAxis);

    //create the brush component
    var leftEdges = bar_xScale.range();
    var bar_width = bar_xScale.rangeBand();

    var viewport = d3.svg.brush()
        .x(bar_xScale)
        .on("brush", function () {
            //get the slice of the x axis selected
            var aux =viewport.empty() ? [leftEdges[0]+1,leftEdges[5]+1] : viewport.extent()

            //look for what the minimum and maximum value selected are related for
            var l = ordinalInvert(aux[1], bar_width, leftEdges, bar_xScale);
            var f = ordinalInvert(aux[0], bar_width, leftEdges, bar_xScale)
            //update boxplot
            updateBoxplot(f + "" + l);
            updateScatterplot(f + "" + l);

        });

    // add the viewport component to the navigation chart
    bar_svg.append("g")
        .attr("class", "viewport")
        .call(viewport)
        .selectAll("rect")
        .attr("height", bar_height);

    //create function to update the viewport when using storymonde
    function updateViewport(s_filter) {
        /**
         * Update the viewport based on the index of the navigator
         */         
        //set the dimensions for brush
        if (s_filter=="(-5.95, -4.573](0.936, 2.313]") {
            viewport.clear();
        } else {
        //change the extent of the retangle
            var l =s_filter.split("]")
            viewport.extent([bar_xScale(l[0]+"]"), bar_xScale(l[1]+"]") + barWidth]);
        }
        //update the chart
        bar_svg.select('.viewport').call(viewport);
        updateBoxplot(s_filter);
        updateScatterplot(s_filter);

          
    }          

    //=========end BARCHART=========

    //=========begin BOXPLOT=========

    //filter data
    data = boxplot_filter(org_data, "(-5.95, -4.573](0.936, 2.313]")

    //change txt in the description
    d3.select("#otherTitle").text("Math-score by time studied out-of-school");
    var txt = "Describe number of " +
        "weeks and median " +
        "of week.";
    d3.select("#otherTxt").text(txt);        

    // initiate conf variables
    var  box_margin = {top: 100, right: 0, bottom: 90, left: 15};
    var box_width = 550 - box_margin.left - box_margin.right;
    var box_height = 450 - box_margin.top - box_margin.bottom;
    var i_boxWidth =  box_width + box_margin.left + box_margin.right;
    var i_boxHeight = box_height + box_margin.top + box_margin.bottom; 
    

    //calculate the extent of each dimension of the datase
    // var values_extent =[d3.min(data, function(d) { return 0; }), 
    //     d3.max(data, function(d) { return d.upper_whisker*1.05; })]



    var values_extent =[0, 810]        


    //define the function to plot
    var chart = d3.box()
        .width(box_width)
        .height(box_height)
        .domain(values_extent); 

    // define scale function

    // Set a map function to convert datum to pixels.
    var xScale = d3.scale.ordinal()
        .domain( data.map(function(d) { return d["ST57Q01_bk"]; }))
        .rangeBands([0, box_width], 0.7, 0.1);            
        
    // var yScale = d3.scale.linear()
    //     .range([height, 0])
    //     .domain(values_extent).nice(); 
 


    //construct the SVG container for the chart
    var box_svg = d3.select("#BoxPlot").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 "+ i_boxWidth + " "+ i_boxHeight)
        .append("g")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("transform", "translate(" + box_margin.left + "," + 
            box_margin.top + ")");

    
    // draw the boxplots    
    var my_box = box_svg.selectAll(".box")      
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { 
            return "translate(" +  xScale(d["ST57Q01_bk"])  + "," + 0 + ")"; 
        } )
      .call(chart.width(xScale.rangeBand())); 


    //plot the axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    // insert Axis
    box_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + box_height + ")")
        .call(xAxis);


    function updateBoxplot(s_filter){
        //  *
        //  * Update the boxplot based on the filter passed
        //  * @param: s_filter -  string with the index to be filtered

        //get data
        var data2 = boxplot_filter(org_data, s_filter)
        my_box.data(data2).call(chart.duration(1000))
    }


    //=========end BOXPLOT=========




    //=========begin SCATTER=========

    //filter data
    var s_filter = "(-5.95, -4.573](0.936, 2.313]"
    var data2 = filter_to_scatter(org_data2, s_filter);
    // debugger;

    // whitespace on either side of the bars in units of MPG
    // var bar_margin = {top: 70, right: 10, bottom: 75, left: 10};
    var scatter_margin = {top: 70, right: 10, bottom: 120, left: 50};
    var scatter_width = 420 - scatter_margin.left - scatter_margin.right;
    var scatter_height = 400 - scatter_margin.top - scatter_margin.bottom;
    var i_scatterWidth =  scatter_width + scatter_margin.left + scatter_margin.right;
    var i_scatterHeight = scatter_height + scatter_margin.top + scatter_margin.bottom;

    //calculate the extent of each dimension of the datase
    var mathScore_extent =[ 280,700]
    var timeStudied_extent =[0, 18]

    // Set a map function to convert datum to pixels
    var scatter_xScale = d3.scale.linear()
        .range([0, scatter_width])
        .domain(timeStudied_extent).nice();                    
        
    var scatter_yScale = d3.scale.linear()
        .range([scatter_height, 0])
        .domain(mathScore_extent).nice(); 

    //construct the SVG container for the chart
    var scatter_svg = d3.select("#Scatter").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 "+ i_scatterWidth + " "+ i_scatterHeight)
        .append("g")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("transform", "translate(" + scatter_margin.left + "," + 
            scatter_margin.top + ")");

    //insert the x axis
    var xAxis = d3.svg.axis()
        .scale(scatter_xScale)
        .ticks(5)
        .orient("bottom");

    scatter_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + scatter_height + ")")
        .call(xAxis);

    //insert the y axis
    var yAxis = d3.svg.axis()
        .scale(scatter_yScale)
        .ticks(4)
        .orient("left");

    scatter_svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    //insert the labels
    scatter_svg.append("text")
        .attr("class", "my-canvas-legend my-canvas-legend-bottom")
        .attr("text-anchor", "middle")
        .attr("x", scatter_width / 9)
        .attr("y", scatter_height + scatter_margin.bottom/2.5)
        .text("Hours per Week");    

    // add the tooltip area to the webpage
    var tooltip = d3.select("#Scatter").append("div")
        .attr("class", "my-popup")
            .style("visibility", "hidden")

    tooltip.append("div").attr("class", "my-popup-label")
        // .append("div").attr("class", "my-popup-title")
        // .append("div").attr("class", "my-popup-line")
        //     .append("span").attr("class", "my-popup-label")

        ;

    //create the the scatter plot

    var my_scatter = scatter_svg.selectAll(".dot")
      .data(data2)
      .enter().append("circle")
      .attr("class", function(d) {return "dot " + d.colorClass})
      .attr("r", 3.5)
      .attr("cx", function(d) { return scatter_xScale(d.ST57Q01); })
      .attr("cy", function(d) { return scatter_yScale(d.PV1MATH); })
      .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("visibility", "visible");

            tooltip.style("left", (d3.mouse(d3.event.target)[0]) + "px")         
                .style("top", (d3.mouse(d3.event.target)[1]) + "px");

            debugger;
            tooltip.select("#my-popup-label").text(1998)
                // .attr("my-popup-title", "WEBVAN" )

        

      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("visibility", "hidden");
      });



    //define the function to update the chart
    function updateScatterplot(s_filter){
        //  *
        //  * Update the scatter plot based on the filter passed
        //  * @param: s_filter -  string with the index to be filtered

        //get data
        var data2 = filter_to_scatter(org_data2, s_filter);

        //join new data
        var scatter = scatter_svg.selectAll(".dot")
          .data(data2);

        //insert new elements
        scatter.enter().append("circle")
          .attr("class", function(d) {return "dot " + d.colorClass})
          .attr("r", 3.5)
          .attr("cx", function(d) { return scatter_xScale(d.ST57Q01); })
          .attr("cy", function(d) { return scatter_yScale(d.PV1MATH); })

        //update old elements
        scatter.transition()
          .duration(1000)
          .attr("r", 3.5)
          .attr("cx", function(d) { return scatter_xScale(d.ST57Q01); })
          .attr("cy", function(d) { return scatter_yScale(d.PV1MATH); });
        
        //remove old elements
        scatter.exit().transition()
          .duration(1000)
          .style("opacity", 1e-6)
          .attr("r", 3.5)
          .attr("cx", function(d) { return scatter_xScale(d.ST57Q01); })
          .attr("cy", function(d) { return scatter_yScale(d.PV1MATH); })
          .remove();

    }



    //=========end SCATTER=========    



    //=========begin NAVIGATOR=========

    function forward() {
        /*
        advance in the storyline
        */ 
        var i_dataIdx = +d3.select(".ink-selected").attr("data-index")
        if (i_dataIdx+1>4){
          var i_now = 4
        }else{
          var i_now = i_dataIdx+1
        };
        repaint(i_now);

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
        };
        repaint(i_now);

    }; 

    function repaint(i_idx) {
        /*
        repaint index and buttons
        */ 

        //what is selected now
        var i_dataIdx = +d3.select(".ink-selected").attr("data-index"); 
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
        //repaint buttons and draw/update charts
        if (i_idx==0){
          //format buttons
          d3.select(".ink-previous").classed("ink-disabled", true)
          d3.select(".ink-next").classed("ink-disabled", false)
          //show chart
          displayUdacity("show");
          
        }else if (i_idx==4){
          d3.select(".ink-previous").classed("ink-disabled", false)
          d3.select(".ink-next").classed("ink-disabled", true)
          //hide udacity chart
          displayUdacity("hide");
          //filter all
          var s_filter = "(-5.95, -4.573](0.936, 2.313]"; 
          // updateBoxplot(s_filter)
          updateViewport(s_filter)
          //update scatter
          updateScatterplot(s_filter)
          //update the explanation
          var txt = "bla4 " +
            "bla4 " +
            "bla4.";
          d3.select("#otherTxt").text(txt); 

        }else if (i_idx==3){
          d3.select(".ink-previous").classed("ink-disabled", false)
          d3.select(".ink-next").classed("ink-disabled", false)   
          //hide udacity chart
          displayUdacity("hide");
          //filter less rich
          var s_filter = "(-4.573, -3.196](-3.196, -1.819]"; 
          // updateBoxplot(s_filter)
          updateViewport(s_filter)
          //update scatter
          updateScatterplot(s_filter)          
          //update the explanation
          var txt = "bla3 " +
            "bla3 " +
            "bla3.";
          d3.select("#otherTxt").text(txt);                    

        }else if (i_idx==2){
          d3.select(".ink-previous").classed("ink-disabled", false)
          d3.select(".ink-next").classed("ink-disabled", false)   
          //hide udacity chart
          displayUdacity("hide");
          //filter richer
          var s_filter = "(0.936, 2.313](0.936, 2.313]"; 
          // updateBoxplot(s_filter)
          updateViewport(s_filter)
          //update scatter
          updateScatterplot(s_filter)          
          //update the explanation
          var txt = "bla2 " +
            "bla2 " +
            "bla2.";
          d3.select("#otherTxt").text(txt);                   

        }else if (i_idx==1){
          d3.select(".ink-previous").classed("ink-disabled", false)
          d3.select(".ink-next").classed("ink-disabled", false)   
          //hide udacity chart
          displayUdacity("hide");
          //filter all
          var s_filter = "(-5.95, -4.573](0.936, 2.313]"; 
          // updateBoxplot(s_filter)
          updateViewport(s_filter)
          //update scatter
          updateScatterplot(s_filter)          
          //update the explanation
          var txt = "bla1 " +
            "bla1 " +
            "bla1.";
          d3.select("#otherTxt").text(txt);           

        }
        //draw or update charts

 
    }; 


    d3.select(".ink-previous").on("click", backward);
    d3.select(".ink-next").on("click", forward);

    var list_ink = d3.selectAll(".ink-step")

    list_ink.on("click", function(d) {
      var i_now = +this.attributes['data-index'].value
      repaint(i_now);
    });


    //=========end NAVIGATOR=========

}




//draw the bar chart
function draw_ocde() {
     /**
     * load boxplot_data.csv and countries_agregated.csv. Call ...
     */    

    //create function to parse date
    // var formatTime = d3.time.format("%Y-%m-%d");

    //Fetcching data
    var fr_boxplot = "data/boxplot_data.csv"
    var fr_scatter = "data/countries_agregated.csv"

    //create the variable to hold the data
    var rows1, rows2;

    //load the boxplot dataset
    d3.csv(fr_boxplot, function (error, data) {
        //redefine the format of the data
        data.forEach(function(d){
            d.count= +d.count;
            d.lower_outliers= +d.lower_outliers;
            d.lower_quartile= +d.lower_quartile;
            d.lower_whisker= +d.lower_whisker;
            d.median= +d.median;
            d.upper_outliers= +d.upper_outliers;
            d.upper_quartile= +d.upper_quartile;
            d.upper_whisker = +d.upper_whisker;

            return d;
            })
        //save the data
        rows1 = data;
    });    
    //load the boxplot dataset
    d3.csv(fr_scatter, function (error, data) {
        //redefine the format of the data
        data.forEach(function(d){
            d.PV1MATH = +d.PV1MATH;
            d.ST57Q01 = +d.ST57Q01;
            d.colorClass = d.continent.replace(/\s/g,'');
            return d;
            })       
        //save the data             
        rows2 = data;
        //plot the datavis
        instantiateAllplots(rows1, rows2)
    });



};
