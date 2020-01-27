/* Swimming Historical Time Progression
 * 
 * Authors: Brian Goins, Emily Gunderson
 * Date: January 2020
 * 
 * Goal: Using the JS libary d3 we hope to create 
 * an interactive graph of historical swimming records. 
 */

/******************************Script for editing page*******************************/

//Event List
events = ["50 FR", "100 FR", "200 FR", "400 FR", 
          "800 FR", "1500 FR", "50 BK", "100 BK", 
          "200 BK", "50 BR", "100 BR", "200 BR", 
          "50 FL", "100 FL", "200 FL", "200 IM", 
          "400 IM", "400 FR-R", "Mixed 400 FR-R", 
          "800 FR-R", "400 MED-R", "Mixed 400 MED-R"]; 



var eventSelect = document.getElementById('events');

for (const event in events) {
  var newEventOption = document.createElement("option");
  newEventOption.text = `${events[event]}`;
  newEventOption.value = `${events[event]}`;
  eventSelect.add(newEventOption); 
}

//Dates
//Probably going to change to 1,5,10,all 
dates = [];

var oldestRecord = 1956; 
var currentYear = new Date().getFullYear(); 

for (i = oldestRecord; i <= currentYear; ++i) {
  dates.unshift(i); 
}

dates.unshift("All Years"); 

var dateSelect = document.getElementById('date');

for (const date in dates) {
  var newDateOption = document.createElement("option");
  newDateOption.text = `${dates[date]}`;
  newDateOption.value = `${dates[date]}`;
  dateSelect.add(newDateOption); 
}





/******************************Data needed for creating records*******************************/

let eventCSV = ["Men's 50 FR LCM", "Women's 50 FR LCM", "Men's 100 FR LCM", 
            "Women's 100 FR LCM", "Men's 200 FR LCM", "Women's 200 FR LCM", 
            "Men's 400 FR LCM", "Women's 400 FR LCM", "Men's 800 FR LCM", 
            "Women's 800 FR LCM", "Men's 1500 FR LCM", "Women's 1500 FR LCM", 
            "Men's 50 BK LCM", "Women's 50 BK LCM", "Men's 100 BK LCM", 
            "Women's 100 BK LCM","Men's 200 BK LCM","Women's 200 BK LCM",
            "Men's 50 BR LCM", "Women's 50 BR LCM", "Men's 100 BR LCM", 
            "Women's 100 BR LCM", "Men's 200 BR LCM", "Women's 200 BR LCM",
            "Men's 50 FL LCM", "Women's 50 FL LCM", "Men's 100 FL LCM", 
            "Women's 100 FL LCM", "Men's 200 FL LCM", "Women's 200 FL LCM", 
            "Men's 200 IM LCM", "Women's 200 IM LCM", "Men's 400 IM LCM", 
            "Women's 400 IM LCM", "Men's 400 FR-R LCM", "Women's 400 FR-R LCM", 
            "Mixed 400 FR-R LCM", "Men's 800 FR-R LCM", "Women's 800 FR-R LCM", 
            "Men's 400 MED-R LCM", "Women's 400 MED-R LCM", "Mixed 400 MED-R LCM"]  

let countries = {"USA":"United States of America", "BRA":"Brazil", "FRA":"France",
  "AUS":"Australia", "RUS":"Russia", "RSA":"South Africa", "SUI":"Switzerland",
  "GER":"Germany", "SWE":"Sweden", "NED":"Netherlands", "CHN":"China",
  "BUL":"Romania", "GDR":"Germany", "ITA":"Italy", "FRG":"Germany",
  "POL":"Poland", "URS":"Russia", "CAN":"Canada", "GBR":"United Kingdom",
  "MEX":"Mexico", "JPN":"Japan", "ESP":"Spain", "ZIM":"Zimbabwe",
  "HUN":"Hungary", "UKR":"Ukraine", "LTU":"Lithuania", "BEL":"Belgium",
  "DEN":"Denmark", "SRB":"Serbia", "ARG":"Argentina", "FIN":"Finland", "CRO":"Croatia",
  "CRC":"Costa Rica", "NZL":"New Zealand", "AUT":"Austria", "JAM":"Jamaica",
  "CZE":"The Czech Republic", "SLO":"Slovenia", "SVK":"Slovakia", "TRI":"Trinidad and Tobago"}


/******************************Script for reading data*************************************/

//Global data variables 
let LCM_World_Records = []; 
let SCY_Records = []; 
let SCM_World_Records = []; 


/*isRecord 
 * Input: Record Object
 *
 * Only checks time to see if it is a 
 * real swim time. 
 * COULD ADD MORE ERROR CHECKING
 *  
 * Output: Boolean
 *
 */
function isRecord(record) {
  let timeRegexLong = new RegExp('^[0-9]+:+[0-9]+.+[0-9]');
  let timeRegexShort = new RegExp('^[0-9]+.+[0-9]');

  if(!timeRegexShort.exec(record['Time']) && !timeRegexLong.exec(record['Time'])) {
    return false;
  } 
  if(record['Date'] == "") {
    return false; 
  }
  else {
    return true; 
  }
}

