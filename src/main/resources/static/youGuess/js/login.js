$(function() {
    $("#login").click(function() {
        $.ajax({
            url: "/game/login",
            data: {
                userName: $("#userName").val(),
                password: $("#password").val()
            },
            success: function() {
                window.location.href = "roomChoose.html?userName=" + $("#userName").val();
            },
            error: function() {
                window.location.href = "login.html";
                layer.alert("登录失败");
            }
        });
    });
})