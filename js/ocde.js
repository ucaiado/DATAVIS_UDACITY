
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

function foo(){
    /**
     * docs
     * @param {Type} varname Description
     */

     //code commments
    debugger;
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

//************************************************************
// end of help functions
//************************************************************




function renderBarChart(data){
     /**
     * plot a histogram of unique social-index buckets in the SocialBars id
     */ 

     //group data
     var data = group_data(data);

    // whitespace on either side of the bars in units of MPG
    var  margin = {top: 50, right: 10, bottom: 80, left: 10};
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    var i_Width =  width + margin.left + margin.right;
    var i_Height = height + margin.top + margin.bottom;        
    //calculate the extent of each dimension of the datase
    var values_extent =[0, d3.max(data, function(d) { return d.values; })]

    // Set a map function to convert datum to pixels.
    var ordinalXScale = d3.scale.ordinal()
        .domain( data.map(function(d) { return d.key; }))
        .rangeBands([0, width], 0.03);            
        
    var yScale = d3.scale.linear()
        .range([height, 0])
        .domain(values_extent).nice(); 

    var barWidth = width / data.length;

    //construct the SVG container for the chart
    var svg = d3.select("#SocialBars").append("svg")
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
        .attr("width", ordinalXScale.rangeBand())
        .attr("height", function (d) {
            return height - yScale(d.values);
        })
        .attr("y", function (d){
            return yScale(d.values);
        });

    //append text
    columnGroup.append("text")
        .attr("class", "sociallabel")
            .attr("x", ordinalXScale.rangeBand() / 2)
            .attr("text-anchor", "middle")
            .attr("y", function(d) { 
                return yScale(d.values) -15;
            })
            .attr("dy", ".55em")
            .text(function(d) { return d.values })

    svg.append("text")
        .attr("class", "my-canvas-legend my-canvas-legend-bottom")
        .attr("text-anchor", "middle")
        .attr("x", width / 6)
        .attr("y", height + margin.bottom/2)
        .text("Social Status Buckets");             


    //format axis
    var xAxis = d3.svg.axis()
        .scale(ordinalXScale)
        .ticks(6)
        .orient("bottom");

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
            }),
        //group data
        renderBarChart(data)
        }
    );
};