//Checks array for data 
function includes(data, array) {
  for (i of array) {
    if(i == data) {
      return true; 
    }
  }

  return false; 
}

//Convert 3 letter country name to full name
function converCountry(countryName) {
  if(countries[countryName] != "") {
    return countries[countryName]; 
  } else {
    return countryName; 
  }
}

/*timeToMS 
 * Input: time string (00:00.00 or 00.00)
 * 
 * Splits string and then converts minutes
 * and seconds to milliseconds. 
 * 
 * Returns: Total time in milliseconds as 
 * an integer. 
 *
 */
function timeToMS(timeStr) {
  var time = 0; 
  //Regex matching for long vs short times
  let timeRegexLong = new RegExp('^[0-9]+:+[0-9]+.+[0-9]+');
  let timeRegexShort = new RegExp('^[0-9]+.+[0-9]+');
  //Convert long times (00:00.00)
  if(timeRegexLong.exec(timeStr)) {
    var timeArray = timeStr.split(":"); 
    timeArray.push(timeArray[1].split(".")[0]); 
    timeArray.push(timeArray[1].split(".")[1]);
    
    
    var minutes = Number(timeArray[0]) * 60000; 
    var seconds = Number(timeArray[2]) * 1000;
    var milliseconds = timeArray[3] + "000";
    milliseconds = milliseconds.substring(0, 3);
    milliseconds = Number(milliseconds); 
    
    time = minutes + seconds + milliseconds; 

  }
  //Convert short times (00.00) 
  else if (timeRegexShort.exec(timeStr)) {
    var timeArray = timeStr.split(".");
    
    var seconds = Number(timeArray[0]) * 1000;
    var milliseconds = timeArray[1] + "000";
    milliseconds = milliseconds.substring(0, 3);
    milliseconds = Number(milliseconds);  
    time = seconds + milliseconds; 
    

  } else {
   console.log("Error in time!"); 
  }
  
  return time; 
}


/*cleanUp
 * Input: Record Object
 * 
 * Takes a record object and converts:
 *  Country Ab. => Full Country Name
 *  Date String => JS DateTime
 *  Rank String => Rank Int
 *  Time String => Total Time Milliseconds Int
 * 
 * Output: 'Clean' Record
 */
function cleanUp(record) {
  
  record['Country'] = converCountry(record['Country']); 
  record['Date'] = new Date(record['Date']);
  record['Rank'] = Number(record['Rank']); 
  record['TotalTime'] = timeToMS(record['Time']); 
  
  return record;
}

/*fillArray*/ 
function fillArray(record, array) {
  cleanUp(record); 
  array.push(record); 
}

/*readData
 * Input: CSV Data for USA Swimming
 * 
 * Reads in event name and then adds to 
 * each object. Calls cleanUp to convert
 * text data to proper format. 
 * 
 * Adds record to array
 */
function readData(data, array) {
  
  var event = eventCSV[0]; 
 
  for (line in data) {
    //Add event name to object 
    //Get Event
    const values = Object.values(data[line]); 
    var value1 = values[0]; 
    
    //Check and Set Event
    if(includes(value1, eventCSV)) {
      event = value1; 
    }
    //Add Event
    data[line].Event = event;

    if(isRecord(data[line])) {
      fillArray(data[line], array); 
    } 
  }
}



/*Main Function
 * 
 * Reads CSV Data into arrays
 * Call Graph and darws an initial graph
 * 
 * 
 * 
 * 
 * 
 */
function main(data) {
  readData(data, LCM_World_Records);  
}

//Fill LCM_World_Records
d3.csv("AllWorldRecords.csv").then( main ); 




/******************************Script for graphing*******************************/
 





//Global user input variables 
var selectedGender = 'Both'; 
let genderInput = document.getElementsByName('gender'); 
var eventInput = ['50 Free']; 
var dateInput = 'All Years';
var distanceInput = 'LCM'; 

/*getUserInput()
 *
 * Input: User input from index.html
 *
 * Sets global user input variables 
 * 
 */
function getUserInput() {
  //Get gender
  genderInput = document.getElementsByName('gender'); 
  for(var i = 0; i < genderInput.length; i++) {
    if(genderInput[i].checked)
        selectedGender = genderInput[i].value;
  }
  
  
  eventInput = document.getElementById("events").value; 
  dateInput = document.getElementById("date").value;
  distanceInput = document.getElementById("distance").value;  
}

