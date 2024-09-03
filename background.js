
let interactionStart=false;
let interactionData = {};

async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true,
    });
  
    return tabs[0];
  }
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url.startsWith('chrome://') && changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, {
            type: "OnUpdated", // type of event new tab khula hai woh event hai
            tabId:tabId,
            tabUrl:tab.url,
            interactionAllowed:interactionStart,
          });
    }
});



// popup buttons start and stop globally state defince till browser closed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleInteraction") {
        interactionStart = request.interactionStart;
        getActiveTabURL().then(activeTab => {
            chrome.tabs.sendMessage(activeTab.id, {
                type: "popUpInteractionChanged",
                interactionAllowed: interactionStart,
            });
        });
    }

    else if (request.action === "getInteractionState") {
        // Send the current interactionStart state to the popup
        sendResponse({ interactionStart: interactionStart });
    }
    else if (request.action === "getInteractionState") {
        // Send the current interactionStart state to the popup
        sendResponse({ interactionStart: interactionStart });
    }
    else if (request.action === "stopRecordingAndGenerateInteraction") {
        // Send the current interactionStart state to the popup
        console.log(interactionData)
    }
    else if(request.type === "interactionData"){
        // {type: 'interactionData', tabId: 1940292019, payload: {…}}
        if (!interactionData[request.tabId]) {
            interactionData[request.tabId] = [];
        }
        interactionData[request.tabId].push(request.payload);
    }


});
