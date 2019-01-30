//sends input when user presses enter
var userinput = document.getElementById("userinput");
userinput.addEventListener("keydown", checkKey);
function checkKey(key){
	if(key.keyCode == 13){
		sendInput();
	}
}

//Sends input to active tab
function sendInput(){
	var delay;
	if(document.getElementById("delay").value =="") delay = 2;
    var msg = {
    	id: "userinput",
		userinput: userinput.value,
		delay: delay
	}
	//get current tab
    var params = {
	    active: true,
	    currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);
    function gotTabs(tabs) {
    	chrome.tabs.sendMessage(tabs[0].id, msg);
	}
}

//Update the list when it receives message from background.js
chrome.runtime.onMessage.addListener(receiver);
function receiver(request, sender, sendResponse) {
	if(request.id == "update"){
		displayList();
	}
}

//Displays the hrefList in the popup
displayList();
function displayList(){
	var bgpage = chrome.extension.getBackgroundPage();
	document.getElementById("hrefList").innerHTML = bgpage.hrefList;
}

//Stops execution when btn is pressed
document.getElementById("stopBtn").addEventListener("click", function(){
	chrome.runtime.sendMessage({id: "stopExecution"});
});