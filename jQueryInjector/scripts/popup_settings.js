var options = {
    'alwaysInjectURLs': []
};

chrome.storage.local.get(options, function (items) {
    for (let key in items) {
        options[key] = items[key];
    }

    // Query for the current active tab
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        var tab_id = tabs[0].id;

        // Check if the tab's URL matches any of the alwaysInjectURLs
        for (let url in options['alwaysInjectURLs']) {
            if (tabs[0].url.indexOf(options['alwaysInjectURLs'][url]) !== -1) {
                document.getElementById('alwaysInject').style.display = 'none';
            }
        }

        // Inject jQuery when button is clicked
        document.getElementById('inject').onclick = function () {
            chrome.tabs.sendMessage(tab_id, { "function": "inject" });
            document.getElementById('inject').textContent = "INJECTED ✓";
            setTimeout(function () {
                document.getElementById('inject').textContent = "INJECT INTO PAGE";
            }, 1000);
        };

        // Add the current URL to alwaysInjectURLs when button is clicked
        document.getElementById('alwaysInject').onclick = function () {
            options['alwaysInjectURLs'].push(tabs[0].url);
            chrome.storage.local.set({ alwaysInjectURLs: options['alwaysInjectURLs'] });

            document.getElementById('alwaysInject').textContent = "ADDED ✓";
            setTimeout(function () {
                document.getElementById('alwaysInject').style.display = 'none';
            }, 1000);
        };

        // Open the options page when button is clicked
        document.getElementById('showOptions').onclick = function () {
            chrome.runtime.openOptionsPage();
        };
    });
});
