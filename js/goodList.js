var isSpread = true;

//鼠标移动到商品是出现的div动态加载开始
//商品品牌栏的缩放开始
$(".find_more").click(function() {
		if(isSpread) {
			$(".option_box").removeClass("unspread");
			isSpread = !isSpread;
			$(".up").css("display", "inline");
			$(".down").css("display", "none");
		} else {
			$(".down").css("display", "inline");
			$(".up").css("display", "none");
			$(".option_box").addClass("unspread");
			isSpread = !isSpread;
		}

	})

var goodsInfo = [];
var goodsIndex = 0;
$.ajax({
	url: "../data/common/goodsInfo.json",
	type: "get",
	async: true,
	success: function(data) {
		for(var i = 0; i < data.length; i++) {
			var result = data[i]
			for(var k in result) {
				goodsInfo[goodsIndex] = result[k];
				goodsIndex++;
			}
		}
		goodsInfoadd(0);
	}
})
//数组排序函数表达式
function keysrt(key,desc) {
  return function(a,b){
    return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
  }
}


//动态加载商品信息
//分页处理
var pageBtnWrap = $(".pageBtnWrap").children();
//分页初始化

//初始化结束
pageBtnWrap.click(function() {
	$("html body").scrollTop($("#goodList").offset().top+100);
	$(".list-container ul").html("");
	var index =parseInt($(this).index());
	if(index >1&&index<pageBtnWrap.length -2){ 	
    	$(this).addClass("curr").siblings().removeClass("curr");
    }else if(index ==0){
   	    pageBtnWrap.eq(2).addClass("curr").siblings().removeClass("curr");
    }else if(index ==1){
    	var forwordIndex = $(".curr").index();
    	if(forwordIndex>2){
    		pageBtnWrap.eq(forwordIndex-1).addClass("curr").siblings().removeClass("curr");
    	}   	
    }else if(index==pageBtnWrap.length-2){
    	var afterIndex = $(".curr").index();
    	if(afterIndex<pageBtnWrap.length-3){
    		pageBtnWrap.eq(afterIndex+1).addClass("curr").siblings().removeClass("curr");
    	}   	
    }else if(index ==pageBtnWrap.length-1){
    	pageBtnWrap.eq(pageBtnWrap.length-3).addClass("curr").siblings().removeClass("curr");
    }
    goodsInfoadd($(".curr").index()-2);
})
	//商品品牌栏的缩放结束
