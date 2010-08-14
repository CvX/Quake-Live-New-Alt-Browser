scr_meta=<><![CDATA[
// ==UserScript==
// @name         Quake Live New Alt Browser
// @version      0.95
// @namespace    http://userscripts.org/scripts/show/73076
// @description  A new redesign of the Quake Live server browser.
// @author       wn
// @include      http://*.quakelive.com/*
// @exclude      http://*.quakelive.com/forum*
// ==/UserScript==
]]></>.toString();




/* vars from the window */
var $ = unsafeWindow.jQuery,
    quakelive = unsafeWindow.quakelive,
    locdb = unsafeWindow.locdb,
    mapdb = unsafeWindow.mapdb,
    StripColors = unsafeWindow.StripColors,
    ChangeModelSkin = unsafeWindow.ChangeModelSkin,
    GetSkillRankInfo = unsafeWindow.GetSkillRankInfo,
    LaunchGame = unsafeWindow.LaunchGame,
    pluginx = unsafeWindow.pluginx,
    qlPrompt = unsafeWindow.qlPrompt,
    InArray = unsafeWindow.InArray;




/* no jquery == no joy */
if (typeof $ == 'undefined') return;




/*
 * jQuery JSON Plugin version: 2.1 (2009-08-14)
 * This document is licensed as free software under the terms of the MIT License: http://www.opensource.org/licenses/mit-license.php
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that I uphold.
 * It is also influenced heavily by MochiKit's serializeJSON, which is copyrighted 2005 by Bob Ippolito.
 */
