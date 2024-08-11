// Declare iframe
iframeElement = document.querySelector("#ptifrmtgtframe");

if (iframeElement) {
    // Access the iframe's content document
    const iframeDocument = iframeElement.contentWindow.document.body;

    // Select elements in iframe
    const dayHeader = iframeDocument.querySelectorAll("th.PSLEVEL3GRIDODDROW");
    const rows = iframeDocument.querySelectorAll("table.PSLEVEL3GRIDODDROW  tr")
    const classCells = iframeDocument.querySelectorAll("td.PSLEVEL3GRIDODDROW");
    
    // Get the dates
    const days = []
    if (dayHeader.length > 0) {
        dayHeader.forEach((element) => {
            const dayText = element.textContent.split("\n");
            const day = dayText[0].trim();
            days.push(day);
        })
        console.log(days);
    } else {
        console.log("No day elements found")
    }

    // Get the class details
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td.PSLEVEL3GRIDODDROW")

        if (cells.length > 0) {
            const timeSlot = cells[0]?.textContent.trim();

            cells.forEach((cell, colIndex) => {
                if (colIndex > 0) {
                    const spanElement = cell.querySelector("span");
                    if (spanElement) {
                        const classContent = spanElement.textContent.trim();
                        const day = days[colIndex];
                        console.log(`Day: ${day}, Time: ${timeSlot}, Class: ${classContent}`);
                    }
                }
            });
        }
    })
    // if (classes.length > 0) {
    //     classes.forEach((element) => {
    //         const spanElement = element.querySelector("span");
    //         if (spanElement) {
    //             const classesContent = spanElement.textContent;
    //             console.log(classesContent)
    //         }
    //     });
    // } else {
    //     console.log("No class elements found in side iframe")
    // }
} else{
    console.log("iframe not found")
}
