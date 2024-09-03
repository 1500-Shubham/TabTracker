(() => {
let tab_id="";
let tab_url="";
let interaction_allowed=false;

  // Function to generate XPath for an element
  function getXPath(element) {
    const idx = (sib, name) => sib
        ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1
        ? ['']
        : elm.id && document.getElementById(elm.id) === elm
        ? [`@id="${elm.id}"`]
        : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/');
}

function createIframe() {
  const iframe = document.createElement('iframe');
  iframe.id = 'myFrame';
  iframe.src = 'http://127.0.0.1:3000/';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.width = '500px';
  iframe.style.height = '400px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '9999';
  document.body.appendChild(iframe);
}
// Inject the iframe into the current tab
createIframe();

  document.addEventListener("click", function(event) {
    if (interaction_allowed) {
        const element = event.target;
        const elementXPath = getXPath(element);
        console.log("element",element)
        console.log("elementXpath",elementXPath)
        // sendInteractionData("click", elementXPath);
        chrome.runtime.sendMessage({
            type: "interactionData",
            tabId: tab_id,
            payload: {tabUrl:tab_url,
            elementXPath: elementXPath,
            action:"click"
            }
        });
        // sending message to iframe window that is my frontend app
        let message={
          type: "interactionData",
          tabId: tab_id,
          payload: {tabUrl:tab_url,
          elementXPath: elementXPath,
          action:"click"
          }
        }
        const iframe = document.getElementById('myFrame');
        iframe.contentWindow.postMessage(message, 'http://127.0.0.1:3000');
      }
});

  
    // Function to debounce the input event
    function debounce(func, wait) {
        let timeout;
    
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
    
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Function to handle input event
    function handleInput(event) {
        if (interaction_allowed) {
            const element = event.target;
            const enteredText = element.value;
            console.log("Text entered into textarea:", enteredText);
            chrome.runtime.sendMessage({
                type: "interactionData",
                tabId: tab_id,
                payload: {tabUrl: tab_url,
                enteredText: enteredText,
                action:"input"}
              });

              let message={
                type: "interactionData",
                tabId: tab_id,
                payload: {tabUrl: tab_url,
                enteredText: enteredText,
                action:"input"}
              }
        const iframe = document.getElementById('myFrame');
        iframe.contentWindow.postMessage(message, 'http://127.0.0.1:3000');
        }
    }
    function handleScroll(event) {
        if (interaction_allowed) {
            const initialScrollingValue = window.scrollY; // Get the vertical scroll position
            console.log(initialScrollingValue); 
            chrome.runtime.sendMessage({
                type: "interactionData",
                tabId: tab_id,
                payload: {tabUrl: tab_url,
                scrollValue: initialScrollingValue,
                action:"scroll"}
              });
              let message={
                type: "interactionData",
                tabId: tab_id,
                payload: {tabUrl: tab_url,
                scrollValue: initialScrollingValue,
                action:"scroll"}
              }
        const iframe = document.getElementById('myFrame');
        iframe.contentWindow.postMessage(message, 'http://127.0.0.1:3000');    
        }
    }
    
    document.addEventListener("input", debounce(handleInput, 1000)); // Pass the debounce delay (5000 milliseconds in this example)
      // no need to scroll as in webpage complete domTree is available toh locate any element by just using ID, class name
      document.addEventListener("scroll", debounce(handleScroll, 1000));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
 let {type,tabId,tabUrl,interactionAllowed } = request
 console.log(request)
 if (type === "OnUpdated") {
    tab_id=tabId;
    tab_url=tabUrl;
    interaction_allowed=interactionAllowed;
  }
  else if(type==="popUpInteractionChanged"){
    interaction_allowed=interactionAllowed  
  }

});


})();