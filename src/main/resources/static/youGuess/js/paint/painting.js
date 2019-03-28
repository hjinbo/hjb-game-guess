$(function() {

    var webSocketAddressPrefix = "ws://localhost:8083/webSocket/";

    var monitor = document.getElementById("paint-board");
    var context = monitor.getContext("2d");

    var status = "";
    var canPaint = false;
    var randomQuestion = "";
    var randomAnswer = "";
    var lineWidth = 5;
    var lineColor = "black";
    var webSocket = null;
    var roomName = "";
    var userName = "";
    var nickName = "";
    var isConnect = false;
    var image = "";
    var startCanClick = true;
    var gameStatus = 0;
    var statusSpan = true;
    var gameTime = 60;
    var timer;
    var painter = '';
    var result = false;
    var roomUsersWithScore = [];
    var oldRoomUsersWithScore = [];

    initPage();
    createWebSocket();

    function initPage() {
        init();
        userName = sessionStorage.getItem("userName");
        if (userName === null || userName === undefined) {
            window.location.href = "login.html";
        }
        roomName = sessionStorage.getItem("roomName");
        if (roomName === null || roomName === undefined) {
            window.location.href = "roomChoose.html";
        }
        nickName = sessionStorage.getItem("nickName");
    }

    function init() {
        status = "";
        canPaint = false;
        randomQuestion = "";
        randomAnswer = "";
        lineWidth = 5;
        lineColor = "black";
        webSocket = null;
        roomName = "";
        userName = "";
        nickName = "";
        isConnect = false;
        image = "";
        startCanClick = true;
        gameStatus = 0;
        statusSpan = true;
        gameTime = 60;
        painter = '';
        result = false;
        roomUsersWithScore = [];
        oldRoomUsersWithScore = [];
    }

    function paint() {
        $("#paint-board").mousedown(function(e) {
            status = "painting";
            context.beginPath();
            context.moveTo(e.pageX - 262, e.pageY - 52);
        });
        $("#paint-board").mouseup(function() {
            status = "";
        });
        $("#paint-board").mousemove(function(e) {
            if (status === "painting") {
                context.strokeStyle = lineColor;
                context.lineWidth = lineWidth;
                context.lineTo(e.pageX - 262, e.pageY - 52);
                context.stroke();
                saveImg();
                setTimeout(() => {
                    sendImg();
                }, 500);
            }
        });
    }

    function randomQuestionOrTips(type) {
        $(".tip-top").empty();
        var title;
        randomQuestion = "测试";
        var font;
        if (type === 1) {
            title = "问题";
            font = "<font>" + title + ": " + randomQuestion + "</font><font style='display: none;'>" + randomAnswer + "</font>";
        } else {
            title = "提示";
            randomAnswer = "程序上线前的流程";
            font = "<font>" + title + ": " + randomAnswer + "</font><font style='display: none;'>" + randomQuestion + "</font>";
        }
        $(font).appendTo($(".tip-top"));
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
        window.location.href = "roomChoose.html"
    });

    $("#send").click(function() {
        sendMessage();
    });

    function createWebSocket() {
        // 判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            // 访问路径  端口号+定义的websocket地址
            // userName = $("#userName").val();
            // roomName = $("#roomName").val();
            webSocket = new WebSocket(webSocketAddressPrefix + roomName + "/" + userName);
        } else {
            alert('Not support webSocket');
        }

        // 连接发生错误的回调方法
        webSocket.onerror = function(event) {
            console.log("readyState: " +　event.target.readyState);
            // layer.alert("readyState: " +　event.target.readyState, {title: event.type});
        };

        // 连接成功建立的回调方法
        webSocket.onopen = function(event) {
            var message = JSON.stringify({
                type: 1,
                user: {
                    userName: userName,
                    nickName: nickName
                },
                roomName: roomName
            })
            webSocket.send(message);
        }

        // 接收到消息的回调方法
        webSocket.onmessage = function(event) {
            eval("var jsonObj = (" + event.data + ")");
            if (jsonObj.type === 1) {
                // 房主信息和开始游戏按钮
                console.log("房主: " + jsonObj.roomMaster);
                if (userName === jsonObj.roomMaster) {
                    $("#startGame").css("display", "");
                    showPaintBoard(false);
                    // 加载开始按钮
                    $("#startGame").click(function() {
                        var message = JSON.stringify({
                            type: 4,
                            user: {
                                userName: userName,
                                nickName: nickName
                            },
                            roomName: roomName,
                            startTime: new Date()
                        })
                        if (startCanClick && gameStatus === 2) {
                            console.log("开始游戏， 准备选择画家");
                            webSocket.send(message);
                            startCanClick = false;
                        }
                    });
                } else {
                    $("#startGame").css("display", "none");
                }
                // 用户左侧和右侧栏的显示
                var roomUsers = jsonObj.roomUsers;
                var num = roomUsers.length;
                console.log("第" + num + "个进入房间");
                if (num > 8) {
                    console.log("房间满了");
                } else {
                    addUserSpan(roomUsers);
                }
            }
            if (jsonObj.type === 2) {
                // 游戏正确的处理
                var answer = jsonObj.content;
                if (answer === randomQuestion && jsonObj.user.userName !== painter) {
                    console.log("答对了");
                    result = true;
                }
            }
            if (jsonObj.type === 3) {
                $("#img").attr("src", jsonObj.image);
            }
            if (jsonObj.type === 4) {
                gameTime = jsonObj.gameTime;
                painter = jsonObj.painter;
                console.log("画家为:" + painter);
                gameStatus = jsonObj.gameStatus;
                if (userName === jsonObj.painter) {
                    canPaint = true;
                } else {
                    canPaint = false;
                }
                if (painter === "" || painter === undefined) {
                    console.log("所有玩家均已画完， 游戏结束");
                    clearInterval(timer);
                    gameStatus = 2;
                    // 发送游戏结束消息
                    var message = JSON.stringify({
                        type: 7,
                        user: {
                            userName: userName,
                            nickName: nickName
                        },
                        roomName: roomName
                    });
                    webSocket.send(message);
                }
                console.log("canPaint: " + canPaint);
                console.log("游戏状态:" + gameStatus);
                if (gameStatus === 1) {
                    var names = document.getElementsByClassName("username");
                    for (var i = 0; i < names.length; i++) {
                        var tmp = "#user" + (i + 1);
                        if (names[i].innerText === painter) {
                            $(tmp).css("border-color", "rgb(206, 83, 83)");
                        } else {
                            $(tmp).css("border-color", "#e5e5e5");
                        }
                    }
                    if (canPaint) {
                        showPaintBoard(true);
                        randomQuestionOrTips(1);
                        paint();
                    } else {
                        showPaintBoard(false);
                        randomQuestionOrTips(2);
                    }
                    timer = setInterval(gameCountDown, 1000);
                } else {
                    hideQuestionOrTips();
                    clearInterval(timer);
                }
            }
            if (jsonObj.type === 5) {
                console.log("用户:" + jsonObj.exitUserName + "离开了房间");
                // 重新加载用户
                var roomUsers = jsonObj.roomUsers;
                $(".user").css("display", "none");
                $(".user img").css("display", "none");
                $(".user .username").html("");
                addUserSpan(roomUsers);
            }
            if (jsonObj.type === 6) {
                roomUsersWithScore = jsonObj.roomUsers;
            }
            if (jsonObj.type === 7) {
                startCanClick = true;
            }
            setMessage(event.data);
        }

        // 连接关闭的回调方法
        webSocket.onclose = function(CloseEvent) {
            console.log("" + CloseEvent.code);
            closeWebSocket();
        }

        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            closeWebSocket();
        }
    }

    function gameCountDown() {
        gameTime--;
        $("#gameTime").html(gameTime);
        if (gameTime === 0) {
            clearInterval(timer);
            canPaint = false;
            // 公布结果
            var message = JSON.stringify({
                type: 6,
                user: {
                    userName: userName,
                    nickName: nickName
                },
                roomName: roomName
            })
            webSocket.send(message);
            if (roomUsersWithScore.length > 0 || oldRoomUsersWithScore !== roomUsersWithScore) {
                $(".scoreBoard").css("display", "");
                var questionResult = "本轮结果: " + randomQuestion;
                $(".scoreBoard .answer").html(questionResult);
                for (var i = 0; i < roomUsersWithScore.length; i++) {
                    var tmp = ".scores .row" + i;
                    $(tmp).css("display", "");
                    $(tmp + " .name").html(roomUsersWithScore[i].userName);
                    $(tmp + " .score").html(roomUsersWithScore[i].score);
                }
                oldRoomUsersWithScore = roomUsersWithScore;
            }
            message = JSON.stringify({
                type: 4,
                user: {
                    userName: userName,
                    nickName: nickName
                },
                roomName: roomName,
                startTime: new Date()
            })
            layer.msg("游戏将在10秒后再次开启", {
                icon: 1,
                time: 10000
            });
            if (userName === painter) {
                setTimeout(() => {
                    $(".scoreBoard").css("display", "none");
                    webSocket.send(message);
                }, 10 * 1000);
            } else {
                setTimeout(() => {
                    $(".scoreBoard").css("display", "none");
                }, 10 * 1000);
            }
        }
    }

    function addUserSpan(roomUsers) {
        var num = roomUsers.length;
        for (var i = 0; i < num; i++) {
            var spanName = roomUsers[i].nickName;
            var img = roomUsers[i].img;
            var isRoomMaster = roomUsers[i].roomMaster;
            var tmp = "#user" + (i + 1);
            var tmpUserName = "#user" + (i + 1) + " .username";
            $(tmpUserName).html(spanName);
            if (statusSpan) {
                var roomMasterSign = "<div class='roomMasterSign'></div>";
                if (isRoomMaster) {
                    $(roomMasterSign).prependTo($(tmp));
                } else {
                    $(roomMasterSign).remove();
                }
                statusSpan = false;
            }
            $(tmp).css("display", "");
        }
    }

    function getDate(time) {
        if (date === undefined) {
            var date = new Date();
        } else {
            var date = new Date(time);
        }
        var month = date.getMonth() + 1;
        var dayOfMonth = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        return date.getFullYear() + "-" + (month <= 9 ? "0" + month : month) + "-"
            + (dayOfMonth <= 9 ? "0" + dayOfMonth : dayOfMonth) + " "
            + (hour <= 9 ? "0" + hour : hour) + ":" + (min <= 9 ? "0" + min : min);
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
    function setMessage(message) {
        eval("var jsonObj = (" + message + ")");
        var info = assembleInfo(jsonObj);
        $(info).appendTo($("#message"));
        var messageDiv = document.getElementById("message");
        messageDiv.scrollTo(0, messageDiv.scrollHeight);
    }

    // 关闭连接
    function closeWebSocket() {
        var message = JSON.stringify({
            type: 5,
            roomName: roomName,
            user: {
                userName: userName,
                nickName: nickName
            }
        });
        webSocket.send(message);
    }

    // 发送消息
    function sendMessage() {
        var content = $("#content").val().trim();
        var message = JSON.stringify({
            user: {
                userName: userName,
                nickName: nickName
            },
            roomName: roomName,
            painter: painter,
            type: 2,
            content: content
        });
        if (content === randomQuestion && userName === painter) {
            layer.msg("作为画家不可以将答案告诉别人啊", {
                icon: 4,
                time: 4000
            });
        } else {
            if (result && (content === randomQuestion)) {
                layer.msg("已回答正确，正确答案不可再次再次提交");
            } else {
                if (content !== "") {
                    try {
                        if (webSocket.readyState === 1) {
                            webSocket.send(message);
                        } else {
                            layer.alert("连接建立异常, 发送失败");
                        }
                    } catch (e) {
                        layer.alert(e);
                    }
                    $("#content").attr("placeholder", "");
                    $("#content").css("border-color", "");
                } else {
                    $("#content").attr("placeholder", "你需要输入消息");
                    $("#content").css("border-color", "red");
                }
            }
        }
        $("#content").val("");
        $("#content").focus();
    }

    // 装配消息
    function assembleInfo(jsonObj) {
        var userName = jsonObj.user.userName;
        var nickName = jsonObj.user.nickName;
        var date = jsonObj.date;
        var type = jsonObj.type;
        // var isSelf = jsonObj.isSelf;
        var roomName = jsonObj.roomName
        var content = jsonObj.content;
        var painter = jsonObj.painter;
        var info;
        switch (type) {
            case 1:
                info = "<p class='systemInfo'>" + nickName + "进入了" + "" + roomName + "房间</p>";
                break;
            case 2:
                if (content === randomQuestion) {
                    info = "<p class='systemInfo dateInfo'>" + getDate(date) + "</p>" +
                    "<p class='userInfo'>" + nickName + ":    </p>";
                } else {
                    info = "<p class='systemInfo dateInfo'>" + getDate(date) + "</p>" +
                    "<p class='userInfo'>" + nickName + ": " + content + "</p>";
                }
                break;
            case 4:
                if (painter === "" | painter === undefined) {
                    info = "<p class='systemInfo'>游戏结束</p>";
                } else {
                    info = "<p class='systemInfo'>游戏开始</p>";
                }
                break;
            case 5:
                info = "<p class='systemInfo'>" + nickName + "离开了" + "" + roomName + "房间</p>";
                break;
        }
        return info;
    }

    function saveImg() {
        image = monitor.toDataURL("image/png");
    }

    function sendImg() {
        var message = JSON.stringify({
            user: {
                userName: userName,
                nickName: nickName
            },
            roomName: roomName,
            type: 3,
            image: image
        });
        webSocket.send(message);
    }
})