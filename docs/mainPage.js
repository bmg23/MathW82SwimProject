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
events = ["400 Free-R Mixed", "400 Medley-R Mixed", "50 Free", "100 Free", "200 Free",
          "400 Free", "800 Free", "1500 Free","50 Back", "100 Back", "200 Back", "50 Breast",
          "100 Breast", "200 Breast", "50 Fly", "100 Fly", "200 Fly", "200 IM", "400 IM",
          "400 Free Relay",  "800 Free Relay", "400 Medley Relay"]; 



var eventSelect = document.getElementById('events');

for (const event in events) {
  var newEventOption = document.createElement("option");
  newEventOption.text = `${events[event]}`;
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

dates.unshift("All"); 

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

LCM_World_Records = []; 

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
  let timeRegexLong = new RegExp('^[0-9]+:+[0-9]+.+[0-9]');
  let timeRegexShort = new RegExp('^[0-9]+.+[0-9]');
  //Convert long times (00:00.00)
  if(timeRegexLong.exec(timeStr)) {
    var timeArray = timeStr.split(":"); 
    timeArray.push(timeArray[1].split(".")[0]); 
    timeArray.push(timeArray[1].split(".")[1]);
    
    
    var minutes = Number(timeArray[0]) * 60000; 
    var seconds = Number(timeArray[2]) * 1000;
    var milliseconds = Number(timeArray[3]); 
    
    time = minutes + seconds + milliseconds; 

  }
  //Convert short times (00.00) 
  else if (timeRegexShort.exec(timeStr)) {
    var timeArray = timeStr.split(".");
    
    var seconds = Number(timeArray[0]) * 1000;
    var milliseconds = Number(timeArray[1]); 
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
  record['Total Time'] = timeToMS(record['Time']); 
  
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
function graph() {
  console.log("Time to graph"); 

  let swimDates = LCM_World_Records.map(d => d.Date);
  let swimTimes = LCM_World_Records.map(d => d.TotalTime);


  let swim50FreeMens = filterArray(LCM_World_Records, "Event", "Men's 50 FR LCM"); 
  swimDates = swim50FreeMens.map(d => d.Date); 
  let swim50FreeMensTimes = swim50FreeMens.map(d => d.TotalTime); 

  /*GRAPH TIME*/ 
  let outerWidth = 1000
  let outerHeight = 600
  //let margins = { top: 30, bottom: 50, left: 50, right: 30 }
  //let innerWidth = outerWidth - margins.left - margins.right
  //let innerHeight = outerHeight - margins.top - margins.bottom

  d3.select('svg#graph')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .style('background-color', 'skyblue')



  let dateXScale = 
    d3.scaleLinear()
      .domain(d3.extent(swimDates))
      .range([0, 1000])

  let timeYScale = 
    d3.scaleLinear()
      .domain(d3.extent(swim50FreeMensTimes))
      .range([0, 600])


  d3.select('svg#graph')
    .selectAll('circle')
    .data(swim50FreeMens)
    .enter()
    .append('circle')
    .attr('cx', d => dateXScale(d.Date))
    .attr('cy', d => timeYScale(d.TotalTime))
    .attr('r', 2)
    .style('fill', 'red')
    .style('stroke-width', 5)
    .style('opacity', 0.6);


  //let gridlines = d3.

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
  graph(); 
}





//Fill LCM_World_Records
d3.csv("AllWorldRecords.csv").then( main ); 


console.log(LCM_World_Records); 