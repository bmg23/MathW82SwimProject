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

/* STACKOVERFLOW CODE 
var allText =[];
var allTextLines = [];
var Lines = [];

var txtFile = new XMLHttpRequest();
txtFile.open("GET", "../Data/AllWorldRecordsProgression.txt", true);
txtFile.onreadystatechange = function()
{
    allText = txtFile.responseText;
    allTextLines = allText.split(/\r\n|\n/);
};

require(['fs']);
fs = require('fs'); 
fs.readFile( "../Data/AllWorldRecordsProgression.txt", (err, data) => {
    if(err) throw err;
    console.log(data.toString()); 
})
*/ 
