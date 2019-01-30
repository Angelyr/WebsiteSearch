chrome.runtime.onMessage.addListener(receiver);
function receiver(request, sender, sendResponse) {
	//search document for word. respond depending on what it found
	if(request.id == "processTab"){
		var word = (request.txt).toLowerCase();
		var found = document.body.innerText.toLowerCase().match(word);
		if(found == null) sendResponse(false);
		else sendResponse(true);
	}
	return true;
}