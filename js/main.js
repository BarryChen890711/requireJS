require.config({
	baseUrl:'js/',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        base: 'api/base', // 基础函数库
        imgLoad: 'api/imgLoad', // 图片预加载组件
        moveSlide: 'api/moveSlide', // 元素跟随鼠标晃动
        runHorse: 'api/runHorse', // 图片轮播组件
        popView: 'api/popView', // 弹窗组件
        highlightNav: 'api/highlightNav' // 导航高亮
    }
//     ,
//      // 非AMD js引入
//     shim: {
//     	'base': ['jquery'],
// 　　　　'runHorse': ['jquery']
// 　　}
});
 
require(['jquery','base','imgLoad','moveSlide','runHorse'], function($,Base,imgLoad,MoveSlide,runHorse) {
    $(function(){
        $.loadImg({
            'imgList':['map-1.jpg','map-2.jpg','map-3.jpg','map-4.jpg'],
            'url':'http://img1.tiancitycdn.com/project5/csol2/event/2016/0817version/images/',
            'callFinish':function(errList){
                if(errList.length==0){
                    alert("图片加载完毕!");
                }else{
                    alert("部分图片("+errList+")加载失败");
                }
                
            }
        });
        var _run = new runHorse("#runBox");
        _run.init({'mode':'slide','dir':'top','speed':1000,'wait':4000,'numBtns':true,'toggleBtns':true});

        //var _run2 = new runHorse("#runBox2");
        //_run2.init({'mode':'fade','speed':600,'wait':2000,'numBtns':true,'toggleBtns':true});
        $.moveSlide();
    });
    
});

// 弹框模块单独调用例子，也可合并到上面一起
require(['jquery','popView'],function($,popView){
    popView.resetPopView({'autoClose':true});
    $("#popBtn").click(function(){
        popView.showPopView('#popView');
    });   
});