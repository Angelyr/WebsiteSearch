//receives messages
chrome.runtime.onMessage.addListener(receiver);
function receiver(request, sender, sendResponse) {
	
	//Sends document links to the popup script
	if(request.id == "userinput"){
		l = document.links;
		var urls = [];
		for(var i=0; i<l.length; i++){
			urls.push(l[i].href);
		}
		//Send links and userinput
		var msg = {
			id : "userinput/links",
			urls: urls,
			userinput: request.userinput,
			delay: request.delay
		}
		chrome.runtime.sendMessage(msg)
	}
}