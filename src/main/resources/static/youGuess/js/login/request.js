$(function() {

    function validate(type) {
        if (type === "login") {
            return isNull($("#userName").val()) || isNull($("#password").val());
        } else {
            return isNull($("#reg-userName").val()) || isNull($("#reg-password").val()) || isNull($("#reg-password-again").val());
        }
    }

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    $("#login").click(function() {
        if (!validate("login")) {
            $.ajax({
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                url: "/game/login",
                data: JSON.stringify({
                    userName: $("#userName").val(),
                    password: $("#password").val()
                }),
                success: function(data) {
                    var user = data.result.user;
                    console.log(user.username);
                    sessionStorage.setItem("userName", user.username);
                    sessionStorage.setItem("nickName", user.nickname);
                    var img = user.img;
                    if (!isNull(img)) {
                        var imgInfo = img.split(",");
                        var imgUrl = imgInfo[0];
                        var imgPostionX = imgInfo[1];
                        var imgPostionY = imgInfo[2];
                        sessionStorage.setItem("imgUrl", imgUrl);
                        sessionStorage.setItem("imgPostionX", imgPostionX);
                        sessionStorage.setItem("imgPostionY", imgPostionY);
                    }
                    window.location.href = "index.html";
                },
                error: function(data) {
                    if (data.readyState === 0) {
                        layer.msg("无服务");
                    } else {
                        layer.msg("登录失败: " + data.responseJSON.message);
                    }
                }
            });
        } else {
            if (isNull($("#userName").val())) {
                $("#userName").css("border-color", "red");
                $("#userName").addClass("shake animated");
                $(".userName-label").addClass("shake animated");
                setTimeout(() => {
                    $("#userName").removeClass("shake animated");
                    $(".userName-label").removeClass("shake animated");
                }, 1000);
            }
            if (isNull($("#password").val())) {
                $("#password").css("border-color", "red");
                $("#password").addClass("shake animated");
                $(".password-label").addClass("shake animated");
                setTimeout(() => {
                    $("#password").removeClass("shake animated");
                    $(".password-label").removeClass("shake animated");
                }, 1000);
            }
        }
    });

    $("#register").click(function() {
        if (!validate("register")) {
            $.ajax({
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                url: "/game/register",
                data: JSON.stringify({
                    userName: $("#reg-userName").val(),
                    password: $("#reg-password").val(),
                    nickName: $("#reg-nickName").val()
                }),
                success: function(data) {
                    var user = data.result.user;
                    sessionStorage.setItem("userName", user.username);
                    sessionStorage.setItem("nickName", user.nickname);
                    sessionStorage.setItem("user", user);
                    var registerResult = data.result.registerResult;
                    if (registerResult) {
                        layer.msg("注册成功", {
                            time: 1000,
                            shift: 0
                        }, function() {
                            window.location.href = "index.html";
                        });
                    } else {
                        layer.msg("注册失败");
                    }
                },
                error: function(data) {
                    if (data.readyState === 0) {
                        layer.msg("无服务");
                    } else {
                        layer.msg("注册失败: " + data.responseJSON.message);
                    }
                }
            });
        } else {
            if (isNull($("#reg-userName").val())) {
                $("#reg-userName").css("border-color", "red");
                $("#reg-userName").addClass("shake animated");
                $(".userName-label").addClass("shake animated");
                setTimeout(() => {
                    $("#reg-userName").removeClass("shake animated");
                    $(".userName-label").removeClass("shake animated");
                }, 1000);
            }
            if (isNull($("#reg-password").val())) {
                $("#reg-password").css("border-color", "red");
                $("#reg-password").addClass("shake animated");
                $(".password-label").addClass("shake animated");
                setTimeout(() => {
                    $("#reg-password").removeClass("shake animated");
                    $(".password-label").removeClass("shake animated");
                }, 1000);
            }
            if (isNull($("#reg-password-again").val())) {
                $("#reg-password-again").css("border-color", "red");
                $("#reg-password-again").addClass("shake animated");
                $(".password-again-label").addClass("shake animated");
                setTimeout(() => {
                    $("#reg-password-again").removeClass("shake animated");
                    $(".password-again-label").removeClass("shake animated");
                }, 1000);
            }
            if (isNull($("#reg-nickName").val())) {
                $("#reg-nickName").css("border-color", "red");
                $("#reg-nickName").addClass("shake animated");
                $(".nickName-label").addClass("shake animated");
                setTimeout(() => {
                    $("#reg-nickName").removeClass("shake animated");
                    $(".nickName-label").removeClass("shake animated");
                }, 1000);
            }
        }
    });
})