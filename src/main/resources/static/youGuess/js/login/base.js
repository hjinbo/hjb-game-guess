$(function() {

    var clickTimes = 0;
    var registerBtnUse = false;

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    init();
    // 默认用密码登录
    loginTypeInit();

    function init() {
        // 用户名输入框
        $(".userName").val("");
        $(".userName").css("border-color", "#222");
        $(".userName-label").css("display", "");
        // 密码输入框
        $(".password").val("");
        $(".password").css("border-color", "#222");
        $(".password-label").css("display", "");
        // 重复密码输入框
        $(".password-again").val("");
        $(".password-again").css("border-color", "#222");
        $(".password-again-label").css("display", "");
        // 邮箱和验证码输入框(切换登录方式保留输入的值)
        // $(".email").val("");
        // $(".code").val("");
        // $(".email-label").css("display", "");
        // $(".code-label").css("display", "");
        $(".email").css("border-color", "#222");
        $(".code").css("border-color", "#222");
    }

    function loginTypeInit() {
        $(".byPwd").css("border-bottom", "3px solid #4acad9");
        $(".byPwd").css("color", "#fff");
    }

    $(".reg-btn").click(function() {
        if (!registerBtnUse) {
            layer.alert("注册页面不好看，还是用邮箱登录吧!", {
                icon: 6
            });
        } else {
            init();
            // 改变div的高度
            $(".operateDiv").css("height", "380px");
            $(".loginDiv").css("display", "none");
            $(".registerDiv").css("display", "");
            $(".loginDiv").removeClass("bounceInLeft animated");
            $(".registerDiv").addClass("bounceInLeft animated");
            $("title").html("注册");
        }
    });

    $(".reg-mark-left").click(function() {
        init();
        // 改变div的高度
        $(".operateDiv").css("height", "330px");
        $(".registerDiv").css("display", "none");
        $(".loginDiv").css("display", "");
        $(".registerDiv").removeClass("bounceInLeft animated");
        $(".loginDiv").addClass("bounceInLeft animated");
        $("title").html("登录");
    });

    $(".userName").focus(function() {
        $(".userName-label").css("display", "none");
    });

    $(".userName").blur(function() {
        if (isNull($(this).val())) {
            $(".userName-label").css("display", "");
        }
    });

    $(".password").focus(function() {
        $(".password-label").css("display", "none");
    });

    $(".password").blur(function() {
        if (isNull($(this).val())) {
            $(".password-label").css("display", "");
        }
    });

    $(".password-again").focus(function() {
        $(".password-again-label").css("display", "none");
    });

    $(".password-again").blur(function() {
        if (isNull($(this).val())) {
            $(".password-again-label").css("display", "");
        }
    });

    $(".nickName").focus(function() {
        $(".nickName-label").css("display", "none");
    });

    $(".nickName").blur(function() {
        if (isNull($(this).val())) {
            $(".nickName-label").css("display", "");
        }
    });

    $(".email").focus(function() {
        $(".email-label").css("display", "none");
    });

    $(".email").blur(function() {
        if (isNull($(this).val())) {
            $(".email-label").css("display", "");
        }
    });

    $(".code").focus(function() {
        $(".code-label").css("display", "none");
    });

    $(".code").blur(function() {
        if (isNull($(this).val())) {
            $(".code-label").css("display", "");
        }
    });

    // 注册用户名重复校验
    $("#reg-userName").blur(function() {
        var originUserName = sessionStorage.getItem("userName");
        if (!isNull($(this).val()) && $(this).val() !== originUserName) {
            $.ajax({
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                url: "/game/userNameExist",
                data: JSON.stringify({
                    userName: $("#reg-userName").val()
                }),
                success: function(data) {
                    if (data.result.exist) {
                        layer.msg("该用户名已被使用, 请更换");
                    } else {
                        sessionStorage.setItem("userName", $("#reg-userName").val());
                    }
                },
                error: function(data) {
                    if (data.readyState === 0) {
                        layer.msg("无服务");
                    } else {
                        layer.msg("用户名重复校验失败: " + data.responseJSON.message);
                    }
                }
            });
        }
    });

    // 白名单登录方式
    $(".author").click(function() {
        if (clickTimes >= 3) {
            sessionStorage.setItem("userName", "nevermore");
            layer.alert("appreciate for your concentration!", {
                icon: 6,
                title: "tip"
            }, function() {
                window.location.href = "index.html";
            });
        }
        clickTimes++;
    });

    // 切换登录方式
    $(".byPwd").click(function() {
        init();
        $(".loginDiv").addClass("fadeIn animated");
        setTimeout(() => {
            $(".loginDiv").removeClass("fadeIn animated");
        }, 300);
        $(".byEmail").css("border-bottom", "none");
        $(".byEmail").css("color", ""); // #9d9d9d
        $(this).css("border-bottom", "3px solid #4acad9");
        $(this).css("color", "#fff");
        $(".loginType-byEmail").css("display", "none");
        $(".loginType-byPwd").css("display", "");
    });

    $(".byEmail").click(function() {
        init();
        $(".loginDiv").addClass("fadeIn animated");
        setTimeout(() => {
            $(".loginDiv").removeClass("fadeIn animated");
        }, 300);
        $(".byPwd").css("border-bottom", "none");
        $(".byPwd").css("color", "");
        $(this).css("border-bottom", "3px solid #4acad9");
        $(this).css("color", "#fff");
        $(".loginType-byPwd").css("display", "none");
        $(".loginType-byEmail").css("display", "");
    });
})