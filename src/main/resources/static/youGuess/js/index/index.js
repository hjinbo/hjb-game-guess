$(function() {

    var accessName = "";
    var tip;
    var textPrefix = "&nbsp;&nbsp;&nbsp;&nbsp;进入此房间后须达成: ";
    var textSuffix = ", 还请记住该房间的最终结果！";
    var text1 = "2048分以上";
    var text2 = "1024分以上";
    var text3 = "512分以上";
    var text4 = "";
    
    init();
    getTip();
    specialInit();

    function init() {
        var userName = sessionStorage.getItem("userName");
        if (userName === null || userName === undefined) {
            window.location.href = "login.html";
        }
    }

    function getTip() {
        tip = $(".tip").html();
    }
    
    function getAccessName(v) {
        return v.html();
    }

    $(".access-text").click(function() {
        $(".door").css("display", "");
        $(".door").addClass("flash animated");
        // setTimeout(() => {
        //     $(".door").removeClass("flash animated");
        // }, 800);
    });

    $(".door").mouseover(function() {
        accessName = getAccessName($(this));
        $(this).html("进入");
        // 生成提示
        var text = textPrefix;
        var id = $(this).attr("id");
        switch (id) {
            case "door1":
                text += text1;
                
                break;
            case "door2":
                text += text2;
                break;
            case "door3":
                text += text3;
                break;
            case "door4":
                text += text4;
                break;
        }
        text += textSuffix;
        $(".tipDiv").addClass("heartBeat animated");
        $(".tip").html(text);
    });

    $(".door").mouseout(function() {
        $(this).html(accessName);
        $(".tipDiv").removeClass("heartBeat animated");
        $(".tip").html(tip);
    });

    $(".door").click(function() {
        var id = $(this).attr("id");
        $(this).addClass("zoomOut");
        setTimeout(() => {
            switch (id) {
                case "door1":
                    window.location.href = "E:/develop/workspace/hjb-game/2048/index.html";
                    break;
                case "door2":
                    window.location.href = "E:/develop/workspace/hjb-game/jigsaw/index.html";
                    break;
                case "door3":
                    window.location.href = "E:/develop/workspace/hjb-game/slidingblocks/index.html";
                    break;
                case "door4":
                    layer.alert("此门不通");
                    // window.location.href = "";
                    break;
            }
            $(this).removeClass("zoomOut");
        }, 1000);
    });

    // 判断身份
    function specialInit() {
        var special = sessionStorage.getItem("special");
        var date = new Date();
        console.log("" + (date.getMonth() + 1) + ":" + date.getDate());
        if (date.getMonth() + 1 === 9 && date.getDate() === 7) {
            layer.alert("" + special);
        }
    }
})