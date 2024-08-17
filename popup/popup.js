document.getElementById('semesterForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting

    // Get the value of the selected radio button
    const selectedSemesterValue = document.querySelector('input[name="semester"]:checked').value;

    chrome.identity.getAuthToken({interactive: true}, function(token) {
        if (chrome.runtime.lastError || !token) {
            console.error('Error getting OAuth token:', chrome.runtime.lastError);
            return;
        }

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currTab = tabs[0];
            chrome.scripting.executeScript({
                target: { tabId: currTab.id },
                func: (token, selectedSemesterValue) => {
                    window.accessToken = token;  // Store the token globally

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
                        function formatDate(period, classDate, yearElement){
                            // Get the correct date and month
                            const [date, month] = classDate.split(' ')
                            // console.log(`${date},${month}`)
                            const months = {
                                'Jan':'01', 'Feb':'02', 'Mar':'03', 'Apr':'04',
                                'May':'05', 'Jun':'06', 'Jul':'07', 'Aug':'08',
                                'Sep':'09', 'Oct':'10', 'Nov':'11', 'Dec':'12'
                            }

                            let monthValue = months[month];
                            if (period === 'end'){
                                endDateYear = yearElement.substr(-4, 4);
                                return `${endDateYear}-${monthValue}-${date}`
                            } else if (period === 'start') {
                                // console.log(`Year Element: ${yearElement}`)
                                frontDatePeriod = yearElement.split("-");
                                startDate = frontDatePeriod[0].split(" ");
                                startDateYear = startDate[2].substr(-4, 4)
                                return `${startDateYear}-${monthValue}-${date}`
                            }
                        }

                        if (iframeElement) {
                            // Access the iframe's content document
                            const iframeDocument = iframeElement.contentWindow.document.body;

                            // Select elements in iframe
                            const dayHeader = iframeDocument.querySelectorAll("th.PSLEVEL3GRIDODDROW");
                            const rows = iframeDocument.querySelectorAll("table.PSLEVEL3GRIDODDROW  tr");
                            const year = iframeDocument.querySelector("div#win0divDERIVED_CLASS_S_DESCR100_2 td.PSGROUPBOXLABEL.PSLEFTCORNER").textContent;

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
                                                const startDate = formatDate('start', dates[colIndex], year);
                                                const endDate = formatDate('end', dates[colIndex], year);

                                                console.log(`Summary: ${className}, Location: ${classLocation}, Day: ${day}, startDateTime: ${startDate}T${formattedStartTime}, endDateTime: ${endDate}T${formattedEndTime}`);

                                                var event = {
                                                    'summary': `${className}`,
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
                                                    ]
                                                }

                                                console.log('Event: ', event)

                                                // console.log("Final event object: ", event);
                                                // Log the selected value

                                                // console.log(`RRULE:FREQ=WEEKLY;COUNT=${selectedSemesterValue}`);
                                                // console.log('Selected semester value:', selectedSemesterValue);

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
                args: [token, selectedSemesterValue]
            });
        });
    });
});
