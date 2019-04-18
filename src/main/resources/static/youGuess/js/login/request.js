$(function() {

    function validate(type) {
        if (type === "login") {
            return isNull($("#userName").val()) || isNull($("#password").val());
        } else if (type === "emailLogin") {
            return isNull($("#email").val()) || isNull($("#code").val());
        } else {
            return isNull($("#reg-userName").val()) || isNull($("#reg-password").val()) 
                || isNull($("#reg-password-again").val()) || isNull($("#reg-nickName").val());
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
                    sessionStorage.setItem("id", user.id);
                    sessionStorage.setItem("special", data.result.special);
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

    $("#emailLogin").click(function() {
        if (!validate("emailLogin")) {
            if (!hasSend) {
                layer.msg("请先获取验证码后登录");
                $("#code").val("");
                return;
            }
            $.ajax({
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                url: "/game/emailLogin",
                data: JSON.stringify({
                    email: $("#email").val(),
                    code: $("#code").val()
                }),
                success: function(data) {
                    var user = data.result.user;
                    console.log(user.username);
                    sessionStorage.setItem("userName", user.username);
                    sessionStorage.setItem("nickName", user.nickname);
                    sessionStorage.setItem("id", user.id);
                    sessionStorage.setItem("special", data.result.special);
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
            if (isNull($("#email").val())) {
                $("#email").css("border-color", "red");
                $("#email").addClass("shake animated");
                $(".email-label").addClass("shake animated");
                setTimeout(() => {
                    $("#email").removeClass("shake animated");
                    $(".email-label").removeClass("shake animated");
                }, 1000);
            }
            if (isNull($("#code").val())) {
                $("#code").css("border-color", "red");
                $("#code").addClass("shake animated");
                $(".code-label").addClass("shake animated");
                setTimeout(() => {
                    $("#code").removeClass("shake animated");
                    $(".code-label").removeClass("shake animated");
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
                    sessionStorage.setItem("id", user.id);
                    sessionStorage.setItem("special", data.result.special);
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

    // 验证码功能
    var timer;
    var getCodeInterval;
    var canClick = true;
    var hasSend = false;

    $(".getCode").click(function() {
        if (!canClick) {
            return;
        }
        var email = $("#email").val();
        if (isNull(email)) {
            $("#email").css("border-color", "red");
            $("#email").addClass("shake animated");
            $(".email-label").addClass("shake animated");
            setTimeout(() => {
                $("#email").removeClass("shake animated");
                $(".email-label").removeClass("shake animated");
            }, 1000);
        } else {
            if (emailValidate(email)) {
                getCodeRequest();
                getCodeInterval = 60;
                // 发送获得验证码的请求
                $(".getCode").html(--getCodeInterval + "秒后重发");
                timer = setInterval(codeCountDown, 1000);
                // 计时开始，改变获取验证码div的状态
                canClick = false;
                $(this).css("background-color", "#ddd");
                hasSend = true;
                // layer.msg("验证已发送, 请查收");
            } else {
                layer.alert("请填写正确的QQ邮箱", {
                    icon: 2
                });
            }
        } 
    });

    function emailValidate(email) {
        // var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@(qq.){1,63}[a-z0-9]+$");
        return reg.test(email);
    }

    function codeCountDown() {
        if (getCodeInterval > 1) {
            $(".getCode").html(--getCodeInterval + "秒后重发");
        } else {
            clearInterval(timer);
            canClick = true;
            $(".getCode").css("background-color", ""); // #4acad9
            $(".getCode").html("重新获取");
        }
    }

    function getCodeRequest() {
        $.ajax({
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            url: "/game/getCode",
            data: JSON.stringify({
                email: $("#email").val()
            }),
            success: function(data) {
                var getCodeResult = data.result.getCodeResult;
                if (getCodeResult) {
                    layer.msg("获取验证码成功", {
                        time: 1000,
                        shift: 0
                    });
                } else {
                    layer.msg("获取验证码失败");
                }
            },
            error: function(data) {
                if (data.readyState === 0) {
                    layer.msg("无服务");
                } else {
                    layer.msg("获取验证码失败: " + data.responseJSON.message);
                }
            }
        });
    }
})