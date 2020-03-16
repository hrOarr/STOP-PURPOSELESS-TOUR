'use strict';

var storage = new LocalStorage();
var ui = new UI();
var totalTime;
var tabsFromStorage;
var sortedTabs;
var currentTypeList;
var today = new Date().toLocaleDateString("en-US");
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnToday').addEventListener('click', function () {
        currentTypeList = TypeListEnum.ToDay;
        ui._UItoday();
        _DataFromStorage();
    });
    document.getElementById('btnAll').addEventListener('click', function () {
        currentTypeList = TypeListEnum.All;
        ui._UIall();
        _DataFromStorage();
    });
});
_InitPage();
function _InitPage(){
    currentTypeList = TypeListEnum.ToDay;
    _DataFromStorage();
}
function _DataFromStorage(){
    storage.loadTabs(STORAGE_TABS, _TabsFromStorage, _EmptyBlock);
}
function getDataFromStorageByDays(){
    storage.loadTabs(STORAGE_TABS, getTabsByDays);
}
function _EmptyBlock(){
    ui._initEmptyBlock('chart');
}
function _TabsFromStorage( tabs ){
    tabsFromStorage = tabs;
    sortedTabs = [];
    ui._clearUI();
    if( tabs===null ){
        ui._initEmptyBlock('chart');
        return;
    }
    var SiteCount;
    if( currentTypeList===TypeListEnum.All ){
        sortedTabs = tabs.sort(function ( a, b ){
            return b.summaryTime-a.summaryTime;
        });
        if( sortedTabs.length>0 ){
            totalTime = _TotalTime(sortedTabs);
        }
        else {
            ui._initEmptyBlock('chart');
            return;
        }
        SiteCount = tabs.length;
    }
    if( currentTypeList===TypeListEnum.ToDay ){
        sortedTabs = tabs.filter(x=>x.days.find(s=>s.date===today));
        SiteCount = sortedTabs.length;
        if( sortedTabs.length>0 ){
            sortedTabs = sortedTabs.sort(function ( a, b ){
                return b.days.find(s=>s.date===today).summary-a.days.find(s=>s.date===today).summary;
            });
            totalTime = _TotalTime(sortedTabs);
        }
        else{
            ui._initEmptyBlock('chart');
            return;
        }
    }
    if( currentTypeList===TypeListEnum.All ){
        ui._TableHeader(currentTypeList, SiteCount, _FirstDay());
    }
    if( currentTypeList===TypeListEnum.ToDay ){
        ui._TableHeader(currentTypeList, SiteCount);
    }
    var currentTab = _CurrentTab();
    var ChartTabs = [];
    for( var i=0; i<sortedTabs.length; i++ ){
        var summaryTime,counter;
        if( currentTypeList===TypeListEnum.ToDay ){
            summaryTime = sortedTabs[i].days.find(x=>x.date==today).summary;
            if( sortedTabs[i].days.find(x=>x.date==today) ){
                counter = sortedTabs[i].days.find(x=>x.date==today).counter;
            }
        }
        if( currentTypeList===TypeListEnum.All ){
            summaryTime = sortedTabs[i].summaryTime;
            counter = sortedTabs[i].counter;
        }
        if( i<3&&(currentTypeList===TypeListEnum.ToDay||currentTypeList===TypeListEnum.All) ){
            ui._addSiteToTable(sortedTabs[i], currentTab, summaryTime, currentTypeList, counter);
        }
        if( i<=6 ){
            _addTabChart(ChartTabs, sortedTabs[i].url, summaryTime, counter);
        }
        else{
            _addTabOthersChart(ChartTabs, summaryTime);
        }
    }
    ui._drawChart(ChartTabs);ui._ActiveTooltipe(currentTab);
}
function _TotalTime( tabs ){
    var total;
    if( currentTypeList===TypeListEnum.ToDay ){
        var summaryTimeList = tabs.map(function ( a ) { return a.days.find(s=>s.date===today).summary; });
        total = summaryTimeList.reduce(function (a, b) { return a+b; })
    }
    else if( currentTypeList===TypeListEnum.All ){
        var summaryTimeList = tabs.map(function (a) { return a.summaryTime; });
        total = summaryTimeList.reduce(function (a, b) { return a+b; })
    }
    return total;
}
function _Percentage( time ){
    return ((time/totalTime)*100).toFixed(2)+' %';
}
function _ChartPercentage( time ){
    return ((time/totalTime)*100).toFixed(2)/100;
}
function _CurrentTab(){
    return chrome.extension.getBackgroundPage().currentTab;
}
function _addTabChart( chartTabs, url, time, counter ){
    chartTabs.push(
        {
            'url': url,
            'percentage': _ChartPercentage(time),
            'summary': time,
            'visits': counter
        }
    );
}
function _addTabOthersChart( chartTabs, summaryTime ){
    var tab = chartTabs.find(x=>x.url=='Others');
    if( tab===undefined ){
        chartTabs.push(
            {
                'url': 'Others',
                'percentage': _ChartPercentage(summaryTime),
                'summary': summaryTime
            }
        );
    }
    else{
        tab['summary'] += summaryTime;
        tab['percentage'] = _ChartPercentage(tab['summary']);
    }
}

function _FirstDay(){
    var array = [];
    tabsFromStorage.map(function ( a ){
        return a.days.map(function ( a ){
            if( array.indexOf( a.date )===-1)
                return array.push(a.date);
        });
    });
    array = array.sort(function ( a, b ){
        return new Date(a)- new Date(b);
    });
    return {
        'countOfDays': array.length,
        'minDate': array[0]
    };
}