(function () {
    var tabIdFrameIdToTokens = {};
    chrome.webRequest.onBeforeSendHeaders.addListener(function (request) {
        if (request.requestHeaders) {
            let authoizationHeader = request.requestHeaders.find(function (header) {
                return (header.name === 'Authorization') && header.value.startsWith('Bearer ');
            });
            if (authoizationHeader) {
                let requestInfo = [];
                requestInfo.push(request);
                tabIdFrameIdToTokens[request.tabId] = requestInfo;
            } else {
                // check if initiator changed
                let lastRequestArray = tabIdFrameIdToTokens[request.tabId];
                if (lastRequestArray && lastRequestArray.length && lastRequestArray.length > 0) {
                    let lastRequest = lastRequestArray[0];
                    if (lastRequest.initiator !== request.initiator) {
                        delete tabIdFrameIdToTokens[request.tabId];
                    }
                }

            }
        }
    },
    {
        urls: [
            "http://*:*/*",
            "https://*:*/*"
        ]
    },
    ["requestHeaders"]);

    chrome.runtime.onInstalled.addListener(function () {
        // Replace all rules ...
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
            // With a new rule ...
            chrome.declarativeContent.onPageChanged.addRules([
                {
                    // That fires when a page's URL contains a 'g' ...
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher({
                            pageUrl: { schemes: ['http', 'https'] },
                        })
                    ],
                    // And shows the extension's page action.
                    actions: [new chrome.declarativeContent.ShowPageAction()]
                }
            ]);
        });
    });

    chrome.runtime.onMessage.addListener(function(message, sender, responseCallback) {
        if (message.requestsForTabId) {
            responseCallback(tabIdFrameIdToTokens[message.requestsForTabId]);
        }
    });
})();