(function($){$.toJSON=function(o){if(typeof(JSON)=='object'&&JSON.stringify)return JSON.stringify(o);var type=typeof(o);if(o===null)return"null";if(type=="undefined")return undefined;if(type=="number"||type=="boolean")return o+"";if(type=="string")return $.quoteString(o);if(type=='object'){if(typeof o.toJSON=="function")return $.toJSON(o.toJSON());if(o.constructor===Date){var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+hours+':'+minutes+':'+seconds+'.'+milli+'Z"'}if(o.constructor===Array){var ret=[];for(var i=0;i<o.length;i++)ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]"}var pairs=[];for(var k in o){var name;var type=typeof k;if(type=="number")name='"'+k+'"';else if(type=="string")name=$.quoteString(k);else continue;if(typeof o[k]=="function")continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val)}return"{"+pairs.join(", ")+"}"}};$.evalJSON=function(src){if(typeof(JSON)=='object'&&JSON.parse)return JSON.parse(src);return eval("("+src+")")};$.secureEvalJSON=function(src){if(typeof(JSON)=='object'&&JSON.parse)return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))return eval("("+src+")");else throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string){if(string.match(_escapeable)){return'"'+string.replace(_escapeable,function(a){var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16)})+'"'}return'"'+string+'"'};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'}})(unsafeWindow.jQuery);




/*
 * Cookie plugin
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($){$.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options.expires=-1}var expires='';if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000))}else{date=options.expires}expires='; expires='+date.toUTCString()}var path=options.path?'; path='+(options.path):'';var domain=options.domain?'; domain='+(options.domain):'';var secure=options.secure?'; secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('')}else{var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break}}}return cookieValue}}})(unsafeWindow.jQuery);




/* Greasemonkey stuff */
var GM_ql_alt_bestPickHighlight = GM_getValue("ql_alt_bestPickHighlight", true);
var GM_ql_alt_gametypeIcon = GM_getValue("ql_alt_gametypeIcon", true);
var ql_alt_disableGTI = function(){GM_ql_alt_gametypeIcon=false;$("#qlv_postlogin_matches tbody img.agameicon").each(function(){$(this).replaceWith('<span class="agameicon" src="'+$(this).attr("src")+'">'+$(this).attr("title")+'</span>')})};
var ql_alt_enableGTI = function(){GM_ql_alt_gametypeIcon=true;$("#qlv_postlogin_matches tbody span.agameicon").each(function(){$(this).replaceWith('<img class="agameicon" src="'+$(this).attr("src")+'" title="'+$(this).text()+'" />')})};
GM_registerMenuCommand("QL New Alt Browser: toggle gametype icon", function(){if(GM_getValue("ql_alt_gametypeIcon",true)){GM_setValue("ql_alt_gametypeIcon",false);ql_alt_disableGTI()}else{GM_setValue("ql_alt_gametypeIcon",true);ql_alt_enableGTI()}});
GM_registerMenuCommand("QL New Alt Browser: toggle recommended server highlighting",function(){if(GM_getValue("ql_alt_bestPickHighlight",true)){GM_setValue("ql_alt_bestPickHighlight",false);GM_ql_alt_bestPickHighlight=false;unsafeWindow.jQuery("#qlv_postlogin_matches tbody tr.bestpick").addClass("noHighlight")}else{GM_setValue("ql_alt_bestPickHighlight",true);GM_ql_alt_bestPickHighlight=true;unsafeWindow.jQuery("#qlv_postlogin_matches tbody tr.bestpick").removeClass("noHighlight")}});




/* tablesorter parser */
$.tablesorter.addParser({id: 'players',is: function(s) { return false; }, format: function(s) { var sp = s.split("/"); return parseFloat(sp[0]+"."+(sp[1] << 2)); }, type: 'numeric'});
$.tablesorter.addParser({id: 'rank',is: function(s) { return false; }, format: function(s) { s = s.substr(s.indexOf("rank_")+5,1); return (s == 'u' ? -9 : s); }, type: 'numeric'});




/* tablesorter widget */
$.tablesorter.addWidget({id:"sortPersist",format:function(table){if(table.config.debug){var time=new Date()}var cookieName='ql_alt_browser_sort';var cookie=$.cookie(cookieName);var options={expires:1,path:'/'};var data={};var sortList=table.config.sortList;var tableId=$(table).attr('id');var cookieExists=(typeof(cookie)!="undefined"&&cookie!=null);if(sortList.length>0){if(cookieExists){data=$.evalJSON(cookie)}data[tableId]=sortList;$.cookie(cookieName,$.toJSON(data),options)}else{if(cookieExists){var data=$.evalJSON($.cookie(cookieName));if(typeof(data[tableId])!="undefined"&&data[tableId]!=null){sortList=data[tableId];if(sortList.length>0){$(table).trigger("sorton",[sortList])}}}}if(table.config.debug){$.tablesorter.benchmark("Applying sortPersist widget",time)}}});




/* prototype for a server manager listener */
function aServerManagerListener() {
    aServerManagerListener.prototype.OnRefreshServersSuccess = function () {};
    aServerManagerListener.prototype.OnRefreshServersError = function () {};
    aServerManagerListener.prototype.OnStartRefreshServers = function () {};
    aServerManagerListener.prototype.OnSaveFilterSuccess = function () {};
    aServerManagerListener.prototype.OnSaveFilterError = function () {};
}




/* prototype for the list view */
function aServerListView() {}
var cols = 6, o = {
    target: "ql_alt_browser tbody",
    max: 0,
    group_cache_size: 6
};
aServerListView.prototype = new aServerManagerListener;
aServerListView.prototype.SetDisplayProps = function (d) {
    this.props = $.extend({}, o, d);
};
aServerListView.prototype.GetContainerNodeId = function () {
    return this.props.target;
};
aServerListView.prototype.GetServerNodeId = function (d) {
    return "match_" + d.public_id;
};
aServerListView.prototype.UpdateServerNode = function (d, e) {
    var g = mapdb.getGameTypeByID(d.game_type);
    var k = d.num_clients + "/" + d.max_clients;

    var m = mapdb.getBySysName(d.map.toLowerCase());
    m = m ? m.name : "Unknown";
    
    var l, n, p;
    if (n = locdb.GetByID(d.location_id)) {
        l = n.GetCityState() + (InArray(d.location_id, [14,27,29,30,37,43]) ? " #1" : InArray(d.location_id, [32,33,36,39,42,44]) ? " #2" : InArray(d.location_id, []) ? " #3" : "");
        p = n.GetFlagIcon();
    } else {
        l = "QUAKE LIVE";
        p = "/images/flags3cc/usa.gif";
    }
    var r = GetSkillRankInfo(d.skillDelta);

    e.find(".qlv_inner_line").length == 0 && e.html('<td class="qlv_inner_line"><img class="alocation_flag" src="" /></td>' +
                                                    '<td align="left" class="alocation_text"></td>' +
                                                    '<td align="left"><img src="" class="agameicon" /></td>' +
                                                    '<td align="left"><span class="amapname bold"></span><span class="agamelabel cond"></span></td>' +
                                                    '<td align="left"><img src="" class="agamerank" /> <a href="' + quakelive.siteConfig.baseUrl + '/r/home/join/' + d.public_id + '" onclick="qlPrompt({title: \'Server Link\', body: \'Link to this game\', input: true, inputLabel: $(this).attr(\'href\'), inputReadOnly: true, alert: true}); return false;"><img style="padding: 3px 0" src="http://phob.net/link.png" title="Link to this game" class="link" /></a></td>' +
                                                    '<td align="left" class="aplayers"></td>');
    e.find(".alocation_flag").attr({"src": quakelive.resource(p), "title": n.country || "United States"});
    e.find(".alocation_text").text(l);
    e.find(".agameicon").attr({"src": quakelive.resource("/images/gametypes/sm/" + g.name + ".png"), "title": g.name});
    e.find(".amapname").text(m);
    e.find(".agamelabel").text(" (" + (d.premium ? "Premium " : "") + d.host_name + ")");
    e.find(".agamerank").attr({"src": quakelive.resource((d.g_needpass ? "/images/lgi/server_details_ranked.png" : "/images/sf/login/rank_" + r.delta + ".png")), "title": r.desc.replace(/(<([^>]+)>)/ig, '')}).css({"height": "18px", "width": "18px"});
    e.find(".aplayers").text(k);
    d.ordinal < 3 ? e.addClass("bestpick") : e.removeClass("bestpick");
    if ($("#ql_alt_hide:checked").val() == 'on' && (d.num_clients == 0 || d.max_clients == d.num_clients)) {
        e.hide();
    } else {
        var ql_alt_filters = $.cookie('ql_alt_filters');
        if (ql_alt_filters) {
            ql_alt_filters = ql_alt_filters.split(",");
            if (ql_alt_filters[0] && ql_alt_filters[0].length !== 0) {
                var hm = false, freg;

                for (var i = 0; i < ql_alt_filters.length; i++) {
                    ql_alt_filters[i] = $.trim(ql_alt_filters[i]);
                    if (ql_alt_filters[i].length === 0) continue;
                    freg = new RegExp(ql_alt_filters[i], "i");
                    if (k.substr(k.indexOf("/")) == ql_alt_filters[i] || l.match(freg) || d.host_name.match(freg) || ((d.map.match(freg) || m.match(freg)) && d.num_clients !== 0)) {
                        hm = true;
                        break
                    }
                }
                hm ? e.hide() : e.show();
            } else {
                e.show();
            }
        } else {
            e.show();
        }
	}
    return e;
};
aServerListView.prototype.OnRefreshServersSuccess = function (d) {
    quakelive.SendModuleMessage("OnServerListReload", d);
    this.DisplayServerList(d);
    this.SortServerList(d);
};
aServerListView.prototype.OnRefreshServersError = function () {
    var d = $("#" + this.GetContainerNodeId()).empty();
    d.append('<tr><td colspan="' + cols + '"><p class="tc TwentyPxTxt midGrayTxt" style="width: 70%; margin: 20% auto; color: #f00">We\'ve encountered an error loading the list of games. Please wait and we will try to reload the list.</p></td></tr>');
};
aServerListView.prototype.OnBeforeDisplayServerList = function (d, e) {
    e.length > 0 && $("#qlv_welcome .welcome_matches_header").css("visibility", "visible");
}
aServerListView.prototype.OnAfterDisplayServerList = function (d, e) {
    if (e.length == 0) {
        d.append('<tr><td colspan="' + cols + '"><p class="tc thirtyPxTxt midGrayTxt">No Games Available</p></td></tr>');
        quakelive.siteConfig.realm == "focus" ? d.append('<tr><td colspan="' + cols + '"><p class="tc TwentyPxTxt midGrayTxt">A focus test may not be active at this time.<br />Please check the News Feed for scheduled test times.</p></td></tr>') : d.append('<tr><td colspan="' + cols + '"><p class="tc TwentyPxTxt midGrayTxt">Check Your Customize Settings</p></td></tr>');
    }
}
aServerListView.prototype.OnBeforeUpdateServerNode = function (d, e) {}
aServerListView.prototype.OnRemoveServer = function (d, e) {
    d = $("#" + this.GetServerNodeId(e));
    d.length > 0 && d.remove();
    quakelive.matchtip.HideMatchTooltip(e.public_id);
};
aServerListView.prototype.OnUpdateServer = function (d, e) {
    d = $("#" + this.GetServerNodeId(e));
    if (d.length == 0) {
        d = $('<tr id="' + this.GetServerNodeId(e) + '"></tr>');
        e.node = d;
    }
    this.SetupContextMenu(e, d);
    this.UpdateServerNode(e, d);
};
aServerListView.prototype.DisplayServerList = function (g) {
    var m = $("#" + this.GetContainerNodeId());
    g = g.GetServers();
    m.empty();
    this.OnBeforeDisplayServerList(m, g);
    if (g.length > 0) {
        for (var x = this, p = [], z = 0, t = 0; t < g.length; t += this.props.group_cache_size) {
            for (var o = [], l = 0; l < this.props.group_cache_size && t + l < g.length; l++) {
                var u = g[t + l];
                o[l] = u.public_id;
                p[z] = o
            }
            z++;
        }
        var k = function() {
            $(".contextMenu").destroyContextMenu().hide();
        }
        z = {
            onHover: k,
            onClick: k,
            onDblClick: k,
            target: this.props.target
        };
        o = this.props.max == 0 ? g.length : this.props.max;
        for (t = 0; t < o; ++t) {
            u = g[t];
            z.cachedServerIds = p[parseInt(t / this.props.group_cache_size)];
            quakelive.matchtip.BindMatchTooltip(u.node, u.public_id, z);
            m.append(u.node)
        }
        m = m.find("tr");
        GM_ql_alt_bestPickHighlight ? m.removeClass("noHighlight") : m.addClass("noHighlight");
        GM_ql_alt_gametypeIcon ? ql_alt_enableGTI() : ql_alt_disableGTI();
    }
    this.OnAfterDisplayServerList(m, g)
}
aServerListView.prototype.SortServerList = function (d) {
    d = $("#ql_alt_browser").get(0).config.sortList || [[5,1]];
    if (d[0] && d[0][0] != 5) { d[1] = [5,1]; }
    $("#ql_alt_browser").trigger("update");
    $("#ql_alt_browser").trigger("sorton", [d]);
};
aServerListView.prototype.MatchContextMenuHandler = function (e, g) {
    var k = g.data("info"), module = quakelive.mod_home;
    switch (e) {
    case "copy":
        qlPrompt({
            input: true,
            readonly: true,
            alert: true,
            title: "Link to this match",
            body: "Use the URL below to link to this match directly.",
            inputLabel: quakelive.siteConfig.baseUrl + "/r/home/join/" + k.public_id
        });
        break;
    case "join":
        g.dblclick();
        break;
    case "filter_map":
        module.filter.filters.arena = k.map;
        module.ReloadServerList();
        break;
    case "filter_location":
        module.filter.filters.location = k.location_id;
        module.ReloadServerList();
        break;
    case "filter_gametype":
        module.filter.filters.game_type = k.game_type;
        module.ReloadServerList();
        break;
    case "filter_none":
        break;
    default:
        break
    }
};
aServerListView.prototype.SetupContextMenu = function (d, e) {
    var Q = {
        menu: "serverContext",
        inSpeed: 0,
        outSpeed: 0
    };
    e.data("info", {public_id: d.public_id, map: d.map, location_id: d.location_id, game_type: d.game_type});
    e.contextMenu(Q, this.MatchContextMenuHandler);
};




/* overrides mod_home's ShowContent to change the view type */
quakelive.mod_home.ShowContent = function (v) {
    if (quakelive.IsLoggedIn() && quakelive.userstatus != "ACTIVE") {
        quakelive.Goto("welcome");
    } else {
        quakelive.ShowContent(v);
        if (quakelive.IsLoggedIn()) {
            quakelive.MakeHomeChooser("home");
            v = new aServerListView;
            v.SetDisplayProps({
                target: "ql_alt_browser tbody"
            });
            
            $(".postlogin_nav ul li:last").after("<li id='ql_alt_parameters'>Parameters</li>" +
                                                 "<li id='ql_alt_filters'>Filters</li>" +
                                                 "<li id='ql_alt_demo'>Demo</li>" +
                                                 "<li id='ql_alt_refresh'>Refresh</li>" +
                                                 "<li id='ql_alt_no_full_empty'><label><input type='checkbox' id='ql_alt_hide' " + $.cookie('ql_alt_hide') + ">&nbsp;Hide full/empty</label></li>");

            $("#ql_alt_parameters").click(ql_alt_parameters);
            $("#ql_alt_filters").click(ql_alt_filters);
            $("#ql_alt_demo").click(ql_alt_demo);
            $("#ql_alt_refresh").click(quakelive.mod_home.ReloadServerList).attr("title", "Shift + R");
            $("#ql_alt_hide").change(ql_alt_hide);
            
            $("#qlv_postlogin_matches").append("<table border='0' id='ql_alt_browser'>" +
                                               "<tbody></tbody>" +
                                               "<thead><tr>" +
                                               "<th>&nbsp;</th>" +
                                               "<th>Location</th>" +
                                               "<th>Mode&nbsp;</th>" +
                                               "<th>Map</th>" +
                                               "<th>Skill</th>" +
                                               "<th>Players&nbsp;</th>" +
                                               "</tr></thead>" +
                                               "</table>");
            $("#ql_alt_browser").find("tbody")
                                .append("<tr><td><img class='alocation_flag' src='a.gif' /></td><td class='alocation_text'>a</td><td><img src='a.gif' class='agameicon' /></td><td><span class='amapname'>qzdm1</span><span class='agamelabel'>a</span></td><td><img src='#' class='agamerank' /><img src='http://phob.net/link.png' /></td><td class='aplayers'>0/128</td></tr>")
                                .end()
                                .tablesorter({debug: false, sortList: ($.evalJSON($.cookie('ql_alt_browser_sort')) || [[5,1]]), headers: {4: {sorter: 'rank'}, 5: {sorter: 'players'}}, widgets: ['zebra','sortPersist']})
                                .bind("sortEnd",function(){ $(".contextMenu").destroyContextMenu().hide(); quakelive.HideTooltip(); })
                                .find("tbody")
                                .empty();
            quakelive.serverManager.listener = v;
            quakelive.params.showgamesettings && quakelive.mod_prefs.ShowOverlay();
            quakelive.mod_home.InitFilters();
            quakelive.mod_home.ReloadServerList();
        } else {
            var q=$("#home_carousel");if(q.length>0){for(var c=q.find("li").length,v=[],r=[],A=0;A<c;++A){v.push(".carousel_item_"+A);r.push('<span class="carousel_nav_item carousel_item_'+A+(A==0?" carousel_nav_selitem":"")+'">'+(A+1)+"</span> ")}r.push('<div class="cl"><div>');$("#home_carousel_nav .inner").html(r.join(""));q.jCarouselLite({auto:15E3,speed:500,visible:1,circluar:true,btnGo:v,afterEnd:function(G,H){var E=(H-1)%c;$(".carousel_nav_selitem").removeClass("carousel_nav_selitem");$(".carousel_item_"+E).addClass("carousel_nav_selitem")},beforeStart:function(){}})}
        }
    }
};




/* overrides matchtip's BindMatchTooltip to use hoverIntent */
quakelive.matchtip.BindMatchTooltip = function (b, k, e) {
    e = $.extend({
        onHover: null,
        onHoverOff: null,
        onClick: null,
        onDblClick: null,
        targetContext: null
    }, e);
    this.target = e.target;
    b.unbind("hover");
    b.unbind("click");
    b.unbind("dblclick");
    e.node = b;
    e.public_id = k;
    var g = this;
    b.click(function () {
        e.onClick && e.onClick(b, k);
        if (e.targetContext) g.activeContext = e.targetContext;
        g.OnClickMatchTooltip(b, k, e);
        return false
    });
    b.dblclick(function () {
        e.onDblClick && e.onDblClick(b, k);
        if (e.targetContext) g.activeContext = e.targetContext;
        return g.OnDblClickMatchTooltip(b, k)
    });
    b.hoverIntent(function () {
        if (!(g.pinnedServer && k == g.pinnedServer.public_id && (g.hoverNode == null || b == g.hoverNode))) {
            e.onHover && e.onHover(b, k);
            if (e.targetContext) g.activeContext = e.targetContext;
            g.UnPinMatchTooltip();
            g.OnHoverMatchTooltip(b, k, e.cachedServerIds)
        }
    }, function () {
        if (!g.pinnedServer) {
            e.onHoverOff && e.onHoverOff(b, k);
            g.HideMatchTooltip(k);
            g.activeContext = null
        }
    })
};




/* overrides matchtip's GetTooltipOffset and DisplayMatchPlayers to display match list tips on the right, friends list tips on the left */
quakelive.matchtip.GetTooltipOffset=function(e,g,k){var d=e,l={},n={left:$(document).scrollLeft(),top:$(document).scrollTop(),right:$(document).scrollLeft()+$("body").width(),bottom:$(document).scrollTop()+$("body").height(),width:$("body").width(),height:$("body").height()};e=this.GetDimensions(e);e={left:e.left,top:e.top,right:e.left+e.innerWidth,bottom:e.top+e.innerHeight,width:e.innerWidth,height:e.innerHeight};var q={width:g.innerWidth(),height:g.innerHeight()},u=23,B=2,x=120,p=28,z=28;if(!/^match_\d+$/.test(d.attr('id'))){l.left=e.left-q.width-u+4;l.arrowDirection="right";l.arrowLeft=e.left-u;g.orientation="left";g.addClass("lefto")}else{l.left=e.left+e.width+u;l.arrowDirection="left";l.arrowLeft=e.right+B;g.orientation="right";g.removeClass("lefto")}l.arrowTop=e.top+e.height/2-x/2;if(l.arrowTop<n.top){g=n.top-l.arrowTop;if(g>e.height/2)g=e.height/2;l.arrowTop+=g}l.top=l.arrowTop-(q.height-p-z)/3;if(l.top+q.height>n.bottom)l.top-=l.top+q.height-n.bottom;l.arrowLeft-=l.left;l.arrowTop=l.arrowTop-l.top-p;return l};
quakelive.matchtip.DisplayMatchPlayers=function(e){var d={Free:0,Red:1,Blue:2,Spec:3};var g=$("#lgi_tip"),k=$("#lgi_cli");if(k.length==0){k=$("<div id='lgi_cli'><div id='lgi_cli_top'><div class='lgi_headcol_1'>Player Name</div><div class='lgi_headcol_2'>Score</div></div><div id='lgi_cli_fill'><div id='lgi_cli_content'></div></div><div id='lgi_cli_bot'></div></div>");k.appendTo("body")}var l=k.find("#lgi_cli_content");l.empty();if(e.players.length>0)for(var n=0;n<e.players.length;++n){var q=e.players[n],u,B,x,p,z;p=n%2==0?"lgi_med lgi_cli_row_1":"lgi_med lgi_cli_row_2";if(q.friend)p+=" lgi_is_friend";else if(q.blocked)p+=" lgi_is_blocked";u=q.clan?StripColors(q.clan)+" ":"";B=StripColors(q.name);u+=B;if(q.bot){u+=" <i>(Bot)</i>";p+=" lgi_is_bot"}x=q.team==d.Spec?"SPEC":q.score;if(q.model){var K=q.model.toLowerCase().split("/");z=K[0]+"_";z+=K[1]?K[1]:"default"}else z="sarge_default";if(q.team==d.Red)z=ChangeModelSkin(z,"red");else if(q.team==d.Blue)z=ChangeModelSkin(z,"blue");K="<a href='javascript:;' onclick='quakelive.Goto(\"profile/summary/"+StripColors(q.name)+"\"); return false'>";B=quakelive.mod_friends.IsBlocked(B)?"<img src='"+quakelive.resource("/images/players/icon_gray_sm/"+z+".png")+"' class='lgi_bordercolor_"+q.team+"' width='18' height='18' />":"<img src='"+quakelive.resource("/images/players/icon_sm/"+z+".png")+"' class='lgi_bordercolor_"+q.team+"' width='18' height='18' />";u=u;if(!q.bot){B=K+B+"</a>";u=K+u+"</a>"}l.append("<div class='"+p+"'><div class='lgi_cli_col_1'>"+B+"<span>"+u+"</span><div class='cl'></div></div><div class='lgi_cli_col_2'>"+x+"</div></div>")}else l.append("<center>No Players in Game</center>");e=this.GetDimensions(g);e={left:e.left,top:e.top,right:e.left+e.innerWidth,bottom:e.top+e.innerHeight,width:e.innerWidth,height:e.innerHeight};l={width:o};if(g.hasClass("lefto")){l.left=e.left-k.width()+8;}else{l.left=e.right}l.top=e.top;k.css("left",l.left+"px");k.css("top",l.top+"px");k.show()};




/* features */
function aLaunchGameParams(a){a=$.extend({isBotGame:false,isTraining:false,password:null,hasFullscreen:false},a);this.isBotGame=a.isBotGame;this.isTraining=a.isTraining;this.password=a.password;this.hasFullscreen=quakelive.cvars.GetIntegerValue("r_fullscreen",0)!=0;this.cmdStrings=[]}aLaunchGameParams.prototype.Append=function(a){this.cmdStrings.push(a)};aLaunchGameParams.prototype.Prepend=function(a){this.cmdStrings.shift(a)};aLaunchGameParams.prototype.GetCommandLine=function(){var a=quakelive.cvars.Get("model");quakelive.cvars.Set("headmodel",a.value);quakelive.cvars.Set("team_model",a.value);quakelive.cvars.Set("team_headmodel",a.value);quakelive.cfgUpdater.StoreConfig(quakelive.cfgUpdater.CFG_BIT_REP);a="";if(quakelive.siteConfig.premiumStatus=="standard"&&!this.isTraining)a+="+set in_nograb 1 ";a+="+set r_fullscreen "+quakelive.cvars.GetIntegerValue("r_fullscreen",0)+" ";a+='+set gt_user "'+pluginx.username+'" ';a+='+set gt_pass "'+pluginx.password+'" ';a+='+set gt_realm "'+quakelive.siteConfig.realm+'" ';if(typeof this.password=="string")a+='+set password "'+this.password+'" ';a+=this.cmdStrings.join(" ");return a}
var ql_alt_parameters=function(){qlPrompt({title:"Parameters",body:"Enter custom parameters to start QL (e.g. +exec mycfg.cfg +devmap qzdm1).",input:true,inputLabel:$.cookie("ql_alt_parameters"),inputReadOnly:false,alert:false,ok:function(){var ql_alt_parameters=$("#modal-input > input").val();$.cookie("ql_alt_parameters",ql_alt_parameters,{expires:1,path:'/'});$("#prompt").jqmHide();if(ql_alt_parameters){var k=new aLaunchGameParams;k.Append(ql_alt_parameters);LaunchGame(k)}}});return false}
var ql_alt_filters=function(){qlPrompt({title:"Filters",body:"Enter your filters separated by commas.  Possible values:\n<ul><li><b>Location:</b> \"New York\" or \"Warsaw #2\"</li><li><b>Full or short map name:</b> \"Campgrounds\" or \"qzdm6\"</li><li><b>Full game mode name:</b> \"Free For All\", \"Large Clan Arena\", etc.</li><li><b>Server slot size:</b> \"/16\"</li><li><b>Combined:</b> \"New York, Warsaw #2, qzdm6, Free For All, Large Clan Arena, /16\"</ul>",input:true,inputLabel:$.cookie("ql_alt_filters"),inputReadOnly:false,alert:false,ok:function(){var ql_alt_filters=$("#modal-input > input").val(),tmp=$.cookie("ql_alt_filters");$("#prompt").jqmHide();$.cookie("ql_alt_filters",ql_alt_filters.toLowerCase(),{expires:30,path:'/'});if(tmp!=ql_alt_filters)quakelive.mod_home.ReloadServerList()}});return false}
var ql_alt_demo=function(){qlPrompt({title:"Demo",body:"Enter a demo name to play.  \"demo.cfg\" will automatically be executed, if it exists.",input:true,inputLabel:$.cookie('ql_alt_demo'),inputReadOnly:false,alert:false,ok:function(){var ql_alt_demo=$('#modal-input > input').val();$("#prompt").jqmHide();$.cookie('ql_alt_demo',ql_alt_demo,{expires:1,path:'/'});if(ql_alt_demo){var k=new aLaunchGameParams;k.Append("+exec demo.cfg +demo \""+ql_alt_demo+"\"");LaunchGame(k)}}});return false}
var ql_alt_hide=function(){$.cookie('ql_alt_hide',$('#ql_alt_hide').val() == 'on' ? 'checked' : '',{expires:1,path:'/'});quakelive.mod_home.ReloadServerList();return false;}



/* keyboard shortcuts */
$(document).keypress( function (e) { if (e.which == 82 && quakelive.activeModule.TITLE == "Home") { quakelive.mod_home.ReloadServerList(); }}); // shift+R



/* styling */
var css = ".postlogin_nav ul li { font-weight:bold; } \n" +
          "th { padding: 6px 0; cursor: pointer; } \n" +
          "#qlv_postlogin_matches p { background: transparent; } \n" +
          "#ql_alt_browser { width: " + (screen.width < 1280 ? screen.width < 1024 ? "52%" : "85%" : "100%") + "; color: black; background-color: rgba(255, 255, 255, 0.4); } \n" +
          "#ql_alt_browser thead tr { background: url('" + quakelive.resource('/images/postlogin_navbar/nav_bar.png') + "') -10px 0px } \n" +
          "#ql_alt_browser thead th { color: white; font-weight: bold; } \n" +
          "#ql_alt_browser thead th, .bestpick { text-shadow: 1px 1px 5px #f00; filter: dropshadow(color=#f00, offx=1, offy=1); } \n" +
          ".noHighlight { text-shadow: none; filter: none; } \n" +
          ".alocation_flag { width: 16px; height: 11px } \n" +
          ".agameicon { padding: 1px 0 } \n" +
          ".agameicon span { display: none; } \n" +
          ".alocation_text, .agameicon, .amapname, .agamelabel, .aplayers { cursor: default; } \n" +
          ".header, .headerSortUp, .headerSortDown { background: transparent; font-size: 100%; } \n" +
          ".normalZebraOff,.blueZebraOff,.redZebraOff,.normalZebraOn,.blueZebraOn,.redZebraOn,.teamZebraOff,.teamZebraOn { background-image: none; } \n" +
          ".odd, .normalZebraOn { background-color: rgba(204, 204, 204, 0.35); } \n" +
          ".odd:hover, .normalZebraOn:hover { background-color: rgba(219, 219, 219, 1); } \n" +
          ".even, .normalZebraOff { background-color: rgba(255, 255, 255, 0.35); } \n" +
          ".even:hover, .normalZebraOff:hover { background-color: rgba(235, 235, 235, 1); } \n" +
          ".link { cursor: pointer; } \n" +
          ".cond { letter-spacing: -1px; } \n" +
          ".bold { font-weight: 600; }";
GM_addStyle(css);




aaus_38017={i:'73076',d:1,n:/\/\/\s*@name\s+(.*)\s*\n/i.exec(scr_meta)[1],v:/\/\/\s*@version\s+(.*)\s*\n/i.exec(scr_meta)[1].replace(/\./g, ''),t:new Date().getTime()|0,ca:function(r){GM_xmlhttpRequest({method:'GET',url:'https://userscripts.org/scripts/source/'+this.i+'.meta.js',onload:function(x){aaus_38017.co(x,r)}})},co:function(x,r){this.xv=/\/\/\s*@version\s+(.*)\s*\n/i.exec(x.responseText);this.xn=/\/\/\s*@name\s+(.*)\s*\n/i.exec(x.responseText);if(this.xv&&this.xn[1]==this.n){this.xv=this.xv[1].replace(/\./g, '');this.xn=this.xn[1];}else{if(x.responseText.match("the page you requested doesn't exist")||this.xn[1]!=this.n)GM_setValue('updated', 'off');return false;}if(this.xv>this.v&&confirm('A new version of the '+this.xn+' user script is available. Do you want to update?')){GM_setValue('updated',this.t);GM_openInTab('http://userscripts.org/scripts/source/'+this.i+'.user.js')}else if(this.xv&&this.xv>this.v){if(confirm('Do you want to turn off auto updating for this script?')){GM_setValue('updated','off');GM_registerMenuCommand("Auto Update "+this.n,function(){GM_setValue('updated',new Date().getTime()|0);aaus_38017.ca(true)});alert('Automatic updates can be re-enabled for this script from the User Script Commands submenu.')}else{GM_setValue('updated',this.t)}}else{if(r)alert('No updates available for '+this.n);GM_setValue('updated',this.t)}},ch:function(){if(GM_getValue('updated',0)==0)GM_setValue('updated',this.t);if(GM_getValue('updated',0)!='off'&&+this.t>+GM_getValue('updated',0)+86400000*this.d){this.ca()}else if(GM_getValue('updated',0)=='off'){GM_registerMenuCommand("Enable "+this.n+" updates",function(){GM_setValue('updated',new Date().getTime()|0);aaus_38017.ca(true)})}else{GM_registerMenuCommand("QL New Alt Browser: check for updates",function(){GM_setValue('updated',new Date().getTime()|0);aaus_38017.ca(true)})}}};if(self.location==top.location&&typeof GM_xmlhttpRequest!='undefined')aaus_38017.ch();