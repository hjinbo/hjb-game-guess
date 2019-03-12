$(function() {

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    // 登录表单校验
    $("#userName").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
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
            setTimeout(() => {
                $(this).removeClass("shake animated");
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
            setTimeout(() => {
                $(this).removeClass("shake animated");
            }, 1000);
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
            setTimeout(() => {
                $(this).removeClass("shake animated");
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
            setTimeout(() => {
                $(this).removeClass("shake animated");
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
    
})