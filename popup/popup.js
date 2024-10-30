import { getAuthToken, getCurrTab } from './helper/prog-flow.js';

// Query for user available calendar then insert into popup.html dynamically
function calChoice() {
    chrome.runtime.sendMessage({
        action: "calChoice"
    });
}

calChoice();

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "calData") {
        let calData = message.data;
        // console.log("Cal Data:", calData);

        // Get form element in html
        const form = document.getElementById("calendarForm");

        setAttributes(form, calData);
    } else if (message.action === "showAlert") {
        window.alert(calData);
    }
});

function setAttributes(form, calData) {
    // Ideal html tags in popup.js
    // <input type="radio" id="$summary" name="calender" value="$calId">
    // <label for="$summary>$Summary</label><br>

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

let selectedOptionValue;

// Function to handle event
function finalButtonClickHandler(event) {
    event.preventDefault();
    getFormsValue(selectedOptionValue);
}

// Listener to get selected option value
document.getElementById('optionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    selectedOptionValue = document.querySelector('input[name="option"]:checked')?.value;
    console.log(`Received option value: ${selectedOptionValue}`);

    if (!(selectedOptionValue)) {
        window.alert('Please select an option.');
        return;
    }

    // Hide the loader after calendar
    const firstPage = document.getElementsByClassName('firstPage')[0].style.display = 'none';

    // Query all possible forms
    let generalForms = document.getElementsByClassName('generalForms')[0];
    let backButton = document.getElementById('backButton');
    let calForms = document.getElementsByClassName('calForms')[0];
    let finalButton = document.getElementsByClassName('finalButton')[0];

    generalForms.style.display = 'flex';
    backButton.style.display = 'flex';

    // Display appropriate forms
    if (selectedOptionValue == 1 || selectedOptionValue == 3) {
        calForms.style.display = 'flex';
        finalButton.style.display = 'flex';
    } else if (selectedOptionValue == 2) {
        finalButton.style.display = 'flex';
    }

    // Remove previously attached listener
    finalButton.removeEventListener('click', finalButtonClickHandler);

    // Attach new listener
    finalButton.addEventListener('click', finalButtonClickHandler);
});

// Event listener for the back button
document.getElementById('backButton').addEventListener('click', function() {
    // Query all forms
    let optionForm = document.getElementsByClassName('optionForm')[0];
    let generalForms = document.getElementsByClassName('generalForms')[0];
    let calForms = document.getElementsByClassName('calForms')[0];
    let finalButton = document.getElementsByClassName('finalButton')[0];

    // Hide the second page forms
    generalForms.style.display = 'none';
    calForms.style.display = 'none';
    finalButton.style.display = 'none';

    // Clear the previous form options
    // optionForm.innerHTML = '';

    // Show the first page again
    document.getElementsByClassName('firstPage')[0].style.display = 'flex';

    // Hide the back button itself since we're back on the first page
    document.getElementById('backButton').style.display = 'none';
});

// Checks all neccessary field vary by selected option value
function getFormsValue(selectedOptionValue) {
    try{
        // Get the value of the selected radio button
        const selectedSemesterValue = document.querySelector('input[name="semester"]:checked')?.value;
        const selectedReminderTime = document.querySelector('input[name="reminder"]:checked')?.value;
        const selectedColorValue = document.querySelector('input[name="color"]:checked')?.value;
        const selectedCalendar = document.querySelector('input[name="calendar"]:checked')?.value;
        const selectedEventFormat = document.querySelector('input[name="format"]:checked')?.value;

        if (selectedOptionValue == 1 || selectedOptionValue == 3) {
            // Check if all values are selected
            if (!(selectedSemesterValue && selectedReminderTime && selectedColorValue && selectedCalendar && selectedEventFormat)) {
                window.alert('Please select all options.');
                return;
            }

            handleFlow(selectedColorValue, selectedCalendar, selectedReminderTime, selectedSemesterValue, selectedEventFormat, selectedOptionValue);

        } else if (selectedOptionValue == 2) {
            // Check if all values are selected
            if (!(selectedSemesterValue && selectedReminderTime && selectedEventFormat)) {
                window.alert('Please select all options.');
                return;
            }

            handleFlow(null, null, selectedReminderTime, selectedSemesterValue, selectedEventFormat, selectedOptionValue);
        }
    }
    catch(err) {
        console.error('An error occured: ', err);
        window.alert(`An error occured: ${err.message}`);
    }
}

