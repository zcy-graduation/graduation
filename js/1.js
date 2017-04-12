/**
 * Created by Administrator on 2017/4/12.
 */
$.fn.extend({
    mouseWheel:function (up,down) {
        this.each(function (index,val) {
            val.addEventListener('DOMMouseScroll',fun,false);
            val.addEventListener('mousewheel',fun,false);
            function fun(e) {
                let nub=e.wheelDelta||e.detail;
                e.preventDefault();
                if(nub==120||nub==-3){
                    down.call(val)
                }
                if(nub==-120||nub==3){
                    up.call(val)
                }
            }
        });
        return this
    }
});
let aa=40;
$(document).ready(function () {
    $('body').mouseWheel(function () {
        aa=aa-20;
        console.log(1);
        $('.box').css('transform',`translateZ(${aa}px)`)
    },function () {
        aa=aa+20;
        console.log(2);
        $('.box').css('transform',`translateZ(${aa}px)`)
    });

    document.onmousedown=function (e) {
        let x=e.clientX;
        let y=e.clientY;
        document.onmousemove=function (e) {
            let x1=e.clientX;
            let y1=e.clientY;
            let xx=(x1-x)+`px`;
            let yy=(y1-y)+`px`;
            $('body').css('perspective-origin',{xx,yy})
            // console.log($('body').css('perspective-origin',"xx yy"))
        }
    }
});
