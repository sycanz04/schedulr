chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "calChoice") {
        retrieveCalId();
    } else {
        console.log("Unexpected message received!");
    }
});

function retrieveCalId() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        if (chrome.runtime.lastError || !token) {
            console.error('Error getting OAuth token:', chrome.runtime.lastError);
            window.alert('Failed to get OAuth token. Please try again.');
            return;
        }
        console.log(token);
    });
}
