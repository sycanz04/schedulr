// Navigate user to 'schedulr' website when installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: "https://www.mmuschedulr.com/#usage",
    });
});

console.log("Service worker running");

// Listener to start authentication process
chrome.runtime.onMessage.addListener((message, sendResponse) => {
    if (message.action === "calChoice") {
        console.log("Received message in service-worker.js");
        getToken(sendResponse);
        return true;
    }
})

// Authenticate user and retrieve authentication token
function getToken(sendResponse) {
    console.log("Getting token");
    let tokenPromise = new Promise(function (myResolve) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError || !token) {
                console.error(
                    "Error getting OAuth token:",
                    chrome.runtime.lastError
                );
                sendResponse({
                    success: false,
                    message: "Error getting OAuth token",
                });
                return;
            }
            myResolve(token, sendResponse);
        });
    });

    tokenPromise.then(function (token, sendResponse) {
        console.log("Token retrieved. Fetching calendar IDs");
        getCalIds(token, sendResponse);
    });
}

// Query for user available calendars
function getCalIds(token, sendResponse) {
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
                sendResponse({
                    success: false,
                    message: `Error getting calendar id: ${response.statusText}`,
                });
            }
            console.log("Reponse ok, getting JSON");
            return response.json();
        })
        .then((calObject) => {
            // console.log('Calendar list:', calObject);
            parseCalIds(calObject, sendResponse);
        })
        .catch((error) => {
            console.error("Error occured:", error);
            sendResponse({
                success: false,
                message: `Error occured: ${error}`,
            });
        });
}

// Parse datas to only return calendar ids
function parseCalIds(calObject, sendResponse) {
    console.log("Parsing calendars");
    let calJson = {};
    calObject.items.forEach((calendar) => {
        if (!calendar.summary.includes("Holidays") && !calendar.summary.includes("Birthdays")) {
            calJson[calendar.summary] = calendar.id;
        }
    });

    console.log("Calendars parsed, sending calendar JSON back to popup.js");

    // Return list of calendar ids to popup.js
    sendResponse({
        success: true,
        data: calJson,
    });
}
