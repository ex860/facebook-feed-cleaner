const feedRoleNodeAttribute = 'role';
const feedRoleNodeValue = 'feed';
const feedListSelector = {
    ssrbFeed: '#ssrb_feed_start + div > div > *:not([seen])',
    roleFeed: `[${feedRoleNodeAttribute}="${feedRoleNodeValue}"] > div > *:not([seen])`
};
const feedListRootSelector = '#ssrb_composer_end + div';
const sponsoredLabels = ['贊助', 'Sponsored'];
const suggestedLabels = ['為你推薦', 'Suggested for you'];

const hideSponsoredPosts = ssrbFeedStart => {
    document.querySelectorAll('div[data-pagelet="FeedUnit_{n}"]').forEach((node) => {
        node.setAttribute('seen', true);

        if (node.querySelectorAll('div.sponsored_ad').length != 0)
        {
            console.log(node.textContent);
            child = (node.querySelectorAll('div.sponsored_ad'))[0];
            child.style.visibility = 'hidden';
            child.style.height = '0px';
            console.log('Sponsored post hidden!');
        }
    });

    const sponsoredIds = [];
    document.querySelectorAll('svg text:not([seen])').forEach((node) => {
        node.setAttribute('seen', true);
        if (sponsoredLabels.includes(node.textContent)) {
            sponsoredIds.push(node.id);
        }
    });
    if (sponsoredIds.length) {
        const sponsoredIdselectors = sponsoredIds.map(id => `#${id}`);
        document.querySelectorAll(`svg > use:not([seen])`).forEach((useNode) => {
            useNode.setAttribute('seen', true);
            if (sponsoredIdselectors.includes(useNode.getAttribute('xlink:href'))) {
                let child = useNode;
                let parent = useNode?.parentNode;
                let grandParent = parent?.parentNode;
                while (grandParent) {
                    if (
                        ssrbFeedStart && grandParent.parentNode === ssrbFeedStart.nextElementSibling
                        || !ssrbFeedStart && grandParent.getAttribute(feedRoleNodeAttribute) === feedRoleNodeValue
                    ) {
                        break;
                    }
                    child = parent;
                    parent = grandParent;
                    grandParent = parent.parentNode;
                }
                if (grandParent && child.style.visibility === '') {
                    child.style.visibility = 'hidden';
                    child.style.height = '0px';
                    console.log('Sponsored post hidden!');
                }
            }
        });
    }
};

const hideSuggestedPosts = ssrbFeedStart => {
    let feedList = document.querySelectorAll(feedListSelector[ssrbFeedStart ? 'ssrbFeed' : 'roleFeed']);
    feedList.forEach((feedNode) => {
        feedNode.setAttribute('seen', true);
        Array.from(feedNode.querySelectorAll('[dir="auto"]')).some(dirNode => {
            if (suggestedLabels.includes(dirNode.textContent)) {
                feedNode.style.visibility = 'hidden';
                feedNode.style.height = '0px';
                console.log('Suggested post hidden!');
                // return true;
            }
        });
    });

    feedList = document.querySelectorAll('div[data-pagelet="FeedUnit_{n}"]');
    feedList.forEach((feedNode) => {
        feedNode.setAttribute('seen', true);
        Array.from(feedNode.querySelectorAll('[dir="auto"]')).some(dirNode => {
            if (suggestedLabels.includes(dirNode.textContent)) {
                console.log(dirNode.textContent);
                feedNode.style.visibility = 'hidden';
                feedNode.style.height = '0px';
                console.log('Suggested post hidden!');
                // return true;
            }
        });
    });

};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.isInFeedList) {
        const feedListRootNode = document.querySelector(feedListRootSelector);
        if (!feedListRootNode) {
            return;
        }
        const config = { attributes: false, childList: true, subtree: true };
        const callback = (_mutationsList, _observer) => {
            const ssrbFeedStart = document.getElementById('ssrb_feed_start');
            hideSponsoredPosts(ssrbFeedStart);
            hideSuggestedPosts(ssrbFeedStart);
        };
        const observer = new MutationObserver(callback);
        observer.observe(feedListRootNode, config);
    }
});