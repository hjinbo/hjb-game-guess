$(function() {
    var showEmotiDiv = false;
    $("#emotion").click(function() {
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

})