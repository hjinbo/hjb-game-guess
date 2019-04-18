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

    $(".changeImg").click(function() {
        imgInit();
        $(".infoDiv").css("display", "none");
        $(".imgChooseDiv").css("display", "");

    });

    $("#saveImg").click(function() {
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

    $("#cancelImg").click(function() {
        $(".imgChooseDiv").css("display", "none");
    });

    $(".defaultImgDiv").click(function() {
        $(".preview").css("background-position-x", $(this).css("background-position-x"));
        $(".preview").css("background-position-y", $(this).css("background-position-y"));
    });

    // 完善信息
    $(".changeInfo").click(function() {
        $(".imgChooseDiv").css("display", "none");
        $(".infoDiv").css("display", "");
        $("#reg-userName").val("");
        $("#reg-nickName").val(sessionStorage.getItem("nickName"));
        $("#reg-password").val("");
        $("#reg-password-again").val("");
    });

    function validate() {
        return isNull($("#reg-userName").val()) || isNull($("#reg-password").val()) 
            || isNull($("#reg-password-again").val()) || isNull($("#reg-nickName").val());
        
    }

    $("#saveInfo").click(function() {
        var id = sessionStorage.getItem("id");
        var originUserName = sessionStorage.getItem("userName");
        if (!validate()) {
            $.ajax({
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                url: "/game/changeInfo",
                data: JSON.stringify({
                    userName: $("#reg-userName").val(),
                    password: $("#reg-password").val(),
                    nickName: $("#reg-nickName").val(),
                    id: id
                }),
                success: function(data) {
                    if (data.result.changeInfoResult) {
                        var user = data.result.user;
                        sessionStorage.setItem("userName", user.username);
                        sessionStorage.setItem("nickName", user.nickname);
                        sessionStorage.setItem("id", user.id);
                        layer.msg("完善信息成功", {
                            time: 1000,
                            shift: 0
                        }, function() {
                            $(".infoDiv").css("display", "none");
                        });
                    } else {
                        layer.msg("完善信息失败");
                    }
                },
                error: function(data) {
                    if (data.readyState === 0) {
                        layer.msg("无服务");
                    } else {
                        layer.msg("完善信息失败: " + data.responseJSON.message);
                    }
                }
            });
        } else {
            if (isNull($("#reg-userName").val())) {
                $("#reg-userName").css("border-color", "red");
                $("#reg-userName").addClass("shake animated");
                setTimeout(() => {
                    $("#reg-userName").removeClass("shake animated");
                }, 1000);
            }
            if (isNull($("#reg-password").val())) {
                $("#reg-password").css("border-color", "red");
                $("#reg-password").addClass("shake animated");
                setTimeout(() => {
                    $("#reg-password").removeClass("shake animated");
                }, 1000);
            }
            if (isNull($("#reg-password-again").val())) {
                $("#reg-password-again").css("border-color", "red");
                $("#reg-password-again").addClass("shake animated");
                setTimeout(() => {
                    $("#reg-password-again").removeClass("shake animated");
                }, 1000);
            }
            if (isNull($("#reg-nickName").val())) {
                $("#reg-nickName").css("border-color", "red");
                $("#reg-nickName").addClass("shake animated");
                setTimeout(() => {
                    $("#reg-nickName").removeClass("shake animated");
                }, 1000);
            }
        }
    });

    $("#cancelInfo").click(function() {
        $(".infoDiv").css("display", "none");
    });
})