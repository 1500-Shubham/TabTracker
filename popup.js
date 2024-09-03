 async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true,
    });
  
    return tabs[0];
  }
  
document.addEventListener("DOMContentLoaded", async () => {
    const startButton = document.getElementsByClassName("start")[0];
    const stopButton = document.getElementsByClassName("stop")[0];

    chrome.runtime.sendMessage({ action: "getInteractionState" }, (response) => {
        // Once the response is received, update button states accordingly
        if (response && response.interactionStart) {
            startButton.disabled = true;
            stopButton.disabled = false;
        } else {
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    });


    startButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "toggleInteraction", interactionStart: true });
        startButton.disabled = true; // Disable the start button
        stopButton.disabled = false; // Enable the stop button


    });

    stopButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "toggleInteraction", interactionStart: false });
        stopButton.disabled = true; // Disable the stop button
        startButton.disabled = false; // Enable the start button
        chrome.runtime.sendMessage({ action: "stopRecordingAndGenerateInteraction"});
    });

});