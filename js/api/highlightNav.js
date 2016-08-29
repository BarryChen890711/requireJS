/*
* 功能:自动切换、高亮导航栏
* 作者:陈文琦
* 创建: 2016/7/25
* HTML:
*   [ html结构1 ]:
*   <body id="s0">
*       <div id="s1"></div>
*       <div id="s2"></div>
*       <div id="s3"></div>
*       <ul class="navList">
*           <li class="on"><a href="javascript:;" link="s1"></a></li>
*           <li><a href="javascript:;" link="s2"></a></li>
*           <li><a href="javascript:;" link="s3"></a></li>
*           <li><a href="javascript:;" link="s0">top</a></li>       
*       </ul>
*   </body>
*   [ html结构2 ]:
*   <body id="s0">
*       <div id="s1"></div>
*       <div id="s2"></div>
*       <div id="s3"></div>
*       <div class="navList">
*           <a href="javascript:;" link="s1"></a>
*           <a href="javascript:;" link="s2"></a>
*           <a href="javascript:;" link="s3"></a>
*           <a href="javascript:;" link="s0">top</a>    
*       </div>
*   </body>
* 调用:
*   $(".navList").highlightNav({selClass:"on",diff:400,mTop:50});
* 参数:
*   selClass[String]:"on" // 高亮样式
*   diff[Int]:400 // 滚动时，离顶部多少距离时触发切换
*   mTop[Int]:0 // 页面顶部预留高度
*   show[Int]:0 // 页面滚动，超过此高度才显示导航，如0，则始终显示
*
*/
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.extend({
        highlightNav:function(options){
            var o = $.extend({
                selClass:"on",
                diff:400,
                mTop:40,
                show:0
            },(typeof options === "object")?options:{});

            var self = $(this),
                allAList = self.find("a[link]").jQuerytoArray().reverse(), // all <a> 
                aList = self.find("a[link][link!='top'][link!='TOP']").jQuerytoArray().reverse(); // <a> list (without 'top')

            function touchBottom(n){
                return n >= $(document).height()-$(window).height() ? true : false;
            }

            function lightBtn(dom){
                dom.addClass(o.selClass).siblings().removeClass(o.selClass);
            }

            function changeSel(){
                var _li = null,flag=0;
                if(touchBottom($(document).scrollTop())) {
                    _li = ($(aList[0]).parent()[0].tagName == "LI" ) ? $(aList[0]).parent() : null;
                    lightBtn((_li==null)?$(aList[0]):_li);
                    flag++;
                }else{
                    $.each(aList,function(i,aDom){
                        var _link = $(aDom).attr('link');
                        if(_link.toUpperCase()!="TOP"){
                            var _t = $("#"+_link)[0].getBoundingClientRect().top;
                            if(_t <= o.diff){
                                _li = ($(aList[i]).parent()[0].tagName == "LI" ) ? $(aList[i]).parent() : null;
                                lightBtn((_li==null)?$(aList[i]):_li);
                                flag++;
                                return false;
                            }
                        }                       
                    });
                }
                if(flag==0) lightBtn($(aList[aList.length-1]));
            }

            function init(){
                // 为top按钮绑定事件
                $.each(allAList,function(i,obj){
                    if($(obj).attr("link").toUpperCase()=="TOP"){
                        $(obj).click(function(){
                            $('html,body').animate({scrollTop: 0}, 500);
                        });
                    }
                });

                // 页面初始化时，改变选中项及判断是否显示菜单
                changeSel();
                if(o.show==0 || $(window).scrollTop() >= o.show) $(".nav1").fadeIn();
                else $(".nav1").fadeOut();
                // 超过指定高度，显示菜单。不足则隐藏
                $(window).scroll(function(){
                    if(o.show==0 || $(window).scrollTop() >= o.show) $(".nav1").fadeIn();
                    else $(".nav1").fadeOut();
                    changeSel();
                });

                // 为每个跳转按钮绑定事件
                $.each(aList,function(){
                    $(this).click(function(){
                        $('html,body').animate({scrollTop: $('#'+$(this).attr("link")).offset().top-o.mTop}, 500);
                    });
                });         
            }   

            // 初始化组件
            init();     
        }
    });
}));