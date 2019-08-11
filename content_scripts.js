function fixedPlayer(site) {
    let a;
    if (site === 'easyjp') {
        a = $('#audio-player')[0].style;
    } else if (site === 'nhk') {
        a = $('#js-audio-wrapper')[0].style;
    }
    a.position = 'fixed';
    a.bottom = '80px';
    a.right = '0';
    a['background-color'] = 'white';
    a['z-index'] = '1000';
    a.padding = '0';
    a.width = '38%';
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting === 'CorrectURL') {
        fixedPlayer(request.site);
    }
});
