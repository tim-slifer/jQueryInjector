/*
var options = {
    'alwaysInjectURLs'     : []
};

function contextMenu_onclick( info, tab ) {
    var tab_id          = 0;

    chrome.tabs.query({
        "active"        : true,
        "currentWindow" : true
    }, function ( tabs ) {
        tab_id = tabs[ 0 ].id;

        chrome.tabs.sendMessage( tab_id, { "function" : "inject" } );
    });
};

chrome.contextMenus.create({
    "title"     : "jQuery Injector",
    "contexts"  :[ "all" ],
    "onclick"   : contextMenu_onclick
});

chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab ) {
    for( url in options[ 'alwaysInjectURLs'] ) {
        if( tab.url.indexOf( options[ 'alwaysInjectURLs'][ url ] ) != -1 ) {
            chrome.tabs.sendMessage( tabId, { "function" : "inject" } );
        }
    }

    chrome.tabs.sendMessage( tabId, { "function" : "query" } );
});

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ) {
    if( message.jqueryPresent ) {
        chrome.browserAction.setIcon({
            path: "../imgs/logo16_activated.png",
            tabId: sender.tab.id
        });
    }
});

chrome.storage.onChanged.addListener( function( changes, namespace ) {
    for (key in changes) {
        var storageChange = changes[key];

        options[ key ] = storageChange.newValue;
    }
});

chrome.storage.local.get( options, function ( items ) {
    for( key in items ) {
        options[ key ] = items[ key ];
    }
});
*/

let options = {
    'alwaysInjectURLs': []
};

// Handle context menu click
function contextMenu_onclick(info, tab) {
    chrome.tabs.sendMessage(tab.id, { "function": "inject" });
}

// Create the context menu
chrome.contextMenus.create({
    "title": "jQuery Injector",
    "contexts": ["all"],
    "onclick": contextMenu_onclick
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
