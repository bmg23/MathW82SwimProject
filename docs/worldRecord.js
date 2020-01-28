var worldRecord = {
    event: "Men's 50 FR LCM",
    rank: 1, 
    time: "20.91", 
    name: "Cesar Cielo",
    country: "BRA", 
    meetName: "2009 BRA Open", 
    date: "12/18/2009", 
    city: "Sao Paulo"
    };

function drawAxis(graphInner, graphOuter, xAxis, yAxis) {

    // create axes
    graphInner
        .append('g')
        .attr('transform', 'translate(' + 0 + ', ' + innerHeight + ')')
        .attr('class', 'x-axis')
        //.attr('transform', 'rotate(-90)')
        .call(xAxis)
    
    graphInner
        .append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
    
    //X Axis Text
    graphOuter
        .append('text')
        .attr('class', 'x-axis')
        .attr('x', margins.left + innerWidth / 2)
        .attr('y', outerHeight - margins.bottom / 4)
        .attr('text-anchor', 'middle')
        .text("Date")
    
    //Y Axis Text
    graphOuter
        .append('text')
        .attr('class', 'y axis')
        .attr('x', margins.left / 2)
        .attr('y', (margins.bottom + innerHeight) / 2 + 20)
        .attr('text-anchor', 'middle')
        .attr(
        'transform',
        `rotate(-90 ${margins.left / 2} ${margins.bottom + innerHeight / 2})`)
        .text("Time")
    }
/*drawGraph() 
 * 
 * Uses d3 to add a 
 * graph to the svg 
 * in html.  
 */
function drawGraph(dataArray) { 
  
 

    //Data for graph
    let dates = dataArray.map(d => d.Date);
    let times = dataArray.map(d => d.TotalTime);
  
    //Variables for dots
    let dateXScale = 
      d3.scaleLinear()
        .domain(d3.extent(dates))
        .range([0, innerWidth])
  
    let timeYScale = 
      d3.scaleLinear()
        .domain(d3.extent(times))
        .range([innerHeight - 5, 0])
  
    //Variables for axis 
    let graphOuter = d3
      .select('svg#graph')
      .attr('width', outerWidth)
      .attr('height', outerHeight)
      .style('background-color', 'skyblue')
  
    let graphInner = graphOuter
      .append('g')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('transform', 'translate(' + margins.left + ',' + margins.right + ')')
  
    let xAxis = d3.axisTop(dateXScale)
                  .tickSize(-innerHeight)
                  .tickFormat(dateToString); 
  
    let yAxis = d3.axisLeft(timeYScale)
                  .tickSize(-innerWidth)
                  .tickFormat(timeToString);
  
  
    
    //Zoom
    var svg = d3.select("svg#graph");
  
  
    var zoom = d3.zoom()
      .scaleExtent([1, 40])
      .translateExtent([[-100, -100], [innerWidth + 100, innerHeight + 100]])
      .on("zoom", zoomed);
  
    var view = graphInner; 
  
    var gX = svg.append("g")
        .attr("class", "axis")
        .call(xAxis);
  
    var gY = svg.append("g")
        .attr("class", "axis")
        .call(yAxis);
  
    var x = d3.scaleLinear()
      .domain([-50, innerWidth + 5])
      .range([-50, innerWidth + 5]);
    
    var y = d3.scaleLinear()
        .domain([-50, innerHeight + 1])
        .range([-50, innerHeight + 1]);
  
  
    function zoomed() {
      view.attr("transform", d3.event.transform);
      gY.call(xAxis.scale(d3.event.transform.rescaleX(x)));
      gX.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    }
  
  
    let dot = {
      fill: 'red', 
      radius: 3,
      stroke_width: 1, 
      opacity: 0.6
    }
    
    
    plotPoints(dataArray, dateXScale, timeYScale, graphInner, dot) 
    //drawAxis(graphInner, graphOuter, xAxis, yAxis); 
    svg.call(zoom);
  }
  