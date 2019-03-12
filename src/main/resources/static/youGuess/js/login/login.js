$(function() {
    $("#login").click(function() {
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
                sessionStorage.setItem("userName", user.userName);
                sessionStorage.setItem("user", user);
                window.location.href = "roomChoose.html";
            },
            error: function(data) {
                layer.alert("登录失败: " + data.responseJSON.message);
            }
        });
    });
})