// This function handles token and window flow
async function handleFlow(selectedColorValue, selectedCalendar, selectedReminderTime, selectedSemesterValue, selectedEventFormat, selectedOptionValue) {
    try {
        // Get Oauth token
        const token = await getAuthToken();

        // Get the current active tab
        const currTab = await getCurrTab();

        // Execute dataProc in the current tab
        chrome.scripting.executeScript({
            target: { tabId: currTab.id },
            func: dataProc,
            args: [token, selectedSemesterValue, selectedReminderTime, selectedColorValue, selectedCalendar, selectedEventFormat, selectedOptionValue]
        });

    } catch (error) {
        console.error('Error in handleFlow:', error);
        window.alert('Error:', error.message);
    }
}

function dataProc(token, selectedSemesterValue, selectedReminderTime, selectedColorValue, selectedCalendar, selectedEventFormat, selectedOptionValue) {
    // =============== Helper functions ===============
    // Function to create a calendar event
    function createCalendarEvent(event) {
        fetch(`https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar}/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then(response => {
            if (!response.ok) {
                console.error(`Error creating event: ${response.statusText}`);
                window.alert(`Error creating event: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Event created:', data);
        })
        .catch(error => {
            console.error('Error creating event:', error);
            window.alert(`Failed to create event: ${error.message}`);
        });
    }

    // Remove unnecessary prefix
    function truncLocation(location){
        const prefix = "Common Lecture Complex &amp; ";
        if (location.startsWith(prefix)) {
            return location.slice(prefix.length).trim();
        }
        return location;
    }

    // Remove unnecessary spaces for class. Currently looks like 'LM     PU3192 - FCI4'
    function truncClassSpace(className){
        const [beforeHyphen, afterHyphen] = className.split('-');
        const trimBeforeHyphen = beforeHyphen.replace(/\s+/g, '');
        const fullClassName = `${trimBeforeHyphen} -${afterHyphen}`
        return fullClassName
    }

    // Reformat time. Current looks like '2:00PM - 4:00PM' and '10:00AM - 12:00PM' 
    // Target format '2024-08-12T09:00:00+08:00'
    function formatTime(classTime){
        function convertTimeFormat(timeStr) {
            const [time, period] = timeStr.split(/(AM|PM)/);

            let [hour, minute] = time.split(':');

            if (period === 'AM' && parseInt(hour) < 10) {
                hour = `0${hour}`;
            } else if (period === 'AM' && parseInt(hour) > 9) {
                hour = `${hour}`;
            } else if (period === 'PM' && parseInt(hour) < 12) {
                hour = parseInt(hour) + 12;
            }

            return `${hour}:${minute}:00+08:00`;
        }

        const [startTime, endTime] = classTime.split('-').map(t => t.trim());


        return {
            formattedStartTime: convertTimeFormat(startTime),
            formattedEndTime: convertTimeFormat(endTime)
        }
    }

    // Reformat date. Currently looks like '14 Aug'
    // Target format '2024-08-14'
    function formatDate(classDate, yearElement){
        // Get the correct date and month
        const [date, month] = classDate.split(' ')
        // console.log(`${date},${month}`)
        const months = {
            'Jan':'01', 'Feb':'02', 'Mar':'03', 'Apr':'04',
            'May':'05', 'Jun':'06', 'Jul':'07', 'Aug':'08',
            'Sep':'09', 'Oct':'10', 'Nov':'11', 'Dec':'12'
        }

        let monthValue = months[month];
        endDateYear = yearElement.substr(-4, 4);
        return `${endDateYear}-${monthValue}-${date}`
    }

    function createArray(rows, cols, value = 0) {
        let arr = new Array(rows);
        for (let i = 0; i < rows; i++) {
            arr[i] = new Array(cols).fill(value);
        }

        // console.log(arr);
        return arr;
    }

    function rowSpan(fStartTime, fEndTime) {
        // Parse formatted time
        const startTime = fStartTime.split(':');
        const endTime = fEndTime.split(':');

        // Get hour/min
        const startHour = parseInt(startTime[0]);
        const endHour = parseInt(endTime[0]);
        const endMin = parseInt(endTime[1]);

        hourSpan = endHour - startHour;
        if (endMin > 0) {
            let minSpan = 1;
            totalSpan = hourSpan + minSpan
        } else {
            totalSpan = hourSpan;
        }
        // console.log(totalSpan);

        return totalSpan;
    }

    function handleMultiHourClass(totalSpan, rowIndex, skip, colIndex) {
        // For every total - 1 span
        for (i = 1; i < totalSpan; i++) {
            // If next row is a valid row
            if (rowIndex + i < skip.length) {
                // Edit value to 1 in row i
                skip[rowIndex + i][colIndex] = 1;

                updatePrevCol(colIndex, skip, rowIndex + i)
                let nextRow = rowIndex + i
            }
        }
    }

    function updatePrevCol(colIndex, skip, nextRow) {
        // Checks the col before curr one
        let itrColIndex = colIndex - 1;
        while(itrColIndex > 0) {
            if(skip[nextRow][itrColIndex] > 0) {
                skip[nextRow][itrColIndex] += 1;
            }
            else {
                break;
            }
            itrColIndex -= 1;
        }
    }

    function createCalEvent(summary, classLocation, startDate, formattedStartTime, endDate, formattedEndTime, selectedSemesterValue, selectedColorValue, selectedReminderTime) {
        let event = {
            'summary': `${summary}`,
            'location': `${classLocation}`,
            'start': {
                'dateTime': `${startDate}T${formattedStartTime}`,
                'timeZone': 'Asia/Kuala_Lumpur'
            },
            'end': {
                'dateTime': `${endDate}T${formattedEndTime}`,
                'timeZone': 'Asia/Kuala_Lumpur'
            },
            'recurrence': [
                `RRULE:FREQ=WEEKLY;COUNT=${selectedSemesterValue}`
            ],
            'reminders': {
                'useDefault': false,
                'overrides': []
            },
        }

        if (selectedReminderTime !== "none") {
            event.reminders.overrides.push({
                'method': 'popup',
                'minutes': parseInt(selectedReminderTime)
            })
        }

        if (selectedOptionValue != 2) {
            event.colorId = selectedColorValue
        }

        return event;
    }

    function procData(classContent, subjTitleVal, classInstructorVal) {
        const subjCodeAndClassSect = truncClassSpace(classContent[0]);
        const subjCode = subjCodeAndClassSect.split("-")[0].trim();
        const classSect = subjCodeAndClassSect.split("-")[1].trim();

        let baseIndex = 1;
        let subjTitle = null;
        let classInstructor = null;

        if (subjTitleVal === "Y") {
            subjTitle = classContent[baseIndex];
            baseIndex += 1;
        }

        // Abbreviate the class types
        let classType = classContent[baseIndex];
        if (classType === "Lecture") {
            classType = "Lec";
        } else if (classType === "Tutorial") {
            classType = "Tut";
        } else if (classType === "Laboratory") {
            classType = "Lab";
        }

        const classTime = classContent[baseIndex + 1];
        const {formattedStartTime, formattedEndTime} = formatTime(classTime);
        const classLocation = truncLocation(classContent[baseIndex + 2]);

        if (classInstructorVal === "Y") {
            classInstructor = classContent[baseIndex + 4];
        }

        return {
            subjCode,
            classSect,
            subjTitle,
            classType,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            classLocation,
            classInstructor
        }
    }
    
    // This function converts json object into ical format and write it into .ics file
    function icalBlob(event, selectedReminderTime) {
        // Define the header and footer of the iCalendar
        const icalHeader = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//sycanz/schedulr//EN`;
        const icalTz = `\nBEGIN:VTIMEZONE\nTZID:Asia/Kuala_Lumpur\nBEGIN:STANDARD\nTZOFFSETFROM:+0800\nTZOFFSETTO:+0800\nTZNAME:GMT+8\nEND:STANDARD\nEND:VTIMEZONE`
        const icalFooter = `\nEND:VCALENDAR`;

        allClasses = classCalIcs(event);

        const icalContent = icalHeader + icalTz + allClasses + icalFooter;

        return icalContent
    }

    function classCalIcs(event) {
        // Empty string to store all class events
        let allClasses = ""
        event.forEach((classes) => {
            // Convert from 2024-09-30T10:00:00 to 19980118T073000Z
            let dtStart = classes.start.dateTime.replace(/[-:]/g, "").split("+")[0];
            let dtEnd = classes.end.dateTime.replace(/[-:]/g, "").split("+")[0];

            let {uid, dtStamp} = uidAndDtstamp();

            // Create empty string to store all events
            let classEvent = `
BEGIN:VEVENT
SUMMARY:${classes.summary}
LOCATION:${classes.location}
DTSTART;TZID=${classes.start.timeZone}:${dtStart}
DTEND;TZID=${classes.end.timeZone}:${dtEnd}
${classes.recurrence[0]}
UID:${uid}
DTSTAMP:${dtStamp}Z`


            if (selectedReminderTime !== "none") {
                classEvent += `
BEGIN:VALARM
TRIGGER:-PT${selectedReminderTime}M
DESCRIPTION:${classes.summary}
ACTION:DISPLAY
END:VALARM`;
            }

            // Close the event
            classEvent += `\nEND:VEVENT`;

            // Append the class event to allClasses
            allClasses += classEvent;
        });

        return allClasses;
    }

    function uidAndDtstamp() {
        // Generate and get all necessary date time
        let date = new Date();
        const year = date.getFullYear().toString();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        // Generate a short random string
        const randomStr = Math.random().toString(36).substring(2, 8);

        const dtStamp = `${year}${month}${day}T${hours}${minutes}${seconds}`;
        const uid = `${randomStr}-${dtStamp}@schedulr.com`;
        // console.log(dtStamp, uid);

        return {uid, dtStamp};
    }

    function addZeroToDate(date) {
        // Split date string to date and month
        const splitDate = date.split(" ");

        // Get date string
        const parseDate = parseInt(splitDate[0]);
        const parseMonth = splitDate[1];

        // Add 0 to date if it's 1 digit
        let formattedDate;
        if (parseDate > 0 && parseDate < 10) {
            formattedDate = `0${parseDate}`;
        } else {
            formattedDate = parseDate.toString();
        }

        // Combine date month
        const realDate = `${formattedDate} ${parseMonth}`;

        return realDate;
    }

    function procClassName(className) {
        // console.log(className.trim());
        splitClassName = className.trim().split(/\s+/);
        // console.log(splitClassName);

        let classCode = splitClassName[0] + splitClassName[1];
        let classNameOnly = "";
        for (let i = 2; i < splitClassName.length; i++) {
            classNameOnly += splitClassName[i] + " ";
        }

        classNameOnly = classNameOnly.trim();

        // console.log(classCode, ",", classNameOnly);
        return {classCode, classNameOnly};
    }

    function procClassDetails(classDetails) {
        splitClassDetails = classDetails.split(" - ");
        // console.log(splitClassDetails);

        classType = splitClassDetails[0].split(" ")[1];
        classSect = splitClassDetails[1].split(" ")[2];
        // console.log(splitClassType);

        return {classType, classSect};
    }

    function procClassDates(classDates) {
        // console.log(classDates);
        let splitClassDates = classDates.trim().split(" - ");
        // console.log(splitClassDates[0], splitClassDates[1]);

        let startDate = splitClassDates[0].replace(/\//g, "-").split("-").reverse().join("-");
        let endDate = splitClassDates[1].replace(/\//g, "-").split("-").reverse().join("-");

        // console.log(startDate, ",", endDate);
        return {startDate, endDate};
    }

    function procClassTimes(classTimes) {
        // console.log(classTimes);
        let splitClassTimes = classTimes.trim().split(" ");
        // console.log(splitClassTimes[1], ",", splitClassTimes[3]);

        function convertTimeFormat(timeStr) {
            const [time, period] = timeStr.split(/(AM|PM)/);

            let [hour, minute] = time.split(':');

            if (period === 'AM' && parseInt(hour) < 10) {
                hour = `0${hour}`;
            } else if (period === 'AM' && parseInt(hour) > 9) {
                hour = `${hour}`;
            } else if (period === 'PM' && parseInt(hour) < 12) {
                hour = parseInt(hour) + 12;
            }

            return `${hour}:${minute}:00+08:00`;
        }

        startTime = convertTimeFormat(splitClassTimes[1]);
        endTime = convertTimeFormat(splitClassTimes[3]);
        // console.log(convertTimeFormat(startTime), ",", convertTimeFormat(endTime));

        return {startTime, endTime};
    }

    // =============== End of helper functions ===============

    // =============== Web scrape workflow ===============
    let classEvents = [];

    // Declare iframe
    const iframeElement = document.querySelector("#ptifrmtgtframe");

    const lectIndicator = document.querySelector("table.ptalNoPadding.ptalPgltAreaControlsIcon a#ptalPgltAreaHide");
    
    if (lectIndicator) {
        // Do the lecturer's process
        console.log("We got a lecturer here!");
        lectFlow();
    } else {
        // Do the student's process
        studentFlow();
    }

    function lectFlow() {
        // Access the iframe's content document
        const iframeDocument = iframeElement.contentWindow.document.body;

        // Select elements in iframe
        const dayHeader = iframeDocument.querySelectorAll("th.PSLEVEL3GRIDODDROW");
        const rows = iframeDocument.querySelectorAll("table.PSLEVEL3GRIDODDROW  tr");
        const year = iframeDocument.querySelector("div#win0divDERIVED_CLASS_S_DESCR100_2 td.PSGROUPBOXLABEL.PSLEFTCORNER").textContent;
        const subjTitleVal = iframeDocument.querySelector('input[name="DERIVED_CLASS_S_SSR_DISP_TITLE$chk"][id="DERIVED_CLASS_S_SSR_DISP_TITLE$chk"]').value;
        const classInstructorVal = iframeDocument.querySelector('input[name="DERIVED_CLASS_S_SSR_DISP_ROLE$chk"][id="DERIVED_CLASS_S_SSR_DISP_ROLE$chk"]').value;

        if (!dayHeader || dayHeader.length === 0) {
            console.error("No day elements found");
            window.alert("No day elements found");
            return;
        }

        if (subjTitleVal === "N" && (selectedEventFormat === "2" || selectedEventFormat === "3")) {
            console.error('Please check "Show Class Title" box below the calendar under Display Options!');
            window.alert('Please check "Show Class Title" box below the calendar under Display Options!');
            return;
        }

        // Get the dates
        const days = []
        const dates = []
        dayHeader.forEach((element, index) => {
            if (index === 0) {
                dates.push("null");
            } else {
                const dayText = element.textContent.split("\n");
                const day = dayText[0].trim();
                let date = dayText[1]
                date = addZeroToDate(date);
                // console.log(`Day: ${day}, Date: ${date}`);
                days.push(day);
                dates.push(date);
                // console.log(`Days: ${days}, Date: ${dates}`);
            }
        });

        // days.shift();
        // dates.shift();
        // console.log(days);
        // console.log(dates);

        // Create array to store all events.
        let skip = createArray(12, 8, 0);

        // For every tr
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll("td.PSLEVEL3GRIDODDROW");
            // console.log(`Amount of cells: ${cells.length}`);

            // track current col skips
            let curColSkips = 0;

            // For every cell
            cells.forEach((cell, susColIndex) => {
                if (susColIndex > 0) { // Other than the first one
                    let colIndex = susColIndex + curColSkips;
                    // console.log(rowIndex, susColIndex);

                    if (skip[rowIndex][susColIndex] > 0) {
                        curColSkips += 1;
                        colIndex += skip[rowIndex][susColIndex];
                    }

                    try {
                        const spanElement = cell.querySelector("span");
                        if (!spanElement) return;

                        // Get innerHTML and process data
                        const classContent = spanElement.innerHTML.split('<br>');
                        let result = procData(classContent, subjTitleVal, classInstructorVal);
                        // console.log(result);

                        const day = days[colIndex - 1];
                        const startDate = formatDate(dates[colIndex], year);
                        const endDate = formatDate(dates[colIndex], year);

                        /*
                    Let user choose thier own event format:
                    Subject Code - Section (Type)
                    Subject Name - Section (Type)
                    Subject Name - Code - Section (Type)
                    */
                        let summary = `${result.subjCode} - ${result.classSect} (${result.classType})`;

                        if (selectedEventFormat === "2") {
                            summary = `${result.subjTitle} - ${result.classSect} (${result.classType})`;
                        } else if (selectedEventFormat === "3") {
                            summary = `${result.subjTitle} - ${result.subjCode} - ${result.classSect} (${result.classType})`;
                        }

                        console.log(`Summary: ${summary}, Location: ${result.classLocation}, Day: ${day}, startDateTime: ${startDate}T${result.startTime}, endDateTime: ${endDate}T${result.endTime}`);

                        // If class is 2 hours, mark slot below as "True"
                        let totalSpan = rowSpan(result.startTime, result.endTime);

                        // If the class's total span is more than an hour
                        if (totalSpan > 1) {
                            handleMultiHourClass(totalSpan, rowIndex, skip, colIndex);
                        }

                        const event = createCalEvent(summary, result.classLocation, startDate, result.startTime
                            , endDate, result.endTime, selectedSemesterValue, selectedColorValue, selectedReminderTime, selectedOptionValue);
                        // Append to array after defining events
                        // console.log('Event: ', event)

                        // classEvents.push(event);
                        // console.log(classEvents);

                        // Log the selected value
                        // console.log(`RRULE:FREQ=WEEKLY;COUNT=${selectedSemesterValue}`);
                        // console.log('Selected semester value:', selectedSemesterValue);

                        if (selectedOptionValue == 1 || selectedOptionValue == 3) {
                            if (token) {
                                // console.log("Extension end");
                                createCalendarEvent(event);
                            }
                        }
                        classEvents.push(event);

                    } catch (error) {
                        console.error('Error processing class data:', error);
                        window.alert('Failed to process class data:', error);
                        return;
                    }
                }
            });
        });
    }

    function studentFlow() {
        // console.log(openClassSec);
        let classSec = document.querySelectorAll("[id^='win0divDERIVED_SSR_FL_SSR_SCRTAB_DTLS']");

        // For each class sections
        classSec.forEach((element, index) => {
            // Select all class name, type, dates, times, and location
            let className = element.querySelectorAll("[id^='DERIVED_SSR_FL_SSR_SCRTAB_DTLS']");
            let classDetails = element.querySelectorAll("a[id^='DERIVED_SSR_FL_SSR_SBJ_CAT_NBR$355']");
            let classDates = element.querySelectorAll("[id^='DERIVED_SSR_FL_SSR_ST_END_DT1']");
            let classTimes = element.querySelectorAll("[id^='DERIVED_SSR_FL_SSR_DAYSTIMES1']");
            let classLoc = element.querySelectorAll("[id^='DERIVED_SSR_FL_SSR_DRV_ROOM1']");

            let maxSlots = Math.max(classDetails.length);

            for (let i = 0; i < maxSlots; i++) {
                // Get the text content of the elements
                let classNameText = className[0].textContent;
                let classDetailsText = classDetails[i].textContent.trim();
                let classDatesText = classDates[i].textContent.trim();
                let classTimesText = classTimes[i].textContent.trim();
                let classLocText = classLoc[i].textContent.trim();

                // Call function to ultimately create calendar event
                groupData(classNameText, classDetailsText, classDatesText, classTimesText, classLocText);
            }
        })

        function groupData(className, classDetails, classDates, classTimes, classLoc) {
            // console.log(className, classType, classDates, classTimes, classLoc);

            let {classCode, classNameOnly} = procClassName(className);
            let {classType, classSect} = procClassDetails(classDetails);
            let {startDate, endDate} = procClassDates(classDates);
            let {startTime, endTime} = procClassTimes(classTimes);

            // console.log(classCode, ",", classNameOnly, ",", classType, ",", classSect, ",", startDate, "-", endDate, ",", startTime, ",", endTime, ",", classLoc);

            /*
        Let user choose thier own event format:
        Subject Code - Section (Type)
        Subject Name - Section (Type)
        Subject Name - Code - Section (Type)
        */
            let summary = `${classCode} - ${classSect} (${classType})`;

            if (selectedEventFormat === "2") {
                summary = `${classNameOnly} - ${classSect} (${classType})`;
            } else if (selectedEventFormat === "3") {
                summary = `${classNameOnly} - ${classCode} - ${classSect} (${classType})`;
            }

            // console.log("Summary:", summary);

            const event = createCalEvent(summary, classLoc, startDate, startTime
                , startDate, endTime, selectedSemesterValue, selectedColorValue, selectedReminderTime, selectedOptionValue);

            console.log(event);

            if (selectedOptionValue == 1 || selectedOptionValue == 3) {
                if (token) {
                    // console.log("Extension end");
                    createCalendarEvent(event);
                }
            }

            classEvents.push(event);
        }
    }

    if (selectedOptionValue == 2 || selectedOptionValue == 3) {
        // Create a blob file for users to download
        // console.log(classEvents);
        icalContent = icalBlob(classEvents, selectedReminderTime);

        console.log(icalContent);

        const icsContainer = document.querySelector('.ics-container');
        if (icsContainer) {
            console.log("Found icsContainer", icsContainer);
        }

        // Convert data to Blob
        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);

        const downloadButton = document.createElement('a');
        downloadButton.href = blobUrl;
        downloadButton.download = 'schedulr.ics';
        downloadButton.innerText = 'Download .ics';
        downloadButton.classList.add('download-btn');

        downloadButton.click();
    }

    // =============== End of web scrape workflow ===============

    if (selectedOptionValue == 1) {
        window.alert("Timetable transferred to Google Calendar!");
    } else if (selectedOptionValue == 2){
        window.alert(".ics file installed!");
    } else {
        window.alert("Timetable transferred to Google Calendar and installed .ics file!");
    }
}
