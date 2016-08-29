/*
* 功能:轮播组件
* 作者:陈文琦
* 创建: 2016/8/18
* HTML：
*   [ html结构1 ]:
*    <div class="runContainer">
*       <div class="runBox" id="runBox">        
*           <a href="javascript:;" class="map-1"></a>
*           <a href="javascript:;" class="map-2"></a>
*           <a href="javascript:;" class="map-3"></a>
*           <a href="javascript:;" class="map-4"></a>
*       </div>
*    </div>
*    [ html结构2 ]:
*    <div class="runContainer">
*       <ul class="runBox" id="runBox">        
*           <li href="javascript:;" class="map-1"><img></li>
*           <li href="javascript:;" class="map-2"><img></li>
*           <li href="javascript:;" class="map-3"><img></li>
*           <li href="javascript:;" class="map-4"><img></li>
*       </ul>
*    </div>
* 调用:$("#id").runHorse({'mode':'fade','numBtns':false,'toggleBtns':true})
* 参数：
*   mode[String]:切换方式 fade(渐隐) slide(滑动)
*   dir[String]:滑动方向，仅当mode:slide时有效 left向左，top向上
*   speed[Int]:每张图片加载完成后回调
*   numBtns[Bool]:是否显示数字切换按钮
*   toggleBtns[Bool]:是否显示左右切换按钮
*   auto[Bool]:是否自动播放
*   wait[Int]:轮播间隔时间
*   easing[String]:切换动画
*   callBack[Fn]:每次切换之后回调函数
*
*/

define(['jquery'],function($){
    var RunHorse = function(boxID){
        // 用户参数
        this.box = boxID;
        this.mode = 'slide';
        this.dir = 'left';
        this.step = 1;
        this.speed = 1000;
        this.numBtns = false;
        this.toggleBtns = false;
        this.auto = true;
        this.wait = 2000;
        this.easing = 'swing';
        this.callBack = null;

        // 内部参数
        this.items=[];
        this.sum=0;
        this.now=0;
        this.h=true;
        this.prevBtn=null;
        this.nextBtn=null;
        this.numBtn=null;
        this.lightClass="on";
        this.timer=null;
        this.stop=false;
    };
    RunHorse.prototype = {
        init : function(o){
            console.log("init");
            var self = this;
            $.extend(self,(typeof(o)==="object")?o:{});
            self.items = ($(self.box).children()[0].tagName=="UL")?$(self.box).children().children('a'):$(self.box).children();
            self.sum = self.items.length;
            self.h=(self.dir.toUpperCase()=="LEFT"||self.dir.toUpperCase()=="RIGHT")?true:false;
            self.build();
        },
        build : function(){
            var self = this,pB=self.prevBtn,nB=self.nextBtn,st=self.stop,stp=self.step,n=self.now,s=self.sum,it=self.items;
            if(self.toggleBtns){
                pB = $('<a>').attr({'href':'javascript:;','class':'prev'}).html('<');
                nB = $('<a>').attr({'href':'javascript:;','class':'next'}).html('>');
                $(self.box).after(pB).after(nB);
                pB.click(function(){
                    if(!st){ 
                        var c=self.now; 
                        self.now=(((stp==1)?--self.now:(self.now-stp))+s)%s;
                        self.jump(self.now,c); 
                    } 
                });
                nB.click(function(){ 
                    if(!st){ 
                        var c=self.now;
                        self.now=(((stp==1)?++self.now:(self.now+stp))+s)%s;
                        self.jump(self.now,c);
                    }
                });
            }
            if(self.numBtns){
                var btnBox = $('<div>').addClass("runNum");
                for(var j=1;j<=self.sum;j++){
                    btnBox.append($('<a>').attr('href','javascript:;').html(j));
                }
                $(self.box).after(btnBox);
                self.numBtn=btnBox.children();
                self.numBtn.each(function(i,e){ $(e).click(function(){ if(!st){ var c=n;n=i;self.jump(n,c,true); } }); });
            }
            if(self.mode=="fade") { 
                it.each(function(i,e){ 
                    $(e).css({'position':'absolute','left':'0','top':'0'});
                });
                it.eq(0).show().siblings().hide(); 
            }
            else { 
                $(self.box).css('position','relative');
                it.each(function(i,e){
                    if(i==0) $(e).css({'position':'absolute','left':'0','top':'0'});
                    else {
                        if(self.h) $(e).css({'position':'absolute','left':'100%','top':'0'});
                        else $(e).css({'position':'absolute','left':'0','top':'100%'});
                    }
                });
            }

            if(self.lightClass && self.numBtns){self.numBtn.eq(0).addClass(self.lightClass);}
            if(self.auto){
                self.timer=setInterval(self.autoJump,self.wait,self);
                if(self.toggleBtns){self.stopAuto(pB);self.stopAuto(nB);}
                if(self.numBtns){self.stopAuto(self.numBtn);}
                self.stopAuto(it);
            }
        },
        jump : function(_new,_now,_click){
            var self=this,sp=self.speed,it=self.items,m=self.mode,st=self.stop,sum=self.sum,e=self.easing,on=self.lightClass,nB=this.numBtn,h=this.h;
            if(_new==_now) return;
            if(m=="fade"){
                it.eq(_new).fadeIn(sp).siblings().fadeOut(sp);
            }else{
                st=true;
                var obj = {};
                if((_now < _new || (_now == sum-1 && _new == 0 && !_click)) && !(_now == 0 && _new == sum-1 && !_click)){
                    obj[(h?"left":"top")]="100%"; it.eq(_new).css(obj);
                    obj[(h?"left":"top")]="-100%"; it.eq(_now).animate(obj,sp,e);
                    obj[(h?"left":"top")]="0"; it.eq(_new).animate(obj,sp,e,function(){st=false;});
                }else{
                    obj[(h?"left":"top")]="-100%"; it.eq(_new).css(obj);
                    obj[(h?"left":"top")]="100%"; it.eq(_now).animate(obj,sp,e);
                    obj[(h?"left":"top")]="0"; it.eq(_new).animate(obj,sp,e,function(){st=false;});
                }
            }
            self.now = _new;
            if(on&& self.numBtns&&nB.length>_new) nB.eq(_new).addClass(on).siblings().removeClass(on);  
            if($.isFunction(self.callBack)) self.callBack(_new,sum);
        },
        autoJump : function(that){ 
            var self=that,n=self.now,st=self.step,s=self.sum;
            if(!self.stop){ 
                var _cur = self.now; self.now=(((st==1)?++self.now:(self.now+st))+s)%s; self.jump(self.now,_cur);
            }
        },
        stopAuto : function(o){
            var self=this;
            o.hover(function(){
                clearInterval(self.timer);
            },function(){
                self.timer=setInterval(self.autoJump,self.wait,self);
            });
        }
    };
    return RunHorse;
});