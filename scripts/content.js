// console.log(document.querySelector("#WEEKLY_SCHED_HTMLAREA > tbody > tr:nth-child(1) > th:nth-child(1)")?.textContent)
// classElement = console.log(document.querySelector("#DERIVED_REGFRM1_SS_TRANSACT_TITLE")?.textContent)
// console.log(document.querySelector("#DERIVED_SSTSNAV_PERSON_NAME")?.textContent)
// classElement = console.log(document.querySelector("#pthnavbca_MYFAVORITES")?.textContent)

iframeElement = document.querySelector("#ptifrmtgtframe")

console.log(iframeElement.contentWindow.document.body.querySelectorAll("#DERIVED_SSTSNAV_PERSON_NAME"))
console.log(iframeElement.contentWindow.document.body.querySelectorAll(".PSLEVEL3GRIDODDROW"))
// if (classElement){
//     console.log(classElement);
// } else {
//     console.log("Element not found.");
// }
