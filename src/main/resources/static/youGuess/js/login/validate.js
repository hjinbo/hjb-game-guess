$(function() {

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    // 登录表单校验
    $("#userName").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".userName-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".userName-label").removeClass("shake animated");
            }, 1000);
        }
    });

    $("#userName").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });

    $("#password").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".password-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".password-label").removeClass("shake animated");
            }, 1000);
        }
    });

    $("#password").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });
    // 登录表单校验结束

    // 注册表单校验
    $("#reg-userName").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".userName-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".userName-label").removeClass("shake animated");
            }, 300);
        }
    });

    $("#reg-userName").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });

    $("#reg-password").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".password-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".password-label").removeClass("shake animated");
            }, 1000);
        }
    });

    $("#reg-password").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });

    $("#reg-password-again").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".password-again-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".password-again-label").removeClass("shake animated");
            }, 1000);
        } else if ($(this).val() !== $("#reg-password").val()) {
            layer.msg("两次密码不一致", {icon: 7, shift: 0, time: 2000});
        }
    });

    $("#reg-password-again").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });
    
    $("#reg-nickName").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".nickName-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".nickName-label").removeClass("shake animated");
            }, 1000);
        }
    });

    $("#reg-nickName").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });
    // 注册表单校验结束

    // 邮箱登录方式校验
    $("#email").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".email-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".email-label").removeClass("shake animated");
            }, 1000);
        }
    });

    $("#email").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });

    $("#code").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".code-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".code-label").removeClass("shake animated");
            }, 1000);
        }
    });

    $("#code").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });
    // 邮箱登录方式校验结束
})