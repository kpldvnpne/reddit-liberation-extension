chrome.storage.sync.get(['userData'], function(result) {
    whiteList = [];
    blackList = [];
    var pausedUntilTime = null;
    if (result.userData != undefined)
    {
        whiteList = result.userData.whiteList;
        if (whiteList == null) {
            whiteList = [];
        }

        blackList = result.userData.blackList;
        if (blackList == null) {
            blackList = [];
        }

        pausedUntilTime = result.userData.pausedUntilTime;
    }

    var userData = result.userData;

    whiteListElement = document.getElementById("whiteList");
    blackListElement = document.getElementById("blackList");

    function updatePausedElement(pausedUntilTime) {
        var pausedElement = document.getElementById("current-pause");

        // populate currently paused time
        if (pausedUntilTime != null) {
            var currentTime = Date.now();
            var pausedTimePassed = pausedUntilTime <= currentTime;

            if (pausedTimePassed) {
                // eliminate the time from storage
                chrome.storage.sync.set({userData: {...userData, pausedTimePassed: null }}, () => {});
                pausedElement.innerHTML = '';
            } else {
                var time = new Date(pausedUntilTime).toLocaleString();
                var minutes = (pausedUntilTime - currentTime) / 60 / 1000;
                minutes = Math.ceil(minutes);
                pausedElement.innerHTML = `Currently paused for ${minutes} minutes (until: ${time})`;
            }
        }
    }

    updatePausedElement(pausedUntilTime);


    // populate the lists
    whiteList.forEach(element => {
        whiteListElement.innerHTML += "<button class=\"whiteElement\">" + element +  " X</button>"
    })

    blackList.forEach(element => {
        blackListElement.innerHTML += "<button class=\"blackElement\">" + element + " X</button>"
    })

    var addList = function()
    {
        if (this.id == "addWhiteListButton")
        {
            whiteList.push(document.getElementById("addWhiteList").value.toLowerCase())
            whiteListElement.innerHTML += "<button class=\"whiteElement\">" + document.getElementById("addWhiteList").value.toLowerCase() +  " X</button>"
            document.getElementById("addWhiteList").value = ""

            userData = {...userData, whiteList: whiteList, blackList: blackList}
            chrome.storage.sync.set({userData: userData}, function() {
                //console.log('Value is set to ' + userData)
            });
            document.getElementById("addWhiteListButton").onclick = addList;
        }
        else
        {
            blackList.push(document.getElementById("addBlackList").value.toLowerCase())
            blackListElement.innerHTML += "<button class=\"blackElement\">" + document.getElementById("addBlackList").value.toLowerCase() +  " X</button>"
            document.getElementById("addBlackList").value = ""

            userData = {...userData, whiteList: whiteList, blackList: blackList}
            chrome.storage.sync.set({userData: userData}, function() {
                //console.log('Value is set to ' + userData)
            });
            document.getElementById("addBlackListButton").onclick = addList;
        }

        let whiteElements = document.getElementsByClassName("whiteElement");

        for(let i = 0; i < whiteElements.length; i++) {
            whiteElements[i].onclick = removeFromList
        }

        let blackElements = document.getElementsByClassName("blackElement");

        for(let i = 0; i < blackElements.length; i++) {
            blackElements[i].onclick = removeFromList
        }
    }

    var removeFromList = function()
    {
        subredditName = this.innerText.substring(0, this.innerText.length-2);
        var isSubredditname = (element) => element == subredditName;
        // find the subreddit name whiteList/blackList and remove it from there
        // update google storage
        // remove the element from the options page

        if (this.className == "whiteElement")
        {
            whiteList.splice(whiteList.findIndex(isSubredditname), 1);
            userData = {...userData, whiteList: whiteList, blackList: blackList}
            chrome.storage.sync.set({userData: userData}, function() {

            });
            this.remove();

        }
        else
        {
            blackList.splice(blackList.findIndex(isSubredditname), 1);
            userData = {...userData, whiteList: whiteList, blackList: blackList}
            chrome.storage.sync.set({userData: userData}, function() {

            });
            this.remove();

        }
    }

    var pauseFor5Minutes = function () {
        pausedUntilTime = new Date().getTime() + 5 * 60 * 1000;
        userData = { whiteList, blackList, pausedUntilTime };
        chrome.storage.sync.set({userData: userData}, function() {});

        updatePausedElement(pausedUntilTime);
    }

    document.getElementById("pauseFor5MinBtn").onclick = pauseFor5Minutes;
    document.getElementById("addWhiteListButton").onclick = addList;
    document.getElementById("addBlackListButton").onclick = addList;


    let whiteElements = document.getElementsByClassName("whiteElement");

    for(let i = 0; i < whiteElements.length; i++) {
        whiteElements[i].onclick = removeFromList
    }

    let blackElements = document.getElementsByClassName("blackElement");

    for(let i = 0; i < blackElements.length; i++) {
        blackElements[i].onclick = removeFromList
    }
});
