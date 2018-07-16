var randomMobileApps = ["Game", "App", "Web Page"]
var randomAdjectives = ["silly", "outrageous", "mind numbing"]
var randomWords = ["8 Track Player", "typewriter", "slide rule"]

//Pick a random Mobile App from the randomMobileApps array:
var randomMobileApps = randomMobileApps [Math.floor(Math.random() * 3)];
//Pick a random Adjective from the randomAdjectives array:
var randomAdjectives = randomAdjectives [Math.floor(Math.random() * 3)];
//Pick a random Word from the randomWords array:
var randomWords = randomWords [Math.floor(Math.random() * 3)];
// Join all the random strings into a sentence:
var randomInsult = "Your " + randomMobileApps + " is like a " + randomAdjectives + " " + randomWords + "!!!";
randomInsult;

var element = document.getElementById("insults");
element.innerText = randomInsult;
