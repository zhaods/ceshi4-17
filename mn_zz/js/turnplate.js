//var rootPath = "http://www.chenyi.com/yxcenter/trunk/02src/2014/psm_v1/";
var rootPath = "http://creative.ifeng.com/psm_v1/";

var errorIndex = [0, 1, 2, 3, 4, 5];
errorIndex = errorIndex[Math.floor(Math.random() * errorIndex.length)]; //页面刷新获取随机数
//console.log(errorIndex); 输出随机数，输出多少指针落指在所在位置
var lotteryNum;
lotteryNum = [];
lotteryNum[0] = '特等奖NBA门票';
lotteryNum[1] = '三等奖 蒙牛新养道优惠券';
lotteryNum[2] = '一等奖ip7';
lotteryNum[3] = '三等奖 蒙牛新养道优惠券';
lotteryNum[4] = '二等奖';
lotteryNum[5] = '三等奖 蒙牛新养道优惠券';
var turnplate = {
  turnplateBox: $('#turnplate'),
  turnplateBtn: $('#platebtn'),
  lightDom: $('#turnplatewrapper'),
  freshLotteryUrl: '',
  msgBox: $('#msg'),
  lotteryUrl: '',
  height: '334.5', //帧高度
  minResistance: 5, //基本阻力
  Cx: 0.01, //阻力系数 阻力公式：  totalResistance = minResistance + curSpeed * Cx; 
  accSpeed: 15, //加速度持续帧数
  accFrameLen: 40, //加速度持续帧数
  maxSpeed: 550, //最大速度 
  minSpeed: 20, //最小速度 
  frameLen: 6, //帧总数
  totalFrame: 0, //累计帧数,每切换一帧次数加1
  curFrame: 0, //当前帧
  curSpeed: 20, //上帧的速度
  lotteryTime: 0, //抽奖次数
  lotteryIndex: 4, //奖品index
  //errorIndex : 3, //奖品的指针,从0开始计算
  errorIndex: errorIndex, //奖品的指针
  initBoxEle: $('#turnplate #init'),
  progressEle: $('#turnplate #init span'),
  initProgressContent: '', //初始化进度条的内容
  initFreshInterval: 500, //进度条刷新间隔
  virtualDistance: 10000, //虚拟路程,固定值，速度越快，切换到下帧的时间越快: 切换到下帧的时间 = virtualDistance/curSpeed
  isStop: false, //抽奖锁,为true时，才允许下一轮抽奖
  timer2: undefined, //计时器
  initTime: undefined,
  showMsgTime: 2000, //消息显示时间
  lotteryChannel: '',
  lotteryType: {
    '特等奖NBA门票': 0,
    '三等奖 蒙牛新养道优惠券': 1,
    '一等奖ip7': 2,
    '三等奖 蒙牛新养道优惠券': 3,
    '二等奖 ipad mini': 4,
    '三等奖 蒙牛新养道优惠券': 5
  },
  //初始化
  init: function() {
    this.initAnimate();
    this.freshLottery();
    this.turnplateBtn.click($.proxy(function(errorIndex) {

      var zc_name=$('#phone').val();
      var nickname1, email1, show_cookie, iphone;
      show_cookie = getCookie('fenxiang_na');
      //alert('分享后:'+show_cookie);
      var zd_cookie=getCookie('co_ph');
      //alert('zd_cookie:'+zd_cookie);
      if(show_cookie){
        iphone = getCookie('fenxiang_ph');
        nickname1 = getCookie('fenxiang_na');
        //alert(nickname1+':'+iphone)
      }

      //var nickname2 =getCookie('oName');
      var email2 = getCookie('co_ph');
      alert('抽奖电话：'+email2);
      if(email2){
        iphone =  email2;
        nickname1 = getCookie('oName');
      }

      root_url = rootPath + "mengniu/index.php?_c=mengniu&_a=choujiang";
      var _this = this;
      $.getJSON(root_url + "&callback=?", {
        nickname: nickname1,
        email: 'email',
        mobile: iphone
      }, function(json) {
        var data = eval(json);
        if (data.error == '0') {
          //setCookie('fx_ok','ok');
          $.cookie("fx_ok",'ok');
          turnplate.errorIndex = data.id;
          turnplate.prizeName = data.prize;
        }else if(data.error == '2') {
          alert('该手机号当天已参与过抽奖');
          $("#layercon_3").fadeOut();
          $('.sc_but').fadeOut();
          return false;
        }else if(data.error == '4') {
          alert('请填写正确手机号');
          $("#layercon_3").fadeOut();
          $('.sc_but').fadeOut();
          return false;
        } else {
          turnplate.errorIndex = 3;
          turnplate.prizeName = '三等奖 蒙牛新养道优惠券';
        };
        console.log(data.id);
        _this.click(errorIndex);
      });
    }, this));
  },
  //初始化动画
  initAnimate: function() {
    this.initBoxEle.show();
    clearTimeout(this.initTimer);
    var curLength = this.progressEle.text().length,
      totalLength = this.initProgressContent.length;

    if (curLength < totalLength) {
      this.progressEle.text(this.initProgressContent.slice(0, curLength + 1));
    } else {
      this.progressEle.text('');
    }
    this.initTimer = setTimeout($.proxy(this.initAnimate, this), this.initFreshInterval);
  },

  //停止初始化动画
  stopInitAnimate: function() {
    clearTimeout(this.initTimer);
    this.initBoxEle.hide();
  },

  freshLotteryTime: function() {
    $('#top-menu').find('.lottery-times').html(this.lotteryTime);
  },

  //更新抽奖次数
  freshLottery: function() {
    this.stopInitAnimate();
    this.isStop = true;
    this.lotteryTime = 1;
    this.freshLotteryTime();
  },
  //获取奖品
  lottery: function() {
    this.lotteryIndex = undefined;
    this.lotteryTime--;
    this.freshLotteryTime();
    this.totalFrame = 0;
    this.curSpeed = this.minSpeed;
    this.turnAround();
    this.lotteryIndex = typeof this.lotteryType[0] !== 'undefined' ? this.lotteryType[0] : this.errorIndex;
  },
  //点击抽奖
  click: function() {
    //加锁时
    if (this.isStop == false) {
      alert('不可重复点击');
      return;
    }
    this.lottery();
  },
  //更新当前速度
  freshSpeed: function() {
    var totalResistance = this.minResistance + this.curSpeed * this.Cx;
    var accSpeed = this.accSpeed;
    var curSpeed = this.curSpeed;
    if (this.totalFrame >= this.accFrameLen) {
      accSpeed = 0;
    }
    curSpeed = curSpeed - totalResistance + accSpeed;

    if (curSpeed < this.minSpeed) {
      curSpeed = this.minSpeed;
    } else if (curSpeed > this.maxSpeed) {
      curSpeed = this.maxSpeed;
    }
    this.curSpeed = curSpeed;
  },

  //旋转,trunAround,changeNext循环调用
  turnAround: function() {
    //加锁
    this.isStop = false;
    var intervalTime = parseInt(this.virtualDistance / this.curSpeed);
    this.timer = window.setTimeout('turnplate.changeNext()', intervalTime);
  },
  //切换到下帧
  changeNext: function() {
    //判断是否应该停止
    var ceshu = this.lotteryIndex;
    if (this.lotteryIndex !== undefined && this.curFrame == this.lotteryIndex && this.curSpeed <= this.minSpeed + 10 && this.totalFrame > this.accFrameLen) {
      this.isStop = true;
      // 弹出登入框
      setTimeout(function() {
        if (ceshu != '0' && ceshu != '2' && ceshu != '4') {
          alert('恭喜您获得 蒙牛新养道优惠券！');
          $(".sc_but").fadeIn();
          return false;
        }
      }, 400)
      return;
    }
    var nextFrame = this.curFrame + 1 < this.frameLen ? this.curFrame + 1 : 0;
    var bgTop = -nextFrame * this.height;
    this.turnplateBox.css('backgroundPosition', '0 ' + bgTop.toString() + 'px');
    //this.switchLight();
    this.curFrame = nextFrame;
    this.totalFrame++;
    this.freshSpeed();
    this.turnAround();
  }
};

