$(function() {

    var clickTimes = 0;

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    function initLabel() {
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
        initLabel();
        $(".loginDiv").css("display", "none");
        $(".registerDiv").css("display", "");
        $(".loginDiv").removeClass("bounceInLeft animated");
        $(".registerDiv").addClass("bounceInLeft animated");
    });

    $(".reg-mark-left").click(function() {
        initLabel();
        $(".registerDiv").css("display", "none");
        $(".loginDiv").css("display", "");
        $(".registerDiv").removeClass("bounceInLeft animated");
        $(".loginDiv").addClass("bounceInLeft animated");
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

    $(".author").click(function() {
        if (clickTimes >= 3) {
            layer.alert("appreciate for your concentration!", {
                icon: 6,
                title: "tip"
            });
            sessionStorage.setItem("userName", "nevermore");
        }
        clickTimes++;
    });
})