var userinput = "";
var hrefList = "";
var links = new Set();
var urls = [];
var length;
var createTabsID;
var stopExecution = false;
var delay = 2000;

//Receives userinput, document links and msg to stop execution.
chrome.runtime.onMessage.addListener(receiver);
function receiver(request, sender, sendResponse) {
	//set value for links
	if(request.id == "userinput/links"){
		userinput = request.userinput;
		urls = request.urls;
		length = urls.length-1;
		links = new Set();
		delay = request.delay*1000;
		display();
		createTabs();
	}
	if(request.id == "stopExecution"){
		stopExecution = true;
	}
}

//Display each url that countains the search term with a 3 second delay
function createTabs(){
	//Create tab for each link and run content script
	var settings = {state:"minimized",type:"popup"}
	chrome.windows.create(settings, function(window){
		var properties = {
			windowId: window.id, 
			url : urls[length], 
			active : false
		}
		chrome.tabs.create(properties, function(tab) {
			runScript(tab);
		});
	});	
}

//Runs newtab.js for every tab. Sends result to removetab()
function runScript(tab){
	chrome.tabs.executeScript(tab.id, {file: "newtab.js"}, processTab);
	function processTab(){
		var msg = {id: "processTab", txt: userinput}
		chrome.tabs.sendMessage(tab.id, msg, function(found){
			removeTab(found, tab);
		});
	}
}

//Removes tab. Displays tab if search term was found.
function removeTab(found, tab){
	chrome.tabs.remove(tab.id);
	if(found){
		links.add(urls[length]);
		display();
	} 
	if(--length){
		createTabsID = setTimeout(createTabs, delay);
		if(stopExecution) {
			clearTimeout(createTabsID);
			stopExecution = false;
		}
	}
}

//Display links in popup
function display(){
	hrefList = "";
  	links.forEach(printLinks);
  	function printLinks(value1, value2, set) {
  		var href= "<a href=\"" + value1 + "\" target=_blank>";
  		hrefList += "<li>" + href + value1 + "</a></li>";
  	}
  	chrome.runtime.sendMessage({id: "update"});
}
