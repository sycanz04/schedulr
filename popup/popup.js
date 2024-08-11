console.log("Hello World")


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currTab = tabs[0];
    chrome.scripting.executeScript({
        target: { tabId: currTab.id },
        files: ["scripts/content.js"]
    });
});
