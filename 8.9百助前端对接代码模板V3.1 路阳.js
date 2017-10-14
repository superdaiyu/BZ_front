/***************************************
* Baizhu Front-End Arrangement Template
* Version: Stable V3.1
* By Lucien-X               2017/08/09
 **************************************/
 /*

 对方有技术,且页面模板情况复杂的情况下，让对方技术自己搞定，先发送 接口说明.docx
 之后话术：
 以上是下载器接口说明，请按其中格式编写API。
 下载器下载链接格式为：(前缀)软件名称@渠道号_软件ID.exe,
 前缀的生成算法请参照：http://cdn.tudown.com/script/down.js
 拼装下载器链接的匿名函数示例,调用xzq_URL()就会返回完整的下载器链接:
  var xzq_URL = function() {
      return baizhuPreUrl + xzq_softname + '@' + xzq_channelID + '_' + xzq_softID + '.exe';
  };

 */
/*
  市场需要提供的信息包括：

  渠道号(决定xzq_channelID)
  是否空包(决定xzq_softID逻辑)
  下载页面链接(用于执行并调试代码)
  下载页面截图(用于标明需要上的位置)

  注意：
  1、写完代码后，把文件发给站长替换，标准话术："将刚刚发的代码文件内容，追加进相应下载页面引用的的js文件末尾"；
  如果站长不会上代码，就直接将代码追加好，发给站长替换；

  2、假如站长上代码后，他那边看没有生效，首先可能是浏览器缓存，让站长Ctrl+F5强制刷新；
  如果还无效，在相应文件URL后加问号，带参(get)访问一下，
  如果带参访问的文件内容无误，应该是站长用的cdn服务有缓存，需要推一下；

  3、假如站长使用的是百度SSP服务，统一管理广告位（站长一般称其为“百度管家”），
  可以新建广告物料，选择富媒体，不使用模板，
  将代码第一行前面加上<script>，最后一行后面加上</script>，粘贴进去就可以
  (注意，这一步很重要，不加会造成代码被当做HTML文本写入)；

  4、所有的新站对接，
    a、如果站长要短代码,用于新建广告物料(后台或者百度SSP)，
  代码直接放在http://cdn.tudown.com/script/，sftp为120.26.226.194,
  路径为'/home/wwwroot/script/',原有代码不可删除，为每个新站点单独开文件夹放置代码资源。 
    b、如果要求素材放我们cdn,
  素材直接放在http://cdn.tudown.com/image/，sftp为120.26.226.194,
  路径为'/home/wwwroot/image/',原有素材不可删除，为每个新站点单独开文件夹放置图片资源。

  5、如果直接上死链接，直接打开已经对接的同类站点，将链接复制下来，将软件名称和渠道号修改下发给站长。
  需要注意的是，要将死链接中的中文encode一下，防止链接解析失败，具体方法为在控制台中，使用encodeURI方法，例如：

  encodeURI('http://11872.url.789msw.com/down/教育试题@496_2.exe')
  =>
  "http://11872.url.789msw.com/down/%E6%95%99%E8%82%B2%E8%AF%95%E9%A2%98@496_2.exe"

  6、用a标签onclick属性实现的跳转，移除onclick，用href实现跳转，以保持一致性和可维护性；

  7、对于页面内有全局变量的，例如pc0359,页面内有_downInfo全局变量，需要从全局变量获取

  站点下载页示例：
      有jQuery： http://www.66game.cn/dongzuojiejiyouxixiazai/011978.html
      没有jQuery： http://www.mydigi.net/soft/show.asp?id=39342

  8、假如站长使用的CMS后台，用document.writeln写入广告位置，一次写入好几个不同的模板中，页面上下文环境较复杂，
  可以先document.writeln一个有ID的div占位，
  在之后的回调中，用ID取到元素，将广告物料替换进去，并移除ID防止广告屏蔽；
  eg:
  document.writeln('<div id="BZ_POSITION0"></div>');

  //然后在最内层回调函数内
  (function(){
      if($('#BZ_POSITION0').length==0){
          setTimeout(arguments.callee,800);
      }else{
          xzq_channelID = "407";
          $('#BZ_POSITION0').removeAttr('id').html('<a href="'+xzq_URL()+'" onclick="BZ_webnums_Statistic('+xzq_channelID+')" target="_blank"><img src="http://cdn.tudown.com/image/728*100.gif " alt=" "></a>');
      }
  })();

  注：所有js代码都可以F12(Windows),Command+Alt+I(MacOS)打开控制台，在console中进行调试.
      站点对接时，请打开下载页，直接将修改后的代码拷贝进控制台，回车键后，查看效果

  本模板仅供参考，如果有特殊需求，请百度相应js函数，插入声明部分后，在函数体中调用，谢谢
*/

/********************************
 * 声明withJQ函数
 * 
 * 作用：判断页面内是否有jQuery,有就直接调用callback，没有就加载百度CDN的再调用
 *********************************/
