const feedRoleNodeAttribute = 'role';
const feedRoleNodeValue = 'feed';
const sponsoredLabels = ['贊助', 'Sponsored'];
const suggestedLabels = ['為你推薦', 'Suggested for you'];

const hideSponsoredPosts = () => {
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
                while (grandParent && grandParent.getAttribute(feedRoleNodeAttribute) !== feedRoleNodeValue) {
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

const hideSuggestedPosts = () => {
    const feedList = document.querySelectorAll(`[${feedRoleNodeAttribute}="${feedRoleNodeValue}"] > div > *:not([seen])`);
    feedList.forEach((feedNode) => {
        feedNode.setAttribute('seen', true);
        Array.from(feedNode.querySelectorAll('[dir="auto"]')).some(dirNode => {
            if (suggestedLabels.includes(dirNode.textContent)) {
                feedNode.style.visibility = 'hidden';
                feedNode.style.height = '0px';
                console.log('Suggested post hidden!');
                return true;
            }
        });
    });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.isFacebookSite) {
        const feedListParentNode = document.querySelector(`[${feedRoleNodeAttribute}="${feedRoleNodeValue}"] > div`);
        const config = { attributes: false, childList: true, subtree: false };
        const callback = (_mutationsList, _observer) => {
            hideSponsoredPosts();
            hideSuggestedPosts();
        };
        const observer = new MutationObserver(callback);
        observer.observe(feedListParentNode, config);
    }
});
