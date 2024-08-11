// Declare iframe
iframeElement = document.querySelector("#ptifrmtgtframe");

if (iframeElement) {
    // Access the iframe's content document
    const iframeDocument = iframeElement.contentWindow.document.body;

    // Select elements in iframe
    const name = iframeDocument.querySelector("#DERIVED_SSTSNAV_PERSON_NAME");
    const day = iframeDocument.querySelectorAll("th.PSLEVEL3GRIDODDROW");
    const classes = iframeDocument.querySelectorAll("td.PSLEVEL3GRIDODDROW");
    
    // Get the name details
    if (name) {
        const textContent = name.textContent;

        console.log(textContent);
    } else {
        console.log("Name not found inside iframe");
    }

    // Get the dates
    if (day.length > 0) {
        day.forEach((element) => {
            const dayText = element.textContent.split("\n");
            const day = dayText[0].trim();
            console.log(day)
        })
    }

    // Get the class details
    if (classes.length > 0) {
        classes.forEach((element) => {
            const spanElement = element.querySelector("span");
            if (spanElement) {
                const classesContent = spanElement.textContent;
                console.log(classesContent)
            }
        });
    } else {
        console.log("No class elements found in side iframe")
    }
} else{
    console.log("iframe not found")
}
