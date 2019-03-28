$(function() {

    var timer;
    var color = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

    init();
    // timerInit();

    function init() {
        $("#roomName").val("");
        $(".roomName-label").css("display", "");
    }

    $("#roomName").focus(function() {
        $(".roomName-label").css("display", "none");
    });
    $("#roomName").blur(function() {
        if ($(this).val() === "") {
            $(".roomName-label").css("display", "");
        }
    });

    // 以下为背景颜色随机变换(暂不使用该方式)
    function timerInit() {
        timer = setInterval(changeBgColor, 500);
    }

    function changeBgColor() {
        var bgColor = "#";
        for (var i = 0; i < 6; i++) {
            var index = Math.floor(Math.random() * 16);
            bgColor += color[index];
        }
        $(".bgColor").css("background-color", bgColor);
    }
    // 背景色结束


    $(".operateDiv").mouseover(function() {
        $(this).addClass("bgColor");
    });

    // $(".operateDiv").mouseout(function() {
    //     $(this).removeClass("bgColor");
    // });
})