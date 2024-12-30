export function getCalIds(token) {
    return fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                console.error("Error getting calendar id:", response.error);
                windows.alert("Error getting calendar id:", response.error);
            }
            console.log("Reponse ok, getting JSON");
            return response.json();
        })
        .then((calObject) => {
            // console.log('Calendar list:', calObject);
            return parseCalIds(calObject);
        })
        .catch((error) => {
            console.error("Error occured:", error);
            windows.error("Error occured:", error);
        });
}

function parseCalIds(calObject) {
    console.log("Parsing calendars");

    let calJson = {};
    calObject.items.forEach((calendar) => {
        if (!calendar.summary.includes("Holidays") &&
            !calendar.summary.includes("Birthdays")) {
            calJson[calendar.summary] = calendar.id;
        }
    });

    console.log("Calendars parsed, sending calendar JSON back to popup.js");
    return calJson;
}
