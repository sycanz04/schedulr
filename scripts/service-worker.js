// Navigate user to 'schedulr' website when installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: "https://www.mmuschedulr.com/#usage",
    });
});

console.log("Service worker running");
function messageListener(message) {
    if (message.action === "calChoice") {
        console.log("Received message in service-worker.js");
        getToken();
    }
}

// Add the listener
chrome.runtime.onMessage.addListener(messageListener);

function getToken() {
    console.log("Getting token");
    let tokenPromise = new Promise(function (myResolve) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError || !token) {
                console.error(
                    "Error getting OAuth token:",
                    chrome.runtime.lastError
                );
                chrome.runtime.sendMessage({
                    action: "showAlert",
                    message: "Error getting OAuth token",
                });
                return;
            }
            myResolve(token);
        });
    });

    tokenPromise.then(function (token) {
        console.log("Token retrieved. Fetching calendar IDs");
        getCalIds(token);
    });
}

function getCalIds(token) {
    fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                console.log(`Error creating event: ${response.statusText}`);
                chrome.runtime.sendMessage({
                    action: "showAlert",
                    message: `Error getting calendar id: ${response.statusText}`,
                });
            }
            console.log("Reponse ok, getting JSON");
            return response.json();
        })
        .then((calObject) => {
            // console.log('Calendar list:', calObject);
            parseCalIds(calObject);
        })
        .catch((error) => {
            console.error("Error occured:", error);
            chrome.runtime.sendMessage({
                action: "showAlert",
                message: `Error occured: ${error}`,
            });
        });
}

function parseCalIds(calObject) {
    console.log("Parsing calendars");
    let calJson = {};
    calObject.items.forEach((calendar) => {
        if (
            !calendar.summary.includes("Holidays") &&
            !calendar.summary.includes("Birthdays")
        ) {
            calJson[calendar.summary] = calendar.id;
        }
    });

    console.log("Calendars parsed, sending calendar JSON back to popup.js");
    chrome.runtime.sendMessage({
        action: "calData",
        data: calJson,
    });
}
