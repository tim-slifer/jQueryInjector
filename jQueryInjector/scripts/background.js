let options = {
    'alwaysInjectURLs': []
};

// Handle context menu click using onClicked event listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "jqueryInjector") {
        chrome.tabs.sendMessage(tab.id, { "function": "inject" });
    }
});

// Create the context menu
chrome.contextMenus.create({
    "id": "jqueryInjector",
    "title": "jQuery Injector",
    "contexts": ["all"]
});

// Handle tab updates (similar to V2)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    for (let url in options['alwaysInjectURLs']) {
        if (tab.url.indexOf(options['alwaysInjectURLs'][url]) !== -1) {
            chrome.tabs.sendMessage(tabId, { "function": "inject" });
        }
    }

    // Sending a query to the content script (this part was already present in V2)
    chrome.tabs.sendMessage(tabId, { "function": "query" });
});

// Listen for messages sent from content scripts (e.g., for jQuery presence)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.jqueryPresent) {
        chrome.action.setIcon({
            path: "../imgs/logo16_activated.png",
            tabId: sender.tab.id
        });
    }
});

// Listen for storage changes (local storage updates)
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
        let storageChange = changes[key];
        options[key] = storageChange.newValue;
    }
});

// Initialize options from local storage when the service worker starts
chrome.storage.local.get(options, (items) => {
    for (let key in items) {
        options[key] = items[key];
    }
});

// Note: Service workers are event-driven, so this file doesn't retain state across events.
