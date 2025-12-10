let options = {
    'alwaysInjectURLs': []
};

// Handle context menu click using onClicked event listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "jqueryInjector") {
        chrome.tabs.sendMessage(tab.id, { "function": "inject" });
    }
});

// Create the context menu - but only if it doesn't already exist
chrome.contextMenus.create({
    "id": "jqueryInjector",
    "title": "jQuery Injector",
    "contexts": ["all"]
}, () => {
    // Check for errors (like duplicate ID) and ignore them
    if (chrome.runtime.lastError) {
        console.log('Context menu item already exists or other error:', chrome.runtime.lastError.message);
    }
});

// Handle tab updates (similar to V2)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only send messages when the page is completely loaded
    if (changeInfo.status === 'complete' && tab.url) {
        for (let url in options['alwaysInjectURLs']) {
            if (tab.url.indexOf(options['alwaysInjectURLs'][url]) !== -1) {
                chrome.tabs.sendMessage(tabId, { "function": "inject" }).catch(error => {
                    console.log('Error sending inject message:', error);
                });
            }
        }

        // Only send query message when page is complete
        chrome.tabs.sendMessage(tabId, { "function": "query" }).catch(error => {
            console.log('Error sending query message:', error);
        });
    }
});

// Listen for messages sent from content scripts (e.g., for jQuery presence)
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.jqueryPresent) {
        chrome.action.setIcon({
            path: "../imgs/logo16_activated.png",
            tabId: sender.tab.id
        });
    }
});

// Listen for storage changes (local storage updates)
chrome.storage.onChanged.addListener((changes) => {
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
