/*
* 功能:元素跟随鼠标晃动
* 作者:陈文琦
* 创建: 2016/7/25
* 调用:$.moveSlide();
* 说明：
    *   需要晃动的页面元素必须添加"slide-mode"属性,例:<div data-slide-mode="2" data-slide-step="50"></div>
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
        moveSlide:function(){
            var objs = $('[data-slide-mode]');
            $.each(objs,function(i,e){
                $(e).data("move-left", parseInt($(e).css("left").match(/^-?\d*/)[0])),
                $(e).data("move-top", parseInt($(e).css("top").match(/^-?\d*/)[0]));
            }),$(document).mousemove(function(e) {
                var $e = e || event,
                    $eX = $e.clientX,
                    $eY = $e.clientY;
                    $.each(objs,function(i,e){
                        var m = $(e).data('slide-mode'),
                            s = $(e).data('slide-step');
                        if(m==0){
                            $(e).css("left", $eX / s + $(e).data("move-left"));
                        }else if(m==1){
                            $(e).css("top", $eY / s + $(e).data("move-top"));
                        }else{
                            $(e).css("left", $eX / s + $(e).data("move-left"));
                            $(e).css("top", $eY / s + $(e).data("move-top"));
                        }
                    });

            });
        }
    });
}));