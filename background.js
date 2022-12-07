function checkForValidUrl() {
    const facebookUrl = 'https://www.facebook.com/*';
    chrome.tabs.query({ active: true, currentWindow: true, url: facebookUrl }, function(tabs) {
        if (tabs.length) {
            chrome.tabs.sendMessage(tabs[0].id, { isFacebookSite: true }, function() {});
        }
    });
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);
