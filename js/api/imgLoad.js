/*
* 功能:预加载图片
* 作者:陈文琦
* 创建: 2016/7/25
* 调用:$.loadImg({'imgList':['xx','yy'],'url':'http://zzz/'})
* 参数：
*   imgList[Array]:图片名称
*   url[String]:图片目录
*   callEveryOne[Fn]:每张图片加载完成后回调
*   callFinish[Fn]:图片全部加载完后回调
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
    $.extend({
        loadImg:function(o){
            var p = $.extend({
                imgList : o.imgList||[],
                url : o.url||"",
                callEveryOne : o.callEveryOne||"",
                callFinish : o.callFinish||""
            },(typeof o === "object")?o:{});
            var errorImgs = [],per = Math.round(1/p.imgList.length*100),total = 0;
            var loadingFn = function(){
                var img = new Image();
                img.onload = function(){refreshPer(true,img);}
                img.onerror = function(){refreshPer(false,img);}
                img.src=p.url+p.imgList[p.imgList.length-1];
            };
            var refreshPer = function(r,_img){
                total = (total+per > 100)?100:(total+per);
                if(!r){ errorImgs.push(p.imgList[p.imgList.length-1]); }
                if(jQuery.isFunction(p.callEveryOne)){ p.callEveryOne(r,_img.src,total); }          
                setTimeout(function(){ p.imgList.length == 0 ? loadedFn() :loadingFn(); },1000/30);
                p.imgList.pop();
            };
            var loadedFn = function(){
                if(jQuery.isFunction(p.callFinish)){ p.callFinish(errorImgs); }
            }
            loadingFn();
        }
    });
}));