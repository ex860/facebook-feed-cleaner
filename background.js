function checkForValidUrl() {
    const fbFeedListUrl = 'https://www.facebook.com/';
    chrome.tabs.query({ active: true, currentWindow: true, url: fbFeedListUrl }, function(tabs) {
        if (tabs.length) {
            chrome.tabs.sendMessage(tabs[0].id, { isInFeedList: true }, function() {});
        }
    });
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);
