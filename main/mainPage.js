/* Fill in selection boxes with data 
 *
 *
 * 
 */

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

dates = ["all"];


/*
Event format
*/

eventCSV = ["Men's 50 FR LCM", "Women's 50 FR LCM", "Men's 100 FR LCM", 
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

/* Clean Up Data
*/

function includes(data, array) {
  for (i of array) {
    if(i == data) {
      return true; 
    }
  }

  return false; 
}


function cleanUpData(data) {
  
  var event = eventCSV[0]; 
 

  for (line in data) {

    //Get Event
    const values = Object.values(data[line]); 
    var value1 = values[0]; 
    
    //Check and Set Event
    if(includes(value1, eventCSV)) {
      event = value1; 
    }

    //Add Event
    data[line].Event = event; 
    

    console.log(data[line]); 

  }



}


d3.csv("AllWorldRecords.csv").then( cleanUpData ); 

