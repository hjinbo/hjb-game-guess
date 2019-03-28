$(function() {
    
    initPage();

    function initPage() {
        var userName = sessionStorage.getItem("userName");
        if (userName === null || userName === undefined) {
            window.location.href = "login.html";
        }
        if (!isNull($("#roomName").val())) {
            $(".roomName-label").css("display", "none");
        }
    }

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }


    $("#access").click(function() {
        var roomName = $("#roomName").val();
        if (!isNull($("#roomName").val())) {
            sessionStorage.setItem("roomName", roomName);
            window.location.href = "paint.html";
        } else {
            $("#roomName").css("border-color", "red");
            $("#roomName").addClass("shake animated");
            setTimeout(() => {
                $("#roomName").removeClass("shake animated");
            }, 1000);
        }
    });
})