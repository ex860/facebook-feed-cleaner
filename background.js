function checkForValidUrl() {
    chrome.tabs.getSelected(null, function(tab) {
        let newsUrlRegex = /www3.nhk.or.jp\/news\/easy\/.*\/.*\.html|easyjapanese.net\/news\/.*/;
        if (newsUrlRegex.test(tab.url)) {
            let site = '';
            if (/www3.nhk.or.jp\/news\/easy\/.*\/.*\.html/.test(tab.url)) {
                site = 'nhk';
            } else if (/easyjapanese.net\/news\/.*/.test(tab.url)) {
                site = 'easyjp';
            }
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { greeting: 'CorrectURL', site: site }, function() {});
            });
        }
    });
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);