function withJQ(callback) {
    if (typeof jQuery === 'undefined') {
        var cdjs = document.createElement("script");
        var requestHandler = "//apps.bdimg.com/libs/jquery/1.6.4/jquery.min.js";
        cdjs.src = requestHandler;
        cdjs.type = "text/javascript";
        cdjs.onload = cdjs.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                //释放'$'命名空间，防止冲突
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

/********************************
 * 声明withBaizhuPreUrl函数
 *
 * 作用：判断页面内是否有baizhuPreUrl,有就直接调用callback，没有就加载再调用
 *********************************/
function withBaizhuPreUrl(callback) {
    if (typeof baizhuPreUrl === 'undefined') {
        var cdjs = document.createElement("script");
        var requestHandler = "http://cdn.tudown.com/script/down.js";
        // 【可能改】小说电影站,请求不同的代码
        // var requestHandler = "http://cdn.tudown.com/script/mbook.js";
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
/********************************
 * 定义getQueryString函数
 * @param   string           key    键
 * @return  string || null          值
 * 作用：获取页面的get传参中的值
 *********************************/
function getQueryString(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}

/**
 * 点击统计函数,注册到全局作用域,appid为渠道号；
 * 通过模板字符串，或.attr('onclick','BZ_webnums_Statistic("+channelID+"")')方法，直接绑定到a标签onclick属性上；
 */

// 点击统计
;window.BZ_webnums_Statistic=function(channelID){var cdjs=document.createElement("script");var requestHandler='http://data.9xiazaiqi.com/api/webnums?appid='+channelID;cdjs.src=requestHandler;cdjs.type="text/javascript";cdjs.onload=cdjs.onreadystatechange=function(){if(!this.readyState||this.readyState==='loaded'||this.readyState==='complete'){cdjs.onload=cdjs.onreadystatechange=null;document.getElementsByTagName('head')[0].removeChild(cdjs)}};document.getElementsByTagName('head')[0].appendChild(cdjs)};

// 调用函数，按需加载baizhuPreUrl
withBaizhuPreUrl(function() {
    //调用函数，按需加载JQ
    withJQ(function() {
        //DOM加载完毕，开始执行代码，用定时器方法的话不需要这样
        // jQuery(function($) {
            // Just in case,避免命名冲突
            var $=jQuery;

            // 注意观察网页源码，可能软件名和软件id写在了js全局变量里面
            // 【可能改】从meta标签的keywords中，获取软件名，视情况替换split方法中的分隔符
            var keywords = document.getElementsByTagName('meta').keywords||document.getElementsByTagName('meta').Keywords;
            var xzq_softname = keywords.content.split(',')[0];
            //如果没有meta keywords，就从title中获取，视情况替换split方法中的分隔符
            // var xzq_softname = document.title.split('_')[0];

            // 正则表达式，去除软件名中的空格
            xzq_softname = xzq_softname.replace(/&nbsp;/ig, "").replace(/\s/ig, "");

            // 【必改】设置渠道号
            var xzq_channelID = "441";

            // 【可能改】从页面路径中，获取软件ID
            var xzq_softID = window.location.pathname.split('/').pop().split('.')[0];
            // 如果软件ID不为数字，设置为2
            xzq_softID =Math.floor(xzq_softID)==xzq_softID?xzq_softID:2;
            // 如果软件ID存在于get传参中，视情况替换键名
            // var xzq_softID = getQueryString('id');
            // 如果是空包，xzq_softID写死为2，使用下面这一句
            // var xzq_softID = '2';

            //拼装下载器链接的匿名函数
            var xzq_URL = function() {
                return baizhuPreUrl + xzq_softname + '@' + xzq_channelID + '_' + xzq_softID + '.exe';
            };

            (function(){
                //匿名函数延时递归法,arguments.callee是一个指针，指向拥有它的函数
                //一旦元素加载完成，执行脚本，好处是不用等DOM加载完成，坏处是会加重浏览器负担
                if($('img[src$="xiazai2.png"]').length==0){
                    setTimeout(arguments.callee,800);
                }else{
                    $('img[src$="xiazai2.png"]').eq(0).parent().attr('href',xzq_URL());
                }
            })();

            // 【替换链接型】
            /***********************链接替换开始**************************/

            //诱导链接替换
            $('.dxXzdzLeft .dxGsBox').eq(0).find('a').attr('href', xzq_URL());

            //下载链接替换，由于渠道号不同，重新给xzq_channelID赋值
            xzq_channelID = "440";
            $('.dxXzdzLeft .dxGsBox').eq(1).find('a').attr('href', xzq_URL());

            /***********************链接替换结束***************************/

            // 【modify内容型】
            /***********************广告位modify开始***************************/

            // $('.dxXzdzLeft .dxGsBox').eq(0).html('<h1>这是替换后的内容</h1>');
            // $('.dxXzdzLeft .dxGsBox').eq(0).after('<h1>这是在后面插入的内容</h1>');
            // $('.dxXzdzLeft .dxGsBox').eq(0).before('<h1>这是在前面插入的内容</h1>');

            /***********************广告位modify结束***************************/

        // });
    });
});
/*
  附录一

  链接替换中使用的selector，是比较优雅稳定的方法，不容易受到页面改版的影响，
  简单粗暴的做法是，在要替换的链接上，右键审查元素，
  在控制台的Element栏中，选中要修改的a标签，右键，
  copy > copy selector,将复制到的selector字符串，
  逐个按照如下语法进行链接替换:

  $('selector').attr('href',xzq_URL());

  涉及到的具体的用法可以参照
  http://tool.oschina.net/uploads/apidocs/jquery/

  最常用的选择器有：
  '#id' '.class'

  最常用的DOM方法有：
  .find()   过滤选择结果
  .eq()     选择选择结果的某一个（从0计）
  .html()   替换内容

  .prev()   选择上一个节点 
  .next()   选择下一个节点

  .after()  在后面插入
  .before() 在前面插入

  .append() 在内部末尾追加
  .prepend()在内部最前追加
*/

/*
  附录二

  广告内容示例，用于作为modify中，各个DOM操作的参数传入，注意单双引号对字符串解析的影响，
  可先写好html后，由转换工具生成：http://www.css88.com/tool/html2js/

  两按钮：
  '<div style="width:640px;height:60px;text-align:left;text-decoration:none;margin:4px 8px 0 0;padding:0 10px"><a target="_blank" href="'+xzq_URL()+'" style="margin-right:10px;"><img src="http://img3.hackhome.com/hz/gsdownaa.png" onmouseover="this.src=\'http://img3.hackhome.com/hz/downab.png\'" onmouseout="this.src=\'http://img3.hackhome.com/hz/gsdownaa.png\'" style="border:0px;"></a><a target="_blank" href="'+xzq_URL()+'"><img src="http://img3.hackhome.com/hz/downba.png" onmouseover="this.src=\'http://img3.hackhome.com/hz/downbb.png\'" onmouseout="this.src=\'http://img3.hackhome.com/hz/downba.png\'" style="border:0px;"></a></div>'

  三按钮：
  '<a target="_blank" href="'+xzq_URL()+'" style="margin-right:10px;"><img src="http://cdn.tudown.com/image/zhutizhijia/btnset1/lj1.png" onmouseover="this.src=\'http://cdn.tudown.com/image/zhutizhijia/btnset1/lj2.png\'" onmouseout="this.src=\'http://cdn.tudown.com/image/zhutizhijia/btnset1/lj1.png\'" style="border:0px;"></a><a target="_blank" href="'+xzq_URL()+'" style="margin-right:10px;"><img src="http://cdn.tudown.com/image/zhutizhijia/btnset1/dx1.png" onmouseover="this.src=\'http://cdn.tudown.com/image/zhutizhijia/btnset1/dx2.png\'" onmouseout="this.src=\'http://cdn.tudown.com/image/zhutizhijia/btnset1/dx1.png\'" style="border:0px;"></a><a target="_blank" href="'+xzq_URL()+'"><img src="http://cdn.tudown.com/image/zhutizhijia/btnset1/wt1.png" onmouseover="this.src=\'http://cdn.tudown.com/image/zhutizhijia/btnset1/wt2.png\'" onmouseout="this.src=\'http://cdn.tudown.com/image/zhutizhijia/btnset1/wt1.png\'" style="border:0px;"></a>'

  垂直两按钮：
  '<div style="position: relative;width:340px;height:120px;">'+
  ' <a href="'+xzq_URL()+'" target="_blank">'+
  '   <img style="position: absolute;top: 0px;left: 35.5px;" src="http://cdn.tudown.com/image/pcgame/1_2.png" onmouseout=\'this.src="http://cdn.tudown.com/image/pcgame/1_2.png"\' onmouseover=\'this.src="http://cdn.tudown.com/image/pcgame/1_1.png"\'  alt="">'+
  ' </a>'+
  ' <a href="'+xzq_URL()+'" target="_blank">'+
  '   <img style="position: absolute;bottom: 0px;left: 35.5px;" src="http://cdn.tudown.com/image/pcgame/2_2.png" onmouseout=\'this.src="http://cdn.tudown.com/image/pcgame/2_2.png\' onmouseover=\'this.src="http://cdn.tudown.com/image/pcgame/2_1.png"\'  alt="">'+
  ' </a>'+
  '</div>'

  单个静态图片：
  '<a href="'+xzq_URL()+'" target="_blank"><img src="http://cdn.tudown.com/image/7060.la.png" alt="高速下载"></a>'
  
  '<div style="margin-top:10px;"><a href="'+xzq_URL()+'" target="_blank"><img src="http://cdn.tudown.com/image/dyttw/1.gif"></a></div>'

  单个切换图片：
  ' <a href="'+xzq_URL()+'" target="_blank">'+
      ' <img src="http://cdn.tudown.com/image/tonghuadianying/liji_1.png" onmouseout=\'this.src="http://cdn.tudown.com/image/tonghuadianying/liji_1.png"\' onmouseover=\'this.src="http://cdn.tudown.com/image/tonghuadianying/liji_2.png"\'  alt="">'+
  ' </a>'
*/
