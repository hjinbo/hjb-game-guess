$(function() {
    var monitor = document.getElementById("paint-board");
    var context = monitor.getContext("2d");

    var status = "";
    var canPaint = false;
    var randomContent = "";
    var lineWidth = 5;
    var lineColor = "black";
    var webSocket = null;
    var roomName = "";
    var userName = "";
    var isConnect = false;
    var image = "";
    var startCanClick = true;
    var masterStatus = 0;
    var roomMaster = false;
    var identity = 0;
    var gameStatus = 0;

    function reload() {
        status = "";
        canPaint = false;
        randomContent = "";
        lineWidth = 5;
        lineColor = "black";
        webSocket = null;
        roomName = "";
        userName = "";
        isConnect = false;
        image = "";
        startCanClick = true;
        masterStatus = 0;
        roomMaster = false;
        identity = 0;
        gameStatus = 0;
    }

    function paint() {
        $("#paint-board").mousedown(function(e) {
            status = "painting";
            context.beginPath();
            context.moveTo(e.pageX - 362, e.pageY - 52);
        });
        $("#paint-board").mouseup(function() {
            status = "";
        });
        $("#paint-board").mousemove(function(e) {
            if (status === "painting") {
                context.strokeStyle = lineColor;
                context.lineWidth = lineWidth;
                context.lineTo(e.pageX - 362, e.pageY - 52);
                context.stroke();
                saveImg();
                setTimeout(() => {
                    sendImg();
                }, 500);
            }
        });
    }

    function randomQuestionOrTips(type) {
        var title;
        if (type === 1) {
            title = "问题";
            randomContent = "测试";
        } else {
            title="提示";
            randomContent = "程序上线前的流程";
        }
        $("<font>" + title + ": " + randomContent + "</font>").appendTo($(".tip-top"));
    }

    function hideQuestionOrTips() {
        $(".tip-top").empty();
    }

    $(".lineWidth").click(function() {
        lineWidth = $(this).attr("title");
    });

    $("#colorSelector").change(function() {
        lineColor = $(this).val();
        console.log("当前笔画颜色: " + lineColor);
    });

    $("#connect").click(function() {
        createWebSocket();
        $("#roomName").val("");
        $("#userName").val("");
    });
    $("#exit").click(function() {
        closeWebSocket();
    });

    $("#send").click(function() {
        sendMessage();
    });

    function createWebSocket() {
        reload();
        // 判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            // 访问路径  端口号+定义的websocket地址
            userName = $("#userName").val();
            roomName = $("#roomName").val();
            webSocket = new WebSocket("ws://localhost:8082/webSocket/" + roomName + "/" + userName);
        } else {
            alert('Not support webSocket')
        }

        // 连接发生错误的回调方法
        webSocket.onerror = function() {
            console.log("error");
        };

        // 连接成功建立的回调方法
        webSocket.onopen = function(event) {
            var message = JSON.stringify({
                type: 1,
                user: {
                    userName: userName
                },
                roomName: roomName
            })
            webSocket.send(message);
        }

        // 接收到消息的回调方法
        webSocket.onmessage = function(event) {
            eval("var jsonObj = (" + event.data + ")");
            if (jsonObj.type === 3) {
                $("#img").attr("src", jsonObj.image);
            }
            if (jsonObj.type === 1) {
                var roomUsers = jsonObj.roomUsers;
                console.log("房间信息: " + roomUsers);
                console.log(typeof(roomUsers));
                var num = roomUsers.length;
                console.log("第" + num + "个进入房间");
                if (num > 8) {
                    console.log("房间满了");
                } else {
                    for (var i = 0; i < num; i++) {
                        var spanName = roomUsers[i].userName;
                        var spanIdentity = roomUsers[i].identity;
                        var tmp = "#user" + (i + 1);
                        var tmpUserName = "#user" + (i + 1) + " .username";
                        $(tmpUserName).html(spanName);
                        $(tmp).css("display", "");
                    }
                }
            }
            if (jsonObj.type === 4) {
                console.log("画家为:" + jsonObj.painter);
                console.log("游戏状态:" + jsonObj.gameStatus);
                gameStatus = jsonObj.gameStatus;
                if (userName === jsonObj.painter) {
                    canPaint = true;
                } else {
                    canPaint = false;
                }
            }
            if (masterStatus === 0) {
                roomMaster = jsonObj.user.roomMaster;
                masterStatus = 1;
            }
            console.log("登录者是否是房主?: " + roomMaster);
            if (roomMaster) {
                $("#startGame").css("display", "");
                showPaintBoard(false);
                // 加载开始按钮
                $("#startGame").click(function() {
                    var message = JSON.stringify({
                        type: 4,
                        user: {
                            userName: userName
                        },
                        roomName: roomName
                    })
                    if (startCanClick) {
                        console.log("开始游戏， 准备选择画家");
                        webSocket.send(message);
                        startCanClick = false;
                    }
                });
            } else {
                $("#startGame").css("display", "none");
            }
            if (gameStatus === 1) {
                identity = jsonObj.user.identity;
                console.log("登录者的身份: " + identity);
                if (canPaint) {
                    showPaintBoard(true);
                    randomQuestionOrTips(1);
                    paint();
                } else {
                    showPaintBoard(false);
                    if (jsonObj.type === 4) {
                        randomQuestionOrTips(2);
                    }
                } 
                console.log("canPaint: " + canPaint);
            } else {
                hideQuestionOrTips();
            }
            setMessage(event.data, "running");
        }

        // 连接关闭的回调方法
        webSocket.onclose = function(CloseEvent) {
            webSocket.close();
            console.log("" + CloseEvent.code);
            setMessage(getDate() + " "+ userName + " 退出了聊天室！", "exit");
            // 增加用户离开的消息发送
        }

        
        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            webSocket.close();
            // 增加用户离开的消息发送
        }
    }

    function getDate(time) {
        if (date === undefined) {
            var date = new Date();
        } else {
            var date = new Date(time);
        }
        var month = date.getMonth() + 1;
        return date.getFullYear() + "-" + (month <= 9 ? "0" + month : month) + "-" + date.getDate() + " "
            + date.getHours() + ":" + date.getMinutes();
    }

    // 画板的显示与隐藏
    function showPaintBoard(show) {
        if (show) {
            $("#img").css("display", "none");
            $("#paint-board").css("display", "");
        } else {
            $("#img").css("display", "");
            $("#paint-board").css("display", "none");
        }
    }

    // 将消息显示在网页上
    function setMessage(message, type) {
        if (type === "exit") {
            var info = "<p class='systemInfo'>" + message + "</p>"
            $(info).appendTo($("#message"));
            console.log("exit");
        } else {
            eval("var jsonObj = (" + message + ")");
            var info = assembleInfo(jsonObj);
            $(info).appendTo($("#message"));
        }
        var messageDiv = document.getElementById("message");
        messageDiv.scrollTo(0, messageDiv.scrollHeight);
    }

    // 关闭连接
    function closeWebSocket() {
        webSocket.close();
    }

    // 发送消息
    function sendMessage() {
        var content = $("#content").val().trim();
        var message = JSON.stringify({
            user: {
                userName: userName
            },
            roomName: roomName,
            type: 2,
            content: content
        });
        if (content !== "") {
            webSocket.send(message);
            $("#content").attr("placeholder", "");
            $("#content").css("border-color", "");
        } else {
            $("#content").attr("placeholder", "你需要输入消息");
            $("#content").css("border-color", "red");
        }
        $("#content").val("");
        $("#content").focus();
    }

    // 装配消息
    function assembleInfo(jsonObj) {
        var userName = jsonObj.user.userName;
        var date = jsonObj.date;
        var type = jsonObj.type;
        // var isSelf = jsonObj.isSelf;
        var roomName = jsonObj.roomName
        var content = jsonObj.content;
        var info;
        if (type === 1) {
            info = "<p class='systemInfo'>" + userName + "进入了" + "" + roomName + "房间</p>"
        } else if (type === 2) {
            info = "<p class='systemInfo dateInfo'>" + getDate(date) + "</p><p class='userInfo'>" + userName + ": " + content + "</p>"
        } else if (type === 4) {
            info = "<p class='systemInfo'>游戏开始</p>"
        }
        return info;
    }

    function saveImg() {
        image = monitor.toDataURL("image/png");
    }

    function sendImg() {
        var message = JSON.stringify({
            user: {
                userName: userName
            },
            roomName: roomName,
            type: 3,
            image: image
        });
        webSocket.send(message);
    }
})