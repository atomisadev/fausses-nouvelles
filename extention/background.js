chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentUrl = tabs[0].url;
        var newUrl = 'https://faussesnouvelles.com/article?url=' + encodeURIComponent(currentUrl);
        chrome.tabs.update(tabs[0].id, { url: newUrl });
    });
});
