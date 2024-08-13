let value = null;

document.getElementById('semesterForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission

    // Get the selected value
    const selectedSemesterValue = document.querySelector('input[name="semester"]:checked').value;

    // Set the recurrence based on the selected value
    if (selectedSemesterValue === '7') {
        value = '1';
        console.log("Selected 7 short weeks semester");
    } else if (selectedSemesterValue === '14') {
        value = '2';
        console.log("Selected 14 long weeks semester");
    }

    chrome.identity.getAuthToken({interactive: true}, function(token) {
        if (chrome.runtime.lastError || !token) {
            console.error('Error getting OAuth token:', chrome.runtime.lastError);
            return;
        }

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currTab = tabs[0];
            chrome.scripting.executeScript({
                target: { tabId: currTab.id },
                func: (token, recurrenceValue) => {
                    console.log(`Received token: ${token}`)
                    console.log(`Received value: ${recurrenceValue}`)
                    // Store the token and recurrence value globally
                    window.accessToken = token;

                    // ===============Google API===============
                    // Function to create a calendar event
                    function createCalendarEvent(accessToken, event) {
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

                    // ===============Web scrape functions===============
                    // Declare iframe
                    function processIframe(){
                        iframeElement = document.querySelector("#ptifrmtgtframe");

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
                        function formatDate(classDate){
                            const [date, month] = classDate.split(' ')
                            // console.log(`${date},${month}`)
                            const months = {
                                'Jan':'01',
                                'Feb':'02',
                                'Mar':'03',
                                'Apr':'04',
                                'May':'05',
                                'Jun':'06',
                                'Jul':'07',
                                'Aug':'08',
                                'Sep':'09',
                                'Oct':'10',
                                'Nov':'11',
                                'Dec':'12'
                            }
                            let monthValue = months[month]
                            return `2024-${monthValue}-${date}`
                        }

                        if (iframeElement) {
                            // Access the iframe's content document
                            const iframeDocument = iframeElement.contentWindow.document.body;

                            // Select elements in iframe
                            const dayHeader = iframeDocument.querySelectorAll("th.PSLEVEL3GRIDODDROW");
                            const rows = iframeDocument.querySelectorAll("table.PSLEVEL3GRIDODDROW  tr")

                            // Get the dates
                            const days = []
                            const dates = []
                            if (dayHeader.length > 0) {
                                dayHeader.forEach((element) => {
                                    const dayText = element.textContent.split("\n");
                                    const day = dayText[0].trim();
                                    const date = dayText[1]
                                    days.push(day);
                                    dates.push(date);
                                })
                            } else {
                                console.log("No day elements found")
                            }

                            // Get the class details
                            rows.forEach((row) => {
                                const cells = row.querySelectorAll("td.PSLEVEL3GRIDODDROW")

                                if (cells.length > 0) {
                                    cells.forEach((cell, colIndex) => {
                                        if (colIndex > 0) {
                                            const spanElement = cell.querySelector("span");
                                            if (spanElement) {
                                                // Get innerHTML
                                                const classContent = spanElement.innerHTML.split('<br>');

                                                // Process data
                                                const className = truncClassSpace(classContent[0]) + ', ' + classContent[1];
                                                const classTime = classContent[2];
                                                const {formattedStartTime, formattedEndTime} = formatTime(classTime);
                                                const classLocation = truncLocation(classContent[3]);

                                                const day = days[colIndex];
                                                const date = formatDate(dates[colIndex]);

                                                console.log(`Summary: ${className}, Location: ${classLocation}, Day: ${day}, startDateTime: ${date}T${formattedStartTime}, endDateTime: ${date}T${formattedEndTime}`);

                                                const event = {
                                                    'summary': `${className}`,
                                                    'location': `${classLocation}`,
                                                    'start': {
                                                        'dateTime': `${date}T${formattedStartTime}`,
                                                        'timezone': 'Asia/Kuala_Lumpur'
                                                    },
                                                    'end': {
                                                        'dateTime': `${date}T${formattedEndTime}`,
                                                        'timezone': 'Asia/Kuala_Lumpur'
                                                    },
                                                    'recurrence': [
                                                        `RRULE:FREQ=WEEKLY;COUNT=1`
                                                    ]
                                                }

                                                if (window.accessToken) {
                                                    createCalendarEvent(window.accessToken, event);
                                                }
                                            }
                                        }
                                    });
                                }
                            })
                        } else{
                            console.log("iframe not found")
                        }
                    }
                    processIframe();
                },
                args: [token, value]
            });
        });
    });
});