function goodsInfoadd(ind) {
	var length = goodsInfo.length;
	var lengthLast =null;
	(ind+1)*20<length?lengthLast =(ind+1)*20:lengthLast =length;
	for(var index = ind*20; index < lengthLast; index++) {
//		var goodList =  "<li class='list-item'>"+
//			"	<dl class='desc'>"+
//			"		<dt class='pic'>"+
// 			"           <a target='_blank' href='goodDetail.html' data-id ="+result[k].id+">"+
//			"              <img class='lazy' data-size='180_180_' src="+result[k].imgSrc+" data-original='' alt='"+result[k].goodName+"' style='display: block;'>"+
//			"           </a>"+
//			"		</dt>"+
//			"		<dd class='cont'>"+
//			"			<a target='_blank' href='goodDetail.html' data-id ="+result[k].id+">"+
//			"				<span class='title'>"+result[k].goodName+
//							   
//			"				   </span>"+
//			"				<span class='price'>"+result[k].price+
//							 	
//			"				元</span>"+
//			"			</a>"+
//			"		</dd>"+
//			"		<dd class='btns'>"+
//			"			<a href='##' class='add-cart' data-id='"+result[k].id+"'><em>加入购物车</em></a>"+
//			"		</dd>"+
//			"	</dl>"+
//			"</li>"
		var goodList =$("<li class='list-item'>" +
			"	<dl class='desc'>" +
			"		<dt class='pic'>" +
			"           <a target='_blank' href='goodDetail.html' data-id =" + goodsInfo[index].id + ">" +
			"              <img class='lazy' data-size='180_180_' src=" + goodsInfo[index].imgSrc + " data-original='' alt='" + goodsInfo[index].goodName + "' style='display: block;'>" +
			"           </a>" +
			"		</dt>" +
			"		<dd class='cont'>" +
			"			<a target='_blank' href='goodDetail.html' data-id =" + goodsInfo[index].id + ">" +
			"				<span class='title'>" + goodsInfo[index].goodName +

			"				   </span>" +
			"				<span class='price'>" + goodsInfo[index].price +

			"				元</span>" +
			"			</a>" +
			"		</dd>" +
			"		<dd class='btns'>" +
			"			<a href='##' class='add-cart' data-id='" + goodsInfo[index].id + "'><em>加入购物车</em></a>" +
			"		</dd>" +
			"	</dl>" +
			"</li>")
		$(".list-container ul").append(goodList);
	}

	$(".list-item a").click(function() {
		var goodsId = $(this).attr("data-id");
		$.cookie("goodsId", JSON.stringify(goodsId), {expires: 7,path: "/"});
	})

	//每个li移入鼠标的时候效果开始
	$("#goodList .list-item").mouseover(function() {
		var index = $(this).index();
		var cloneItemHtml = $(this).children().clone(true)
		$(".js-clone-item").css({
			display: "block",
			top: $(this).offset().top-10,
			left: $(this).offset().left
		});
		$(".js-clone-item").html(cloneItemHtml);
	})
	$(".js-clone-item").mouseout(function() {
			var s = event.toElement || event.relatedTarget;
			if(!this.contains(s)) {
				$(this).css({
					display: "none"
				}).html("");
			}
		})
		//每个li移入鼠标的时候效果结束
	
	$(".add-cart").click(function(event) {		
		//添加购物车开始
		// btns 下的a有三个类名 gray已销罄 add-cart加入购物车 rush抢购
		//添加购物车
		goods = $.cookie("carts") ? JSON.parse($.cookie("carts")) : {};
		var num = 1;
		var goodsId = $(this).attr("data-id");
		if($.cookie("carts")) {
			for(var ki in goods) {
				if(goods[ki].goodsId == goodsId) {
					delete goods[ki];
					num++;
				}
			}
		}
		var goodsInfo = {
				goodsId: goodsId,
				num: num
		}
		var dat = new Date();
		var time = (dat.getTime()) % 10000000;
		goods[time] = goodsInfo;
		$.cookie("carts", JSON.stringify(goods), {expires: 7,path: "/"});    
        //飞入购物车效果
        var offset = $("#end").offset();//end 为在结束元素加一个ID ，将结束元素设置为fixed；
        var addcar = $(this); 
        var img = addcar.parent().parent().find('img').attr('src'); //定义图片地址
        //将图片地址赋值给飞入效果的图片
        var flyer = $('<img class="u-flyer" style="width:100px;height:100px;z-index:1000000;border-radius:50px" src="'+img+'">'); 
        flyer.fly({ 
            start: { 
                left: event.pageX, //开始位置（必填）#fly元素会被设置成position: fixed 
                top: event.pageY-$(document).scrollTop() //开始位置（必填） 可视窗口的距离
            }, 
            end: { 
                left: offset.left+100, //结束位置（必填） 
                top: offset.top-$(document).scrollTop()+10, //结束位置（必填） 
                width: 0, //结束时宽度 
                height: 0 //结束时高度 
            }, 
            onEnd: function(){ //结束回调 
            	contCarNum();//数量++回调函数
//              $("#msg").show().animate({width: '250px'}, 200).fadeOut(1000); //提示信息                
//              addcar.css("cursor","default").removeClass('orange').unbind('click'); 
                this.destory(); //移除dom 
            } 
        }); 
	})	   
}
