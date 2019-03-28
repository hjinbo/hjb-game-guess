$(function() {

    $(".header-ul .header-li .text").mouseover(function() {
        var moveTextDiv = "<div class='moveTextDiv'></div>";
        var moveBottomDiv = "<div class='moveBottomDiv'></div>";
        // $(moveTextDiv).appendTo($(this));
    });

    $(".header-ul .header-li .layout").click(function() {
        sessionStorage.clear();
        window.location.href = "login.html";
    });

    // 导航栏按钮鼠标移入移出事件
    $(".header-ul .header-li .personInfo").mouseover(function() {
        $(".personInfoDiv").css("display", "");
    });

    $(".header-ul .header-li .personInfo").mouseout(function() {
        $(".personInfoDiv").css("display", "none");
    });

    $(".personInfoDiv").mouseover(function() {
        $(".personInfoDiv").css("display", "");
    });

    $(".personInfoDiv").mouseout(function() {
        $(".personInfoDiv").css("display", "none");
    });

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    // 选择头像
    function imgInit() {
        // 加载预览头像
        var imgUrl = sessionStorage.getItem("imgUrl");
        var imgPostionX = sessionStorage.getItem("imgPostionX");
        var imgPostionY = sessionStorage.getItem("imgPostionY");
        if (!isNull(imgUrl)) {
            $(".preview").css("background-image", "url(" + imgUrl + ")");
        }
        if (!isNull(imgPostionX)) {
            $(".preview").css("background-position-x", imgPostionX);
        }
        if (!isNull(imgPostionY)) {
            $(".preview").css("background-position-y", imgPostionY);
        }

        // 加载默认头像
        for (var i = 0; i < 24; i++) {
            var tmp = ".img-"
            tmp += i;
            var p = -68 * i;
            $(tmp).css("background-position-x", p);
            $(tmp).css("background-position-y", "0px");
        }
    }

    $(".header-ul .header-li .changeImg").click(function() {
        imgInit();
        $(".imgChooseDiv").css("display", "");

    });

    $(".save").click(function() {
        var imgUrl = $(".preview").css("background-image");
        imgUrl = imgUrl.split("(")[1].split(")")[0]; // 获得url()括号内的内容
        // imgUrl = imgUrl.replace(new RegExp("\"","gm"), ""); // 去掉引号
        // imgUrl = imgUrl.substr(imgUrl.lastIndexOf("/") + 1);
        var imgPositionX = $(".preview").css("background-position-x");
        var imgPositionY = $(".preview").css("background-position-y");
        sessionStorage.setItem("imgUrl", imgUrl);
        sessionStorage.setItem("imgPostionX", imgPositionX);
        sessionStorage.setItem("imgPostionY", imgPositionY);
        // 同时提交数据库
        var userName = sessionStorage.getItem("userName");
        $.ajax({
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            url: "/game/changeImg",
            data: JSON.stringify({
                userName: userName,
                imgUrl: imgUrl,
                imgPositionX: imgPositionX,
                imgPositionY: imgPositionY
            }),
            success: function(data) {
                if (data.result.changeResult) {
                    layer.msg("更换头像成功", {
                        time: 1000,
                        shift: 0
                    }, function() {
                        $(".imgChooseDiv").css("display", "none");
                    });
                } else {
                    layer.msg("更换头像失败");
                }
            },
            error: function(data) {
                if (data.readyState === 0) {
                    layer.msg("无服务");
                } else {
                    layer.msg("更换头像失败: " + data.responseJSON.message);
                }
            }
        });
    });

    $(".cancel").click(function() {
        $(".imgChooseDiv").css("display", "none");
    });

    $(".defaultImgDiv").click(function() {
        $(".preview").css("background-position-x", $(this).css("background-position-x"));
        $(".preview").css("background-position-y", $(this).css("background-position-y"));
    });

})