// 实现标签页切换 //
function initSwitchTab() {
    let tabSession = document.querySelector('.tab .tab-session');
    let tabFriend = document.querySelector('.tab .tab-friend');
    //lists为数组,第一个元素使会话列表,第二个元素是好友列表
    let lists = document.querySelectorAll('.list');
    tabSession.onclick = function () {
        tabSession.style.backgroundImage = 'url(img/session.png)';
        tabFriend.style.backgroundImage = 'url(img/friend-gray.png)';
        lists[0].classList.remove('hide');
        lists[1].classList.add('hide');
    }
    tabFriend.onclick = function () {
        tabSession.style.backgroundImage = 'url(img/session-gray.png)';
        tabFriend.style.backgroundImage = 'url(img/friend.png)';
        lists[0].classList.add('hide');
        lists[1].classList.remove('hide');
    }
}

initSwitchTab();

// 操作websocket //
let websocket = new WebSocket('ws://localhost:12345/websocket');
websocket.onopen = function () {
    console.log('websocket 连接建立成功!');
}
websocket.onmessage = function (event) {
    console.log('websocket 收到消息:'+event.data);
    let resp = JSON.parse(event.data);
    if(resp.type == 'message') {
        handleMessage(resp);
    }else {
        console.log('非message的消息类型!');
    }
}
websocket.onclose = function () {
    console.log('websocket 连接关闭!');
}
websocket.onerror = function () { 
    console.log('websocket 连接发生异常!');
}

function handleMessage(resp) {
    let curSessionLi = findSessionLi(resp.sessionId);
    if(curSessionLi==null) {
        curSessionLi = document.createElement('li');
        curSessionLi.setAttribute('session-id', resp.sessionId);
        curSessionLi.innerHTML = '<h3>'+resp.fromName+'</h3>'+'<p></p>';
        curSessionLi.onclick = function() {
            clickSession(curSessionLi);
        }
    }
    let p = curSessionLi.querySelector('p');
    p.innerHTML = resp.content;
    // 截断超过10个字符的预览消息显示
    if(p.innerHTML.length > 10) {
        p.innerHTML = p.innerHTML.substring(0,10)+'...';
    }
    let sessionListUL = document.querySelector('#session-list');
    sessionListUL.insertBefore(curSessionLi,sessionListUL.children[0]);
    // 只有当左侧的会话被选中时才在右侧显示消息内容
    if(curSessionLi.classList.contains('active')) {
        let contentDiv = document.querySelector('.right .content');
        addMessage(contentDiv,resp);
        scrollBottom(contentDiv);
    }
}

function findSessionLi(targetSessionId) {
    let sessionLis = document.querySelectorAll('#session-list li');
    for(let li of sessionLis) {
        let sessionId = li.getAttribute('session-id');
        if(sessionId == targetSessionId) {
            return li;
        }
    }
}

// 实现消息发送和接收
function initSendButton() {
    let sendButton = document.querySelector('.right .ctrl button');
    let messageInput = document.querySelector('.right .message-input');
    sendButton.onclick = function () {
        if(!messageInput.value) {
            // 若未输入消息内容则不执行消息发送
            return;
        }
        // 获取当前选中的li标签,从中获取sessionId
        let sessionLi = document.querySelector('#session-list .active');
        if(!sessionLi) {
            // 若未选中会话则不执行消息发送
            return;
        }
        let sessionId = sessionLi.getAttribute('session-id');
        let req={
            type:'message',
            sessionId: sessionId,
            content: messageInput.value
        };
        console.log('发送消息:/n'+JSON.stringify(req));
        websocket.send(JSON.stringify(req));
        // 清空输入框
        messageInput.value = '';
    }
}
initSendButton();

// 从服务器获取用户数据 //
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/userInfo',
        success: function (body) {
            if(body.userId && body.userId > 0) {
                let userDiv = document.querySelector('.main .left .user');
                userDiv.innerHTML = body.userName;
                userDiv.setAttribute("user-id", body.userId);
            } else {
                alert('当前用户未登录!');
                location.assign('/login.html');
            }
        }
    })
}

getUserInfo();

// 获取好友列表 //
function getFriendList() {
    $.ajax({
        type: 'get',
        url: '/friendList',
        success:function (body) {
            let friendListUL = document.querySelector('#friend-list');
            friendListUL.innerHTML = '';
            for(let friend of body) {
                let li = document.createElement('li');
                li.innerHTML = '<h4>'+friend.friendName+'</h4>';
                li.setAttribute('friend-id', friend.friendId);
                friendListUL.appendChild(li);  
                li.onclick = function() {
                    clickFriend(friend);
                }
            }
        },
        error: function () {
            console.log('获取好友列表失败!'); 
        }
    })
}

getFriendList();

