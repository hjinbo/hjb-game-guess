$(function() {
    $("#access").click(function() {
        var userName = location.userName;
        $.ajax({
            url: "/game/roomChoose",
            data: {
                roomName: $("#roomName").val()
            },
            success: function() {
                window.location.href = "index.html?userName=" + userName + "&roomName=" + $("#roomName").val();
            },
            error: function() {
                window.loccation.href = "roomChoose?userName=" + userName;
                layer.alert("进入房间失败");
            }
        });
    });
})