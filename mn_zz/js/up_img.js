var upUrl = "http://creative.ifeng.com/psm_v1/baseupload/?_c=baseupload&_a=mengniu";
//var upUrl ='http://www.chenyi.com/yxcenter/trunk/02src/2014/psm_v1/baseupload/?_c=baseupload&_a=mengniu';
$(function () {
    $("#add-img").uploadPreview({ Img: "ImgPr", Width: 120, Height: 120 });
   
});
jQuery.fn.extend({
    uploadPreview: function (opts) {
        var num=0;
        var _self = this,
            _this = $(this);
        opts = jQuery.extend({
            Img: "ImgPr",
            Width: 83,
            Height: 57,
            ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
            filemaxsize : 1024*2,
            Callback: function () {}
        }, opts || {});
        _self.getObjectURL = function (file) {
            var url = null;
            $('.loding').fadeIn();
            if (window.createObjectURL != undefined) {
                url = window.createObjectURL(file)
            } else if (window.URL != undefined) {
                url = window.URL.createObjectURL(file)
            } else if (window.webkitURL != undefined) {
                url = window.webkitURL.createObjectURL(file)
            }
            
            var xhr = new XMLHttpRequest();
            $('.loding').fadeIn();
            if (xhr.upload) {
                // 上传中
                xhr.upload.addEventListener("progress", function(e) {
                    self.onProgress(file, e.loaded, e.total);
                }, false);
                /*var oSrc=_self.getObjectURL(this.files[0]);
                    if(oSrc){
                        $('.loding').fadeOut();
                    }else{
                        $('.loding').fadeIn();
                    }*/
                // 文件上传成功或是失败
                xhr.onreadystatechange = function(e) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200){
                            url = xhr.responseText;
                            $('.loding').fadeOut();
                        } else {
                           alert('图片上传失败！');
                        }
                    }
                };
                // 开始上传
                xhr.open("POST", upUrl, false);
                xhr.setRequestHeader("X_FILENAME", file.name);
                xhr.send(file);
            }
            return url
        };
        _this.change(function () {
            if (this.value) {
                if (!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                    alert("选择文件错误,图片类型必须是" + opts.ImgType.join("，") + "中的一种");
                    this.value = "";
                    return false
                }
                /*var target=this.files[0];
                var filemaxsize = 1024*1024*2;//2M 
                if(target.size>filemaxsize){
                    alert('图片大小不能超过2MB！');
                    return false;
                }*/
                if ($.browser.msie) {
                    try {
                        $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
                    } catch (e) {
                        var src = "";
                        var obj = $("#" + opts.Img);
                        var div = obj.parent("div")[0];
                        _self.select();
                        if (top != self) {
                            window.parent.document.body.focus()
                        } else {
                            _self.blur()
                        }
                        src = document.selection.createRange().text;
                        document.selection.empty();
                        obj.hide();
                        obj.parent("div").css({
                            'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)',
                            'width': opts.Width + 'px',
                            'height': opts.Height + 'px'
                        });
                        div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src;
                    }
                } else {
                    $("#item1").prepend('<img src="'+ _self.getObjectURL(this.files[0])+'" height="134"></div>');
                    /*
                    $('#item1 img').attr('src',_self.getObjectURL(this.files[0]));*/
                }
                opts.Callback()
            }
        })
    }
});
