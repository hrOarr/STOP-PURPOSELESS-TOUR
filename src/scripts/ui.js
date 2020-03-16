'use strict';

class UI{

    _TableSites(){
        return document.getElementById('resTable');
    }
    _UItoday(){
        document.getElementById('btnToday').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        this._UIChart();this._clearUI();
    }
    _UIall(){
        document.getElementById('btnAll').classList.add('active');
        document.getElementById('btnToday').classList.remove('active');
        this._clearUI();
    }
    _clearUI(){
        document.getElementById('resTable').innerHTML = null;
        document.getElementById('chart').innerHTML = null;
    }
    _UIChart(){
        document.getElementById('ChartBtn').classList.add('active');
    }
    _initEmptyBlock(elementName){
        document.getElementById(elementName).innerHTML = '<p class="no-data">No data</p>';
    }
    _initEmptyBlockForDaysIfInvalid(){
        document.getElementById('tableForDaysBlock').innerHTML = '<p class="no-data">Invalid date</p>';
    }
    _initEmptyBlockForDays(){
        document.getElementById('tableForDaysBlock').innerHTML = '<p class="no-data">No data</p>';
    }
    _ActiveTooltipe( currentTab ){
        if( currentTab!=='' ){
            var el = document.getElementById(currentTab);
            if( el!==null ){
                var ev = new Event("mouseenter");
                document.getElementById(currentTab).dispatchEvent(ev);
            }
        }
    }
    _drawChart( tabs ){
        var donut = donutChart()
            .width(550)
            .height(230)
            .cornerRadius(5) // sets how rounded the corners are on each slice
            .padAngle(0.020) // effectively dictates the gap between slices
            .variable('percentage')
            .category('url');

        d3.select('#chart')
            .datum(tabs) // bind data to the div
            .call(donut); // draw chart in div
    }
    _TableHeader( TypeList, SiteCount, totalDays ){
        var p = document.createElement('p');
        p.classList.add('table-header');
        if( TypeList===TypeListEnum.ToDay){
            p.innerHTML = 'Top '+Math.min(3,SiteCount)+' site(s) '+'Today from ('+SiteCount+' sites)';
        }
        else if( TypeList===TypeListEnum.All&&totalDays!==undefined ){
            if( totalDays.countOfDays>0 ){
                p.innerHTML = 'Top '+Math.min(3,SiteCount)+' site(s) since '+ new Date(totalDays.minDate).toLocaleDateString()+' ('+totalDays.countOfDays+' days) from ('+SiteCount+' sites)';
            }
            else{
                p.innerHTML = 'Top '+Math.min(3,SiteCount)+' site(s) since '+ new Date().toLocaleDateString()+' from ('+SiteCount+' sites)';
            }
        }
        this._TableSites().appendChild(p);
    }
    _addSiteToTable( tab, currentTab, summaryTime, TypeList, counter ) {
        
        var div = document.createElement('div');
        // cursor effect
        // mouse enter
        div.addEventListener('mouseenter', function (){
            if( document.getElementById('chart').innerHTML!=='' ){
                var x = document.getElementById(tab.url);
                if( x!==null ){
                    x.dispatchEvent(new Event('mouseenter'));
                    x.classList.add('mouse-over');
                }
                else{
                    document.getElementById('Others').dispatchEvent(new Event('mouseenter'));
                    document.getElementById('Others').classList.add('mouse-over');
                }
            }
        });
        // mouse leave
        div.addEventListener('mouseout', function (){
            if( document.getElementById('chart').innerHTML!=='' ){
                var x = document.getElementById(tab.url);
                if( x!==null ){
                    x.classList.remove('mouse-over');
                }
                else{ 
                    document.getElementById('Others').classList.remove('mouse-over');
                }
            }
        });
        div.classList.add('inline-flex');

        // set favicon of site
        var dfav = document.createElement('div');
        var img = document.createElement('img');
        img.setAttribute('height', 17);
        if( tab.favicon!==undefined||tab.favicon==null ){
            img.setAttribute('src', tab.favicon);
        }
        else{
            img.setAttribute('src', '/icons/empty.png');
        }
        dfav.classList.add('block-img');
        dfav.appendChild(img);

        var spanUrl = this._createElement('span', ['span-url'], tab.url);

        if( tab.url==currentTab ){
            var dfav = document.createElement('div');
            div.classList.add('span-active-url');
            var currentDom = document.createElement('img');
            currentDom.setAttribute('src', '/icons/eye.png');
            currentDom.setAttribute('height', 17);
            currentDom.classList.add('margin-left-5');
            dfav.appendChild(currentDom);
            var currentDomTooltip = this._createElement('span', ['tooltiptext'], 'Current domain');
            dfav.classList.add('tooltip', 'current-url');
            dfav.appendChild(currentDomTooltip);
            spanUrl.appendChild(dfav);
        }

        var spanVisits = this._createElement('span', ['span-visits', 'tooltip', 'visits'], counter !== undefined ? counter : 0);
        var visitsTooltip = this._createElement('span', ['tooltiptext'], 'Count of visits');

        spanVisits.appendChild(visitsTooltip);

        var spanPercentage = this._createElement('span', ['span-percentage'], _Percentage(summaryTime));
        var spanTime = this._createElement('span', ['span-time']);
        this._getTotalTime(summaryTime, TypeList, spanTime);

        div = this.appendChild(div, [dfav, spanUrl, spanVisits, spanPercentage, spanTime]);
        this._TableSites().appendChild(div);
    }
    _getTotalTime( summaryTime, TypeList, parent ){
        var arr = getArrayTime(summaryTime);
        var f = false;
        var getCssClass = function ( x ){
            if( x>0 ){
                f = true;
                return ['span-active-time'];
            }
            else{
                if( f )
                    return ['span-active-time'];
                return null;
            }
        };
        if( TypeList===TypeListEnum.All ){
            var Days = this._createElement('span', getCssClass(arr.days), arr.days+'d ');
            this.appendChild(parent, [Days]);
        }
        var Hour = this._createElement('span', getCssClass(arr.hours), arr.hours + 'h ');
        var Min = this._createElement('span', getCssClass(arr.mins), arr.mins + 'm ');
        var Sec = this._createElement('span', getCssClass(arr.seconds), arr.seconds + 's ');
        this.appendChild(parent, [Hour, Min, Sec]);
    }
    // createelement for multiple css
    _createElement( type, css, innerText ){
        var el = document.createElement(type);
        if( css!==undefined&&css!==null ){
            for( let i=0; i<css.length; i++ ){
                el.classList.add(css[i]);
            }
        }
        if( innerText!==undefined ){
            el.innerHTML = innerText;
        }
        return el;
    }
    // appenChild for multiple children
    appendChild( el, child ){
        for( let i=0; i<child.length; i++ ){
            el.appendChild(child[i]);
        }
        return el;
    }
}