'use strict';

var tabs;
var currentTab;
var activity = new Activity();
var storage = new LocalStorage();
function updateSummaryTime(){
    setInterval(backgroundCheck, 2000);
}
function updateStorage(){
    setInterval(backgroundUpdateStorage, 3000);
}
function backgroundCheck(){
    chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
        if( currentWindow.focused ){
            var activeTab = currentWindow.tabs.find(t => t.active === true);
            if( activeTab!==undefined&&activity._ValidPage(activeTab) ){
                var activeUrl = activity._extractHost(activeTab.url);
                var tab = activity._getTab(activeUrl);
                if( tab===undefined ){
                    activity.addTab(activeTab);
                }
                else{
                    if( currentTab!==tab.url ){
                        activity.setCurrentActiveTab(tab.url);
                    }
                    tab.incSummaryTime();
                }
            }
        }
        else activity.clearCurrentActiveTab(); 
    });
}
function backgroundUpdateStorage(){
    if( tabs!=undefined&&tabs.length>0 )
        storage.saveTabs(tabs);
}
function addListener(){
    chrome.tabs.onActivated.addListener(function (info) {
        chrome.tabs.get(info.tabId, function (tab) {
            activity.addTab(tab);
        });
    });
    chrome.webNavigation.onCompleted.addListener(function (details) {
        chrome.tabs.get(details.tabId, function (tab) {
            activity.updateFavicon(tab);
        });
    });
    chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSdImHtvey6sg5mzsQwWfAQscgZOOV52blSf9HkywSXJhuQQHg/viewform");
}
function loadTabs(){
    storage.loadTabs(STORAGE_TABS, function (x){
        tabs = [];
        if( x!=undefined ){
            for( var i=0; i<x.length; i++ ){
                tabs.push(new Tab(x[i].url, x[i].favicon, x[i].days, x[i].summaryTime, x[i].counter));
            }
        }
    });
}
function loadAddDataFromStorage() {
    loadTabs();
}
addListener();
loadAddDataFromStorage();
updateSummaryTime();
updateStorage();