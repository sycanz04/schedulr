// Sends a message to listener in service-worker.js to query user available calendar
export function calChoice() {
    chrome.runtime.sendMessage(
        {action: "calChoice"},
        (response) => {
            if (response.success) {
                // console.log("Response:", response.data);
                const form = document.getElementById("calendarForm");
                setAttributes(form, response.data);
            } else {
                console.error(response.message);
                window.alert(response.message);
            }
        }
    );
}

// Creates all the available calendar choices in popup.html so user can choose which
// calendar to import events into
export function setAttributes(form, calData) {
    for (let cals in calData) {
        // Create input and label tag for every index
        const input = document.createElement("input");
        const label = document.createElement("label");
        const br = document.createElement("br");

        // Set attribute for input tag
        input.setAttribute("type", "radio");
        input.setAttribute("id", `${cals}`);
        input.setAttribute("name", "calendar");
        input.setAttribute("value", `${calData[cals]}`);

        // Set attribute for label tag
        label.innerText = `${cals}`;
        label.setAttribute("for", `${cals}`);

        // Append input and label tag, then a line break after
        form.appendChild(input);
        form.appendChild(label);
        form.appendChild(br);
    }

    // Hide the loader after calendar
    document.getElementById('loader').style.display = 'none';
}
