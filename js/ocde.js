
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


function instantiateAllplots(data){
    /**
     * Insert all plots at once
     */ 

     //render the bar chart
     renderBarChart(data);
     renderBoxplot(data);  

}


function renderBoxplot(data){
    /**
     * plot a boxplot of the math scores splited by the time spend studying 
     * buckets
     */

     //filter data
    var org_data = data;
    data = boxplot_filter(org_data, "(-5.95, -4.573](0.936, 2.313]")
    console.log("prinmeiros dados")
    console.table(data)

    //change txt in the description
    d3.select("#otherTitle").text("Math-score by time studied");
    var txt = "Describe number of " +
        "weeks and median " +
        "of week.";
    d3.select("#otherTxt").text(txt);        

    // initiate conf variables
    var  margin = {top: 100, right: 40, bottom: 90, left: 15};
    var width = 550 - margin.left - margin.right;
    var height = 450 - margin.top - margin.bottom;
    var i_Width =  width + margin.left + margin.right;
    var i_Height = height + margin.top + margin.bottom; 
    

    //calculate the extent of each dimension of the datase
    // var values_extent =[d3.min(data, function(d) { return 0; }), 
    //     d3.max(data, function(d) { return d.upper_whisker*1.05; })]



    var values_extent =[0, 810]        


    //define the function to plot
    var chart = d3.box()
        .width(width)
        .height(height)
        .domain(values_extent); 

    // define scale function

    // Set a map function to convert datum to pixels.
    var xScale = d3.scale.ordinal()
        .domain( data.map(function(d) { return d["ST57Q01_bk"]; }))
        .rangeBands([0, width], 0.7, 0.1);            
        
    // var yScale = d3.scale.linear()
    //     .range([height, 0])
    //     .domain(values_extent).nice(); 
 


    //construct the SVG container for the chart
    var svg = d3.select("#BoxPlot").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 "+ i_Width + " "+ i_Height)
        .append("g")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("transform", "translate(" + margin.left + "," + 
            margin.top + ")");

    
    // draw the boxplots    
    var my_box = svg.selectAll(".box")      
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
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);



    // var yAxis = d3.svg.axis()
    // .ticks(6)
    // .scale(yScale)
    // .orient("left");


    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis);           

// debugger;

  setInterval(function() {
    console.log("");
    console.log("entrei aqui");
    var data2 = boxplot_filter(org_data, "(-4.573, -3.196](0.936, 2.313]")

    my_box.data(data2)
      .call(chart.duration(1000)); 


    // svg.data(data2).call(chart.duration(1000))
  }, 5000);



}


function updateBoxplot(data, s_filter){
    /**
     * Update the boxplot based on the filter passed
     * @param: s_filter -  string with the index to be filtered
     */

    //get data
    debugger;
    data = boxplot_filter(data, s_filter)
    svg.datum(data).call(chart.duration(1000))
 

}



function renderBarChart(data){
     /**
     * plot a histogram of unique social-index buckets in the SocialBars id
     */ 

     //group data
     var org_data = data;
     var data = group_data(data);

    // whitespace on either side of the bars in units of MPG
    var  margin = {top: 70, right: 10, bottom: 75, left: 10};
    var width = 500 - margin.left - margin.right;
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
        .classed('navigator', true)
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

    //create the brush component
    var leftEdges = ordinalXScale.range();
    var width = ordinalXScale.rangeBand();

    var viewport = d3.svg.brush()
        .x(ordinalXScale)
        .on("brush", function () {
            //get the slice of the x axis selected
            var aux =viewport.empty() ? [leftEdges[0]+1,leftEdges[5]+1] : viewport.extent()

            //look for what the minimum and maximum value selected are related for
            // console.log('')
            // console.log(aux)
            var l = ordinalInvert(aux[1], width, leftEdges, ordinalXScale);
            var f = ordinalInvert(aux[0], width, leftEdges, ordinalXScale)
            //update boxplot
            updateBoxplot(org_data, f + "" + l);

        });

    // add the viewport component to the navigation chart
    svg.append("g")
        .attr("class", "viewport")
        .call(viewport)
        .selectAll("rect")
        .attr("height", height);





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
        instantiateAllplots(data)
        }
    );
};
