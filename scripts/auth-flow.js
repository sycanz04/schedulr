export function getToken() {
    console.log("Getting token");

    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError || !token) {
                console.error(
                    "Error getting OAuth token:",
                    chrome.runtime.lastError
                );
                reject(chrome.runtime.lastError || "Failed to get token");
            } else {
                resolve(token);
            }   
        });
    });
}

