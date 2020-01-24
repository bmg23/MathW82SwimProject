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


/******************************Script for graphing*************************************/

//Global graphing variables 

let LCM_World_Records = []; 

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



//Used by graph function 
function filterArray(array, objectFilter, filterValue) {
  let newArray = [];
  for (i = 0; i < array.length; ++i) {
    if(array[i][objectFilter] == filterValue) {
      newArray.push(array[i]); 
    }
  }
  return newArray; 

}

/*graph 
 * 
 * Uses d3 to add a 
 * graph to the svg 
 * in html.  
 */
function drawGraph(dataArray) {

  let dates = dataArray.map(d => d.Date);
  let times = dataArray.map(d => d.TotalTime);

  let dateXScale = 
    d3.scaleLinear()
      .domain(d3.extent(dates))
      .range([0, 1000])

  let timeYScale = 
    d3.scaleLinear()
      .domain(d3.extent(times))
      .range([0, 600])

  d3.select('svg#graph')
    .selectAll('circle')
    .data(swim50FreeMens)
    .enter()
    .append('circle')
    .attr('cx', d => dateXScale(d.Date) + 50)
    .attr('cy', d => timeYScale( + d.TotalTime) + 50)
    .attr('r', 7)
    .attr('fill', 'red')
    .style('stroke-width', 5)
    .style('opacity', 0.6)
    .on('mouseover', showInfo)
    .on('mouseout', hideInfo)

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
        <span class = "swimmer"> ${d.Rank} </span><br>`)}

    function hideInfo (d, i) {
        d3.select(this)
        .style('fill', 'red')
        d3.select('div.info')
          .text("")
      }


    /*
    function xAxisScale() {        
        return d3.select('svg#graph')
             .axis()
             .scale(x)
             .orient("bottom")
             .ticks(5)
    }
    
    function yAxisScale() {        
        return d3.select('svg#graph')
            .axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }

    d3.select('svg#graph')
      .append("g")         
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(yAxisScale()
            .tickSize(-height, 0, 0)
            .tickFormat("")
    )

    d3.select('svg#graph')
      .append("g")         
      .attr("class", "grid")
      .call(xAxisScale()
            .tickSize(-width, 0, 0)
            .tickFormat("")
    )


*/



}

//Global user input variables 
var selectedGender = 'Both'; 
let genderInput = document.getElementsByName('gender'); 
var eventInput = ['50 Free']; 
var dateInput = 'All Years';
var distanceInput = 'SYC'; 

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
  console.log(genderInput); 
  for(var i = 0; i < genderInput.length; i++) {
    if(genderInput[i].checked)
        selectedGender = genderInput[i].value;
  }
  
  
  eventInput = document.getElementById("events").value; 
  dateInput = document.getElementById("date").value;
  distanceInput = document.getElementById("distance").value;  
}


function graph() {
  getUserInput(); 
  console.log('Graphing...'); 
  console.log(distanceInput); 



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
  drawGraph(); 
}

//Fill LCM_World_Records
d3.csv("AllWorldRecords.csv").then( main ); 






console.log(LCM_World_Records); 
