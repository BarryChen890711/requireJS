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
        linkAdd:function(_url,callback){
            if(!_url || _url.length==0) return;
            var _container = $(this);
            var fURL,fType,addObj;
            $.each(_url,function(i,_u){
                fURL = _u.split('.'),fType = fURL[fURL.length-1].toLowerCase(),addObj=null;
                if(fType == "css"){
                    addObj = $("<link>").attr({"href":_u,"type":"text/css","rel":"stylesheet"});
                }else{
                    addObj = $("<script>").attr({"src":_u,"type":"text/javascript"});
                }
                _container.append(addObj);
                if(fType=="js"){
                    $.getScript( _u )
                      .done(function( script, textStatus ) {
                        callback(_u,textStatus,script);
                      })
                      .fail(function( jqxhr, settings, exception ) {
                        $.consoleWarn( "无法获取加载资源：'"+_u+"'。" );
                    });
                }
            });         
        },
        addFavorite:function(_tit, _url) {
            return $(this).click(function() {
                var t = jQuery(this);
                var browser = getBrowserVer();
                if(jQuery.browser.msie || browser.ver == '11.0') {
                    window.external.addFavorite(_url, _tit);
                } else if (jQuery.browser.mozilla || jQuery.browser.opera) {
                    t.attr("rel", "sidebar");
                    t.attr("title", _tit);
                    t.attr("href", _url);
                } else {
                    alert("请使用Ctrl+D将本页加入收藏夹！");
                }
            });
        },  
        moveDirection:function(callback){
            $(this).bind("mouseenter",function(e){
                var w = $(this).outerWidth(),h = $(this).outerHeight();
                var x = (e.pageX - $(this)[0].offsetLeft - (w / 2))*((w>h)?(h/w):1);
                var y = (e.pageY - $(this)[0].offsetTop - (h / 2))*((h>w)?(w/h):1);
                var direction = Math.round((Math.atan2(y,x)*(180/Math.PI)+180)/90+3)%4;
                if($.isFunction(callback)) callback("in",direction);
            }); 
            $(this).bind("mouseleave",function(e){
                var w = $(this).outerWidth(),h = $(this).outerHeight();
                var x = (e.pageX - $(this)[0].offsetLeft - (w / 2))*((w>h)?(h/w):1);
                var y = (e.pageY - $(this)[0].offsetTop - (h / 2))*((h>w)?(w/h):1);
                var direction = Math.round((Math.atan2(y,x)*(180/Math.PI)+180)/90+3)%4;
                if($.isFunction(callback)) callback("out",direction);
            });         
        }
    });
    $.extend({
        consoleLog:function(msg){
            if (window["console"]){
                console.log(msg);
            }
        },
        consoleError:function(msg){
            if (window["console"]){
                console.error(msg);
            }
        },
        consoleWarn:function(msg){
            if (window["console"]){
                console.warn(msg);
            }
        },
        diffDate:function(sDate,eDate,callback){
            var d1 = sDate.getTime(),d2 = eDate.getTime(),_d,_h,_m,_s,_diff;
            if(d1<d2){
                var differ = (d2-d1)/1000;
                _d = Math.floor(differ/60/60/24);
                _h = Math.floor(differ/60/60)-(_d*24);
                _m = Math.floor(differ/60)-(_h*60)-(_d*24);
                _s = Math.floor(differ%60%60);
                callback(_d,_h,_m,_s);
            }else{
                if($.isFunction(callback)){
                    callback(-1);
                }
            }           
        },
        audioPlayer:function(o){
            var opts = $.extend({ id:'', src:'', loop:true },(typeof o ==="object")?o:{});
            var audioplayer = document.getElementById(opts.id); 
                if(audioplayer!=null){ 
                document.body.removeChild(audioplayer); 
            }         
            if(opts.src!=""){ 
                if(navigator.userAgent.indexOf("MSIE")>0){          
                    var player = document.createElement('bgsound'); 
                    player.id = opts.id;player.src = opts.src; 
                    player.setAttribute('autostart', 'true'); 
                    if(loop) player.setAttribute('loop', 'infinite'); 
                    document.body.appendChild(player);            
                }else{          
                    var player = document.createElement('audio'); 
                    player.id = opts.id; 
                    player.setAttribute('autoplay','autoplay'); 
                    if(loop){ 
                        player.setAttribute('loop','loop'); 
                    } 
                    document.body.appendChild(player);              
                    if(src.substr(-4)==".mp3"){
                        var mp3 = document.createElement('source'); 
                        mp3.src = opts.src; mp3.type= 'audio/mpeg'; 
                        player.appendChild(mp3);
                    }else if(src.substr(-4)==".ogg"){
                        var ogg = document.createElement('source'); 
                        ogg.src = file['ogg']; ogg.type= 'audio/ogg'; 
                        player.appendChild(ogg); 
                    }
                } 
            }
        },
        getUrlParam : function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return unescape(r[2]); return null;
        },
        isIE6 : (!-[1,]&&!window.XMLHttpRequest),
        getBrowserVer : function(){
            var Sys = {},s,ua = navigator.userAgent.toLowerCase();
            (s=ua.match(/rv:([\d.]+)\) like gecko/))?Sys={'name':'ie','ver':s[1]}:(s=ua.match(/msie ([\d.]+)/))?Sys={'name':'ie','ver':s[1]}:(s=ua.match(/firefox\/([\d.]+)/))?Sys={'name':'firefox','ver':s[1]}:(s=ua.match(/chrome\/([\d.]+)/))?Sys={'name':'chrome','ver':s[1]}:(s=ua.match(/opera.([\d.]+)/))?Sys={'name':'opera','ver':s[1]}:(s=ua.match(/version\/([\d.]+).*safari/))?Sys={'name':'safari','ver':s[1]}:Sys={'name':'unknow','ver':'0'};
            return Sys;
        },
        fixPlaceholder : function(){
            if( !('placeholder' in document.createElement('input')) ){   
            $('input[placeholder],textarea[placeholder]').each(function(){   
              var that = $(this),   
              text= that.attr('placeholder');   
              if(that.val()===""){ that.val(text).addClass('placeholder');  }   
              that.focus(function(){ if(that.val()===text){ that.val("").removeClass('placeholder'); } })
              .blur(function(){ if(that.val()===""){ that.val(text).addClass('placeholder'); } })
              .closest('form').submit(function(){ if(that.val() === text){ that.val(''); } });
            });   
          }   
        }
    });
}));