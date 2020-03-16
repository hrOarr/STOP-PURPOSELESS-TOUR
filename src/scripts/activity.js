'use strict';

class Activity{
    addTab( tab ){
        if( this._ValidPage(tab)===true ){
            if( tab.id&&(tab.id!=0) ){
                tabs = tabs || [];
                var domain = this._extractHost(tab.url);
                if( this._NewUrl( domain ) ){
                    var favicon = tab.favIconUrl;
                    if( favicon===undefined ){
                         favicon = 'chrome://favicon/' + domain;
                    }
                    var newTab = new Tab(domain, favicon);
                    tabs.push(newTab);
                }
                else{
                    this.setCurrentActiveTab(domain);
                    var tabUrl = this._getTab(domain);
                    if (tabUrl !== undefined)
                        tabUrl.incCounter();
                }
            }
        }
    }
    _ValidPage( tab ){
        if (!tab || !tab.url || (tab.url.indexOf('http:') == -1 && tab.url.indexOf('https:') == -1))
            return false;
        return true;
    }
    _NewUrl(domain) {
        if (tabs.length > 0)
            return tabs.find(o=>o.url===domain)===undefined;
        else
            return true;
    }
    _getTab( domain ){
        if( tabs!==undefined )
            return tabs.find(o=>o.url===domain);
    }
    _extractHost( url ){
        var host;
        if( url.indexOf("//")>-1 ){
            host = url.split('/')[2];
        }
        else{
            host = url.split('/')[0];
        }
        host = host.split(':')[0];
        host = host.split('?')[0];
        return host;
    }
    updateFavicon( tab ){
        var domain = this.extractHostname(tab.url);
        var currentTab = this.getTab(domain);
        if( currentTab!==null&&currentTab!==undefined ){
            if( tab.favIconUrl!==undefined&&tab.favIconUrl!==currentTab.favicon ){
                currentTab.favicon = tab.favIconUrl;
            }
        }
    }
    setCurrentActiveTab( domain ){
        currentTab = domain;
    }
    clearCurrentActiveTab(){
        currentTab = '';
    }
};