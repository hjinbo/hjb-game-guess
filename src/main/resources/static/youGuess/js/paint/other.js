$(function() {

    var showEmotiDiv = false;
    var initWidth = window.innerWidth;
    var initHeight = window.innerHeight;

    $("#emPic").click(function() {
        if (!showEmotiDiv) {
            $(".chooseEmotionDiv").css("display", "");
            showEmotiDiv = true;
        } else {
            $(".chooseEmotionDiv").css("display", "none");
            showEmotiDiv = false;
        }
    });

    $(".emoti").click(function() {
        $("#content").val($("#content").val() + $(this).html());
        showEmotiDiv = false;
        $(".chooseEmotionDiv").css("display", "none");
    });

    // 查看玩家信息
    $(".user").click(function() {
        var name = $(".user .username").html();
        var img = $(".user img").attr("src");
        layer.alert("功能暂未实现" + name + ": " + img);
    });

    
    // 窗口大小适应
    // $(window).resize(function() {
    //     var newBackWidth = window.innerWidth;
    //     var newBackHeight = window.innerHeight;
    //     var times = Math.min(newBackWidth / initWidth, newBackHeight / initHeight);
    //     initWidth = newBackWidth;
    //     initHeight = newBackHeight;
    //     var tmp = "scale(" + times + ")";
    //     $(".back").css("transform", tmp);
    //  });
})