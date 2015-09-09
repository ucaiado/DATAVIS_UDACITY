"use strict";
/**
 * ============================================================
 * Load and plot data from data/udacity_time.csv. Also create 
 * a function to nagivate through storyline
 *
 * Created on 08/26/2015 
 *
 * @author: 'ucaiado'
 * ============================================================
 */



//************************************************************
// begin of help functions
//************************************************************

function displayUdacity(s_type){
     /**
     * hide (show another chart) and show udacity bar chart
     */
    if(s_type=="show"){
        d3.select("#FirstChart").attr("style","display:inline;");
        d3.select("#SecondChart").attr("style","display:none;");
    } 
    else{
        d3.select("#FirstChart").attr("style","display:none;");
        d3.select("#SecondChart").attr("style","display:inline;");
    }
    
}



//************************************************************
// end of help functions
//************************************************************


//create the chart object
function renderChart(data){
     /**
     * reshape data as a bar chart and insert it in #UdacityBars
     * @param: data -  array of objects with udacity_time content
     */

    // debugger;
    //change txt in the description
    d3.select("#firstTitle").text("Hours Studied per Week at Udacity");
    var txt = "I have tried to study about 10 hours per week, as Udacity" +
        " suggested. I ended up studying 10:30 on average, almost every day," + 
        " 40 weeks so far. This approach was productive and makes me question" + 
        " how long people usually study outside the school.";
    d3.select("#firstTxt").text(txt);
    // whitespace on either side of the bars in units of MPG
    var margin = {top: 50, right: 30, bottom: 80, left: 30};
    var width = 1000 - margin.left - margin.right;
    var height = 450 - margin.top - margin.bottom;
    var i_Width =  width + margin.left + margin.right;
    var i_Height = height + margin.top + margin.bottom;        
    //calculate the extent of each dimension of the datase
    var values_extent = d3.extent(data, function(d) { 
        return d.MINT;
    });
    var time_extent = d3.extent(data, function(d) {
        return d.DATE;
    });

    // Set a map function to convert datum to pixels.
    var xScaleDate = d3.time.scale()
        .range([0, width])
        .domain(time_extent); 

    var ordinalXScale = d3.scale.ordinal()
        .domain(d3.map(time_extent, function(d) { return d.DATE; }))
        .rangeBands([0, width], 0.1,0.2);            
        
    var yScale = d3.scale.linear()
        .range([height, 0])
        .domain(values_extent).nice(); 

    var barWidth = width / data.length;

    //construct the SVG container for the chart
    var svg = d3.select("#UdacityBars").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 "+ i_Width + " "+ i_Height)
        .append("g")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("transform", "translate(" + margin.left + "," + 
            margin.top + ")");

    // Column chart
    var columnGroup = svg.selectAll(".g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d,i){return "translate(" + i * barWidth + ",0)";});

    // Now you can use both of them to space columns evenly:
    columnGroup.append("rect")
        .attr("class", "column")
        .attr("width", barWidth - 1)
        .attr("height", function (d) {
            return height - yScale(d.MINT);
        })
        .attr("x", function (d) {
            return ordinalXScale(d.DATE);
        })
        .attr("y", function (d){
            return yScale(d.MINT);
        });

    //append text
      columnGroup.append("text")
        .attr("class", "barlabel")
          .attr("x", barWidth / 2)
          .attr("text-anchor", "middle")
          .attr("y", function(d) { 
            return yScale(d.MINT) -15;
            })
          .attr("dy", ".55em")
          .text(function(d) { return Math.round(d.MINT); })


    //format axis
    var xAxis = d3.svg.axis()
        .scale(xScaleDate)
        .ticks(15)
        .orient("bottom")
        .tickFormat(d3.time.format('%b-%Y'));;

    // insert Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // var yAxis = d3.svg.axis()
    //     .scale(yScale)
    //     .ticks(3)
    //     .orient("left");
        
    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis);  


    };


//draw the bar chart
function draw_udacity() {
     /**
     * load data/udacity_time.csv and call renderChart function
     */    

    //create function to parse date
    var formatTime = d3.time.format("%Y-%m-%d");

    //Fetcching data
    var fr_data = "data/udacity_time.csv"
    d3.csv(fr_data, function (error, data) {
        //redefine the format of the data
        data.forEach(function(d){
            d.DATE= formatTime.parse(d.DATE);
            d.MINT= +d.MINT;

            return d;
            }),
        //render the data
        renderChart(data)
        }
    );  

}