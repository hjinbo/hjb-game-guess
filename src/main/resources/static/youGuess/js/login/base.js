$(function() {

    var clickTimes = 0;

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    init();

    function init() {
        $(".userName").val("");
        $(".password").val("");
        $(".password-again").val("");
        $(".userName").css("border-color", "#222");
        $(".password").css("border-color", "#222");
        $(".password-again").css("border-color", "#222");
        $(".userName-label").css("display", "");
        $(".password-label").css("display", "");
        $(".password-again-label").css("display", "");
    }

    $(".reg-btn").click(function() {
        init();
        // 改变div的高度
        $(".operateDiv").css("height", "380px");
        $(".loginDiv").css("display", "none");
        $(".registerDiv").css("display", "");
        $(".loginDiv").removeClass("bounceInLeft animated");
        $(".registerDiv").addClass("bounceInLeft animated");
        $("title").html("注册");
    });

    $(".reg-mark-left").click(function() {
        init();
        // 改变div的高度
        $(".operateDiv").css("height", "320px");
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
})