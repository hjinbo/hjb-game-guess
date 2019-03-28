$(function() {

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    $("#roomName").blur(function() {
        if (isNull($(this).val())) {
            $(this).css("border-color", "red");
            $(this).addClass("shake animated");
            $(".roomName-label").addClass("shake animated");
            setTimeout(() => {
                $(this).removeClass("shake animated");
                $(".roomName-label").removeClass("shake animated");
            }, 1000);
        }
    });
    $("#roomName").bind("input propertychange",function(event){
        if (!isNull($(this).val())) {
            $(this).css("border-color", "#222");
        }
    });
})