//Shows description of dots
function showInfo (d, i) {
  d3.select(this)
  .style('fill', 'black')
  d3.select('div.info')
    .html(`<span class = "category"> Swimmer: </span>
    <span class = "swimmer"> ${d.Athlete} </span><br>
    <span class = "category"> Event: </span>
    <span class = "swimmer"> ${d.Event} </span><br>
    <span class = "category"> Swim Time: </span>
    <span class = "swimmer"> ${d.Time} </span><br>
    <span class = "category"> Country: </span>
    <span class = "swimmer"> ${d.Country} </span><br>
    <span class = "category"> When was it broken?  </span>
    <span class = "swimmer"> ${d.Date} </span><br>
    <span class = "category"> Rank: </span>
    <span class = "swimmer"> ${d.Rank} </span><br>`)
}

function hideInfo (d, i) {
    d3.select(this)
    .style('fill', 'red')
    d3.select('div.info')
      .text("")
}


function plotPoints(dataArray, dateXScale, timeYScale, graphInner, dot) {
  graphInner
    .selectAll('circle')
    .data(dataArray)
    .enter()
    .append('circle')
    .attr('cx', d => dateXScale(d.Date))
    .attr('cy', d => timeYScale( + d.TotalTime))
    .attr('r', dot.radius)
    .attr('fill', dot.fill)
    .style('stroke-width', dot.stroke_width)
    .style('opacity', dot.opacity)
    .on('mouseover', showInfo)
    .on('mouseout', hideInfo);

}

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

function timeToString(time) {
  var minutes = 0; 
  var seconds = 0; 
  var milliseconds = 0; 
  
  //Get minutes if any
  if (time / 60000 > 1) {
    minutes = Math.floor(time / 60000);   
  } 

  //Subtract minutes, if minutes is 0 this does nothing
  time = time - (60000*minutes); 
  //Get seconds
  seconds = Math.floor(time / 1000); 
  //Subtract seconds from total time
  time = time - (1000*seconds); 
  //All time left over is milliseconds
  milliseconds = time;


  if(minutes > 0) { 
    return `${minutes}:${seconds}.${milliseconds}`;
  } else {
    return `${seconds}.${milliseconds}`;
  }

}

function dateToString(tick) {
  var d = new Date(tick);  
  return d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear(); 
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

  function resetted() {
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
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



//Used by graph function 
function filterArray(array) {
  
  //Set up event for filter
  var event = "";  
  if (selectedGender == 'male') {
    event = "Men's " + eventInput + " " + distanceInput;  
  } 
  else if(selectedGender == 'female') {
    event = "Women's " + eventInput + " " + distanceInput;  
  } else {
    event = eventInput + " " + distanceInput;
  }

  console.log("Filter Event: " + selectedGender); 
  
  let newArray = [];
  for (i = 0; i < array.length; ++i) {
      if(dateInput != "All Years" && array[i]['Date'].getFullYear() <= dateInput) {
        continue; 
      }
      if(selectedGender != 'both' && array[i]['Event'] != event) {
        continue; 
      } 
      if(!array[i]['Event'].includes(event)) {
        continue; 
      }
      else {
        newArray.push(array[i]); 
      }
  }
  return newArray;
}
function drawGraph2(dataArray) {
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
   width = 460 - margin.left - margin.right,
   height = 400 - margin.top - margin.bottom;

  // append the SVG object to the body of the page
  var SVG = d3.select("#graph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([4, 8])
    .range([ 0, width ]);
  var xAxis = SVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 9])
    .range([ height, 0]);
  var yAxis = SVG.append("g")
    .call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = SVG.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", width )
    .attr("height", height )
    .attr("x", 0)
    .attr("y", 0);

  var plot = SVG.append("g")
                .attr("clip-path", "url(#clip)")

  let dot = {
    fill: 'red', 
    radius: 3,
    stroke_width: 1, 
    opacity: 0.6
  }
  
  
  plot
    .selectAll('circle')
    .data(dataArray)
    .enter()
    .append('circle')
    .attr('cx', d => dateXScale(d.Date))
    .attr('cy', d => timeYScale( + d.TotalTime))
    .attr('r', dot.radius)
    .attr('fill', dot.fill)
    .style('stroke-width', dot.stroke_width)
    .style('opacity', dot.opacity)
    .on('mouseover', showInfo)
    .on('mouseout', hideInfo);


  // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
  var zoom = d3.zoom()
      .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]])
      .on("zoom", updateChart);




}

/*graph()
 * Connected to graph button. 
 * 
 */
function graph() {
  //delete old graph
  d3.select('svg#graph')
    .selectAll('circle')
    .remove();
  d3.select('svg#graph')
  .selectAll('g')
  .remove();
  d3.select('svg#graph')
  .selectAll('text')
  .remove();

  getUserInput();  
  let data = [];


  if(distanceInput == "SCY") {
    data = filterArray(SCY_Records); 
  } 
  else if(distanceInput == "SCM") {
    data = filterArray(SCM_World_Records, event); 
  } 
  else if(distanceInput == "LCM") {
    console.log("Filtering Array"); 

    data = filterArray(LCM_World_Records, event); 
  } 
  console.log(data); 
  drawGraph2(data); 
}





 
