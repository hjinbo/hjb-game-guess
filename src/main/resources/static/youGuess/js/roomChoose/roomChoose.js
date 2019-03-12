$(function() {
    
    initPage();

    function initPage() {
        var userName = sessionStorage.getItem("userName");
        if (userName === null || userName === undefined) {
            window.location.href = "login.html";
        }
    }

    $("#access").click(function() {
        var roomName = $("#roomName").val();
        sessionStorage.setItem("roomName", roomName);
        window.location.href = "index.html";
    });
})