chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.executeScript({code: "__darken();"});
})
