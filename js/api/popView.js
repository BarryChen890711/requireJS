/*
* 功能:弹窗组件
* 作者:陈文琦
* 创建: 2016/7/25
* 调用:popView.showPopView("#id")
* 参数：
*   bgId[String]:遮罩层ID
*   bgColor[String]:遮罩层颜色代码
*   opacity[Float]:透明度
*   fix[Bool]:是否固定在页面中间
*   closeBtn[String]:关闭按钮
*   autoClose[Bool]:是否允许点击遮罩层关闭弹窗
*
*/
define(['jquery','base'],function($) {
    var Popup = function(){
        this.bgId = "#popupMasker";
        this.bgColor = "#000";
        this.opacity = 0.6;
        this.fix = true;
        this.closeBtn = '.closeBtn';
        this.autoClose = false;
    };
    Popup.prototype = {
        init : function(o){
            $.extend(this,(typeof(o)==="object")?o:{});
        },
        reset : function(o){
            this.bgId = "#popupMasker";
            this.bgColor = "#000";
            this.opacity = 0.6;
            this.fix = true;
            this.closeBtn = '.closeBtn';
            this.autoClose = false;
        },
        show : function(o){
            var self = this;
            if(self.closeBtn && $(o).find(self.closeBtn).length>=0){
                $(o).find(self.closeBtn).click(function(){self.hide(o);});
            }
            $(o).css({
                'position':($.isIE6==true||this.fix==false)?'absolute':'fixed',
                'top':'50%',
                'left':'50%',
                'z-index':9999,
                'margin-left':-($(o).outerWidth()/2)+'px',
                'margin-top':-($(o).outerHeight()/2)+'px'
            });
            if($.isIE6){
                var c = $(window).scrollTop();
                if ($("body")[0].scrollHeight>c) {
                    $(o).css({"margin-top": parseInt(c - $(o).outerHeight() / 2) + "px","top": '50%'});
                };
                $(window).scroll(function(){
                    c = $(window).scrollTop();
                    if ($("body")[0].scrollHeight>c) {
                        $(o).css({"margin-top": parseInt(c - $(o).outerHeight() / 2) + "px","top": '50%'});
                    };
                });
            }
            var bgObj = ($(this.bgId).length==0) ? $('<div></div>').attr('id',this.bgId.substr(1)) : $(this.bgId);
            bgObj.css({
                "display":"none",
                "width":"100%",
                "height":$(document).height()+"px",
                "position":"fixed",
                "left":"0",
                "top":"0",
                "z-index":"9998",
                "background":this.bgColor,
                "opacity":this.opacity,
                "-webkit-opacity":this.opacity,
                "-moz-opacity":this.opacity,
                "filter":"alpha(opacity="+(this.opacity*100)+")",
                "_top":"(document.compatMode && document.compatMode=='CSS1Compat') ? document.documentElement.scrollTop : document.body.scrollTop"
            });
            if($.isIE6){
                bgObj.css({ "position":"absolute" });
            }
            $('body').append(bgObj);
            if(self.autoClose){
                $(self.bgId).click(function(){self.hide(o);});
            }   
            $(self.bgId).fadeIn(200);
            $(o).fadeIn(200);
        },
        hide : function(o){
            $(this.bgId).remove();
            $(o).fadeOut(200);
        }
    };
    var popupManager = new Popup();
    return {
        resetPopView : function(o){
            if(typeof(popupManager) == "undefined"){
                popupManager = new Popup();
            }
            popupManager.init(o);
        },
        showPopView:function(o){
            if(typeof(popupManager) == "undefined"){
                popupManager = new Popup();
            }
            if($(o).length>0){
                popupManager.show(o);
            }else{
                $.consoleWarn("'"+o+"'不存在！");
            }
        },
        hidePopView:function(o){
            if($(o).length>0){
                popupManager.hide(o);
            }
        }
    };
});