/***************************************
 * baizhu_xzq   
 * v.256.com
 * By Daiyu              2017/08/08
 **************************************/
 // 预留一个位置
 document.writeln('<div id="BZ_POSITION0"></div>');
function withJQ(callback) {
    if (typeof jQuery === 'undefined') {
        var cdjs = document.createElement("script");
        var requestHandler = "//apps.bdimg.com/libs/jquery/1.6.4/jquery.min.js";
        cdjs.src = requestHandler;
        cdjs.type = "text/javascript";
        cdjs.onload = cdjs.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                jQuery.noConflict();
                if (callback && typeof callback === "function") {
                    callback();
                }
                cdjs.onload = cdjs.onreadystatechange = null;
            }
        };
        document.getElementsByTagName('head')[0].appendChild(cdjs);
    } else {
        callback();
    }
}

function withBaizhuPreUrl(callback) {
    if (typeof baizhuPreUrl === 'undefined') {
        var cdjs = document.createElement("script");
        var requestHandler = "http://www.tudown.com/script/down.js";
        cdjs.src = requestHandler;
        cdjs.type = "text/javascript";
        cdjs.onload = cdjs.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                if (callback && typeof callback === "function") {
                    callback();
                }
                cdjs.onload = cdjs.onreadystatechange = null;
            }
        };
        document.getElementsByTagName('head')[0].appendChild(cdjs);
    } else {
        callback();
    }
}
/**
 * 点击统计函数,注册到全局作用域,appid为渠道号
 */
// JQ版本
;window.BZ_webnums_Statistic=function(channelID){$.ajax({url:'http://data.goosai.com/api/webnums',type:'GET',dataType:'jsonp',data:{appid:channelID}})};

// 点击统计无JQ版本就是一些老的版本
;window.BZ_webnums_Statistic=function(channelID){var cdjs=document.createElement("script");var requestHandler='http://data.goosai.com/api/webnums?appid='+channelID;cdjs.src=requestHandler;cdjs.type="text/javascript";cdjs.onload=cdjs.onreadystatechange=function(){if(!this.readyState||this.readyState==='loaded'||this.readyState==='complete'){cdjs.onload=cdjs.onreadystatechange=null;document.getElementsByTagName('head')[0].removeChild(cdjs)}};document.getElementsByTagName('head')[0].appendChild(cdjs)};

withBaizhuPreUrl(function() {
    withJQ(function() {
            var $=jQuery;
            var keywords = document.getElementsByTagName('meta').keywords||document.getElementsByTagName('meta').Keywords;
            var xzq_softname = keywords.content.split(',')[0];
            xzq_softname = xzq_softname.replace(/&nbsp;/ig, "").replace(/\s/ig, "");
            
            var xzq_channelID = "385";

            // var xzq_softID = window.pageConfig.id;
            var xzq_softID='';
            var xzq_softID='2';

            var xzq_URL = function() {
                return baizhuPreUrl + xzq_softname + '@' + xzq_channelID + '_' + xzq_softID + '.exe';
            };
            //替换链接1
            $('.detail-info .detail-sponsor').html(
                ' <a onclick="BZ_webnums_Statistic('+xzq_channelID+')" href="' + xzq_URL() + '" target="_blank">' +
                ' <img src="http://cdn.tudown.com/image/bddyy/bddyy.gif" alt="">' +
                ' </a>'
            );

            (function(){
                if($('.gi_m .g_btn_pc').length==0){
                    setTimeout(arguments.callee,800);
                }else{
                    
                    xzq_channelID = "407";
                    $('#BZ_POSITION0').removeAttr('id').html('<a href="'+xzq_URL()+'" onclick="BZ_webnums_Statistic('+xzq_channelID+')" target="_blank "><img src="http://cdn.tudown.com/image/728*100.gif " alt=" "></a>');

                    $('.gi_m .g_btn_pc').eq(0).attr('href',xzq_URL()).attr('onclick','BZ_webnums_Statistic('+xzq_channelID+')');
                }
            })();


    });
});