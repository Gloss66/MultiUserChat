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

// 退出登录确认弹窗
function initLogoutConfirm() {
    let logoutDiv = document.querySelector('.main .left .user .logout');
    let logoutModal = document.querySelector('.main .logout-modal');
    let cancelButton = document.querySelector('.main .logout-modal .cancel');
    let confirmButton = document.querySelector('.main .logout-modal .confirm');
    logoutDiv.onclick = function () {
        logoutModal.classList.remove('hide');
    }
    cancelButton.onclick = function () {
        logoutModal.classList.add('hide');
    }
    logoutModal.onclick = function (event) {
        if(event.target == logoutModal) {
            logoutModal.classList.add('hide');
        }
    }
    confirmButton.onclick = function () {
        $.ajax({
            type: 'post',
            url: '/logout',
            success: function () {
                location.assign('/login.html');
            }
        });
    }
}

initLogoutConfirm();

// 操作websocket //
let websocket = new WebSocket('wss://'+location.host+'/websocket');
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
        if(sessionLi.previousElementSibling!=null) {
            updateLastTime(sessionId);
        }
        let req={
            type:'message',
            sessionId: sessionId,
            content: messageInput.value
        };
        console.log('点击了发送按钮,消息内容:'+messageInput.value);
        console.log('发送消息:'+JSON.stringify(req));
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
                let userDiv = document.querySelector('.main .left .user .info');
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
            // 若搜索框有输入,刷新搜索结果
            if(typeof refreshFriendSearch === 'function') {
                refreshFriendSearch();
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
    let selfUserName = document.querySelector('.left .user .info').innerHTML;
    if(selfUserName == message.fromName) {
        messageDiv.className = 'message message-right';
    }else{
        messageDiv.className = 'message message-left';
    }
    let textContent=message.content.replace(/\n/g,'<br>'); // 将消息内容中的换行符替换为<br>标签
    messageDiv.innerHTML = '<div class="box">'+'<h4>'+message.fromName+'</h4>'+'<p>'+textContent+'</p>'+'</div>';
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
    // updateLastTime(sessionLi.getAttribute("session-id"));
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

function updateLastTime(sessionId) {
    $.ajax({
        type: 'post',
        url: '/updateLastTime?sessionId='+sessionId,
        success: function(body){
            console.log("更新会话最近时间成功!");
        }
    })
}

// 已有好友搜索
let refreshFriendSearch;

function initFriendSearch() {
    // 获取搜索框、结果容器、结果列表节点
    let searchInput = document.querySelector('.main .left .search input');
    let resultWrapper = document.querySelector('.main .left .search-result');
    let resultList = document.querySelector('.main .left .search-result-list');

    if(!searchInput || !resultWrapper || !resultList) return;

    function hideResults() {
        resultWrapper.classList.add('hide');
    }

    function showResults() {
        resultWrapper.classList.remove('hide');
    }

    function collectFriends() {
        let listItems = document.querySelectorAll('#friend-list li');
        let friends = [];
        listItems.forEach(function(li) {
            let h4 = li.querySelector('h4');
            if(!h4) return;
            let friendName = h4.textContent.trim();
            if(!friendName) return;
            friends.push({
                friendName: friendName,
                friendId: li.getAttribute('friend-id')
            });
        });
        return friends;
    }

    function render(keyword) {
        // 过滤、匹配并渲染结果列表
        let key = (keyword || '').trim().toLowerCase();
        resultList.innerHTML = '';
        if(!key) {
            hideResults();
            return;
        }

        let friends = collectFriends();
        let matches = friends.filter(function(friend) {
            return friend.friendName.toLowerCase().includes(key);
        });

        if(matches.length === 0) {
            showResults();
            let emptyLi = document.createElement('li');
            emptyLi.classList.add('no-result');
            emptyLi.textContent = '未搜索到结果';
            resultList.appendChild(emptyLi);
            return;
        }

        matches.forEach(function(friend) {
            let li = document.createElement('li');
            li.textContent = friend.friendName;
            li.onclick = function() {
                // 复用已有的 clickFriend 打开会话
                clickFriend({
                    friendId: friend.friendId,
                    friendName: friend.friendName
                });
                // 点击结果后隐藏搜索结果并清空输入框
                hideResults();
                searchInput.value = '';
            };
            resultList.appendChild(li);
        });
        showResults();
    }

    searchInput.addEventListener('input', function() {
        // 输入即搜索
        render(searchInput.value);
    });

    searchInput.addEventListener('focus', function() {
        if(searchInput.value.trim()) {
            render(searchInput.value);
        }
    });

    document.addEventListener('click', function(event) {
        // 点击框外隐藏结果
        let isInside = searchInput.contains(event.target) || resultWrapper.contains(event.target);
        if(!isInside) {
            hideResults();
        }
    });

    refreshFriendSearch = function() {
        // getFriendList执行后触发重渲染
        if(searchInput.value.trim()) {
            render(searchInput.value);
        }
    };
}

// 添加按钮下拉菜单与添加好友弹窗逻辑
function initAddMenu() {
    let addBtn = document.querySelector('.main .left .search .addBtn');
    let overlay = document.querySelector('.main .add-menu-overlay');
    let dropdown = document.querySelector('.main .add-menu-dropdown');
    let addFriendItem = document.querySelector('.main .add-menu-item.add-friend-item');
    let createGroupItem = document.querySelector('.main .add-menu-item.create-group-item');
    let addFriendModal = document.querySelector('.main .add-friend-modal');
    let addFriendClose = document.querySelector('.main .add-friend-close');

    if(!addBtn || !overlay || !dropdown) return;

    function openMenu() {
        // 计算按钮在 main 内的位置
        let mainRect = document.querySelector('.main').getBoundingClientRect();
        let btnRect = addBtn.getBoundingClientRect();
        // 设置 overlay 可见
        overlay.classList.remove('hide');
        // 放置 dropdown 紧贴按钮下方
        let top = btnRect.bottom - mainRect.top + 6; // 6px margin
        let left = btnRect.left - mainRect.left;
        dropdown.style.top = top + 'px';
        dropdown.style.left = left + 'px';
    }

    function closeMenu() {
        overlay.classList.add('hide');
    }

    addBtn.onclick = function (e) {
        e.stopPropagation();
        openMenu();
    }

    // 点击遮罩空白处关闭
    overlay.onclick = function (event) {
        if(event.target === overlay) {
            closeMenu();
        }
    }

    // esc 键关闭菜单或模态框
    document.addEventListener('keydown', function (event) {
        if(event.key === 'Escape') {
            if(!overlay.classList.contains('hide')) closeMenu();
            if(addFriendModal && !addFriendModal.classList.contains('hide')) addFriendModal.classList.add('hide');
        }
    });

    // 点击添加好友项 -> 关闭小窗口并打开添加好友模态框
    addFriendItem.onclick = function () {
        closeMenu();
        if(addFriendModal) addFriendModal.classList.remove('hide');
    }

    // 发起群聊，目前仅关闭菜单（后续可扩展）
    createGroupItem.onclick = function () {
        closeMenu();
        // TODO: 打开群聊创建流程
    }

    // 添加好友模态框关闭
    if(addFriendClose) {
        addFriendClose.onclick = function () {
            if(addFriendModal) addFriendModal.classList.add('hide');
        }
    }

    // 点击添加好友模态框遮罩关闭
    if(addFriendModal) {
        addFriendModal.onclick = function (event) {
            if(event.target === addFriendModal) addFriendModal.classList.add('hide');
        }
    }
}

initFriendSearch();
initAddMenu();

function sendByEnter() {
    let messageInput = document.querySelector('.right .message-input');
    messageInput.addEventListener('keydown', function(event) {
        if(event.key === 'Enter') {
            if(event.shiftKey) {
                return;
            }else{
                event.preventDefault(); // 阻止默认换行行为
                document.querySelector('.right .ctrl button').click(); // 触发发送按钮点击事件
            }
        }
    });
}
sendByEnter();