turnplate.init();

$(function() {
  // 活动规则
  $('.but span.gz').click(function() {
    $('.main ul li').css('display', 'none');
    $('.gzsm').css('display', 'block');
    $('.p1').css('display', 'block');
  })

  $('.but span').each(function(index) {
    $(this).click(function() {
      $('.but span').removeClass('nav');
      var nav = $('.but span').eq(index);
      nav.addClass('nav');
    })
  })

  $('.gzsm_warp a.close').click(function() {
    $('.gzsm').css('display', 'none');
    $('.but span').removeClass('nav');
  })

  $('.clo_b').click(function() {
    $('.gzsm').css('display', 'none');
  })

  // 注册报名
  $('.but span.zc').click(function() {
    $('.main ul li').css('display', 'none');
    $('.p5_mb').attr('src', arr[0]);
    $('#name').val('');
   // $('#email').val('');
    $('#phone').val('');
    $('#textare').val('请保持在24个字以内');
    $('.frame_pic').attr('src','');
    $('.picture').attr('src','');
    $('.item2 img').attr('src','');

    $('.p5').hide();
    $('.p2').css('display', 'block');
  })
  // 围观点赞


  $('.but span.dz').click(function() {
    $('.main ul li').css('display', 'none');
    $('.p6').css('display', 'block');
  })

  //选择模板
  $('.p2_content div').each(function(index) {
    $(this).click(function() {
      $('.p2_content span').removeClass('turr');
      var nav = $('.p2_content span').eq(index);
      nav.addClass('turr');
    })
  })
  // 注册
  $('a.ok').click(function() {
    $('.main ul li').css('display', 'none');
    $('.p3').css('display', 'block');
  })
  // 分享弹层
  $('.fx').click(function() {
    $('.fxy').css('display', 'block');
  })
  $('.fxy').click(function() {
    $(this).css('display', 'none');
  })
  
  // 关闭转盘
  $('.zp_close').click(function() {
    $("#layercon_3").fadeOut();
    $('.sc_but').fadeOut();
  })
  var oId;
  //事件绑定点赞弹出信息输入
  $('.nei_txt_right a.xin').live('click', function() {
    oId = parseInt(this.id);
    var cooke_email = getCookie('co_ph');
    
    if (!cooke_email) {
      $('.xinx').fadeIn();
    }else{
      show_zan();
    }
  });

  function show_zan() {
    var id = oId;
    var num = parseInt($("#mn" + id).text());
    var nickname2, email2;
    var cooke_email = getCookie('co_ph');
    //alert('点赞后cookie'+cooke_email);
    if(cooke_email){
      nickname2 =getCookie('oName');
      email2 = getCookie('co_ph');
    }else{
      nickname2 = $('#nickname1').val();
      email2 = $('#iphone').val();
    }

    //alert('点赞后判断的姓名手机'+nickname2+':'+email2);
    console.log(nickname2+':'+email2);
    var sub_data = {
      'num': num,
      'bid': id,
      'email': email2,
      'mobile':email2,
      'nickname': nickname2,
    }
    var cooke_fx =getCookie('fx_ok');
    $.getJSON(rootPath + "mengniu/index.php?_c=mengniu&_a=prized&callback=?", sub_data, function(json) {
      var data = eval(json);
      if (data.msg == 'ok') {
        alert('亲~点赞成功啦~');
        $('#mn' + id).text(data.prized_num);
        if (cooke_fx) {
          $('#layercon_3').fadeOut();
        };
        alert(cooke_email);
        
        if(cooke_email){
          $('#layercon_3').fadeIn();
        };
        
        return false;
      };
      if (data.msg == 'fail') {
        alert('对不起，请重新输入信息！');
        return false;
      };
      if (data.msg == 'email') {
        alert('亲~你的手机号今天已经赞过10次啦~');
        $('#layercon_3').fadeOut();
        return false;
      };
      if (data.msg == 'ip') {
        alert('亲~你今天已经赞过10次啦~');
        $('#layercon_3').fadeOut();
        return false;
      };
    });
    $('.xinx').fadeOut();
  }

  //提交输入信息弹出抽奖
  $('.xinx_sub').on('click', function() {
    var nickname1 = $('#nickname1').val();
    nickname1 = $.trim(nickname1);
    //var email1 = $("#email1").val();
    var iphone = $("#iphone").val();
    var param = /^((13|15)|18|14|17)\d{9}$/;
    var cooke_email = getCookie('co_ph');

    //email1 = $.trim(email1);
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!nickname1) {
      alert("请输入昵称");
      return false;
    }
    if (!iphone || !param.test(iphone)) {
      alert('请填写正确手机号');
      return false;
    }
    
    if (!cooke_email) {
      //setCookie('co_ph', iphone);
      //setCookie('oName', nickname1);
      $.cookie("co_ph",iphone);
      $.cookie("oName",nickname1);
      //$('#layercon_3').fadeIn();
    }

    show_zan();
  })

  //关闭信息框
  $('.xinx_colse').click(function() {
    $('.xinx').fadeOut();
  })

})