function getSessionList() {
    $.ajax({
        type: 'get',
        url: '/sessionList',
        success:function (body) {
            let sessionListUL = document.querySelector('#session-list');
            sessionListUL.innerHTML = '';
            for(let session of body){
                //对lastMessage的长度进行限制,超过n个字符进行截断处理
                if(session.lastMessage.length > 10) {
                    session.lastMessage = session.lastMessage.substring(0, 10) + '...'; 
                }
            
                let li = document.createElement('li');
                li.setAttribute('session-id', session.sessionId);
                li.innerHTML = '<h3>'+session.friends[0].friendName+'</h3>'
                                +'<p>'+session.lastMessage+'</p>';
                sessionListUL.appendChild(li);

                // 给li标签新增点击事件
                li.onclick = function() {
                    console.log('点击了会话');
                    clickSession(li);
                }
            }
        }
    })
}

getSessionList();


function clickSession(currentLi) {
    // 设置激活高亮
    let allLis = document.querySelectorAll('#session-list>li');
    if(currentLi.classList.contains('active')) {
        disactiveSession(currentLi);
        return;
    }
    activeSession(allLis,currentLi);
    // 获取被点击会话的历史消息
    let sessionId = currentLi.getAttribute('session-id');
    getHistoryMessage(sessionId);
}

function disactiveSession(currentLi) {
    currentLi.classList.remove('active');
    document.querySelector('.right-plain').classList.remove('hide');
    document.querySelector('.right').classList.add('hide');
    
}

function activeSession(allLis, currentLi) {
    for(let li of allLis) {
        if(li == currentLi) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    }
    document.querySelector('.right-plain').classList.add('hide');
    document.querySelector('.right').classList.remove('hide');
}

function getHistoryMessage(sessionId) {
    console.log('获取历史消息,sessionId='+sessionId);
    // 清空右侧消息显示内容
    let titleDiv = document.querySelector('.right .title');
    titleDiv.innerHTML = '';
    let contentDiv = document.querySelector('.right .content');
    contentDiv.innerHTML= '';
    let activedH3 = document.querySelector('#session-list .active>h3');
    // 重置会话标题 
    if(activedH3) {
        titleDiv.innerHTML = activedH3.innerHTML;
    }
    // 向后端发起请求,获取历史聊天记录
    $.ajax({
        type: 'get',
        url: '/message?sessionId='+sessionId,
        success: function(body) {
            for(let message of body){
                // 往聊天记录显示区域添加消息
                addMessage(contentDiv,message);
                console.log('历史消息:'+message.content);
            }
            // 将滚动条滚动到底部,显示最新聊天记录
            scrollBottom(contentDiv);
        }
    })
}

// 在消息显示区域添加一条消息
function addMessage(contentDiv,message) {
    // 使用div表示一条消息
    let messageDiv = document.createElement('div');
    // 判断当前消息是否为用户自己发的,再决定消息是否靠右显示
    let selfUserName = document.querySelector('.left .user').innerHTML;
    if(selfUserName == message.fromName) {
        messageDiv.className = 'message message-right';
    }else{
        messageDiv.className = 'message message-left';
    }
    messageDiv.innerHTML = '<div class="box">'+'<h4>'+message.fromName+'</h4>'+'<p>'+message.content+'</p>'+'</div>';
    contentDiv.appendChild(messageDiv);
}

// 将滚动条滚动到底部  
function scrollBottom(elem) {
    // 内容的总高度
    let scrollHeight = elem.scrollHeight;
    // 可视区域的高度
    let clientHeight = elem.offsetHeight;
    elem.scrollTo(0, scrollHeight - clientHeight);
}

function clickFriend(friend) {
    // 查询会话列表中的会话
    let sessionLi = findSessionByName(friend.friendName);
    let sessionListUL = document.querySelector('#session-list');
    // 若会话存在,则激活会话并置顶
    // 若不存在,则创建新会话并置顶
    if(sessionLi){
        sessionListUL.insertBefore(sessionLi,sessionListUL.children[0]);
        if(!sessionLi.classList.contains('active')) {
            clickSession(sessionLi);
        }
        updateLastTime(friend.friendId);
    }else {
        sessionLi =document.createElement('li');
        sessionLi.innerHTML="<h3>"+friend.friendName+"</h3>"+"<p></p>";
        sessionListUL.insertBefore(sessionLi,sessionListUL.children[0]);
        sessionLi.onclick=function(){
            clickSession(sessionLi);
        }
        sessionLi.click();
        createSession(friend.friendId,sessionLi);
    }
    let tabSession = document.querySelector('.tab .tab-session');
    tabSession.click();
}

function findSessionByName(friendName) {
    let sessionLis = document.querySelectorAll('#session-list>li');
    for(let sessionLi of sessionLis) {
        let h3 = sessionLi.querySelector('h3');
        if(h3.innerHTML == friendName){
            return sessionLi;
        }
    }
    return null;
}

function createSession(friendId,sessionLi) {
    $.ajax({
        type: 'post',
        url: '/session?toUserId='+friendId,
        success: function(body){
            console.log("创建会话成功,sessionId="+body.sessionId);
            sessionLi.setAttribute("session-id",body.sessionId);
        }
    })
}

function updateLastTime(friendId) {
    $.ajax({
        type: 'post',
        url: '/updateLastTime?toUserId='+friendId,
        success: function(body){
            console.log("更新会话最后时间成功!");
        }
    })
}

