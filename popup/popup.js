window.onload = function() {
    document.querySelector('button').addEventListener('click', function() {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            if (chrome.runtime.lastError || !token) {
                console.error('Error getting OAuth token:', chrome.runtime.lastError);
                return;
            }

            console.log(token);
            createCalendarEvent(token);
        });
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: currTab.id },
            files: ["scripts/content.js"]
        });
    });
};

// Function to create a calendar event
function createCalendarEvent(accessToken) {
    const event = {
        'summary': 'Subject A',
        'location': 'Location A',
        'start': {
            'dateTime': '2024-08-12T09:00:00+08:00',
            'timeZone': 'Asia/Kuala_Lumpur'
        },
        'end': {
            'dateTime': '2024-08-12T17:00:00+08:00',
            'timeZone': 'Asia/Kuala_Lumpur'
        }
    };

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Event created:', data);
        })
        .catch(error => {
            console.error('Error creating event:', error);
        });
}
