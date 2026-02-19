// 实现标签页切换 //
function initSwitchTab() {
    let tabSession = document.querySelector('.tab .tab-session');
    let tabFriend = document.querySelector('.tab .tab-friend');
    //lists为数组,第一个元素使会话列表,第二个元素是好友列表
    let lists = document.querySelectorAll('.list');
    tabSession.onclick = function () {
        tabSession.style.backgroundImage = 'url(img/session.png)';
        tabFriend.style.backgroundImage = 'url(img/friend-gray.png)';
        // lists[0].classList = 'list';
        // lists[1].classList = 'list hide';
        lists[0].classList.remove('hide');
        lists[1].classList.add('hide');
    }
    tabFriend.onclick = function () {
        tabSession.style.backgroundImage = 'url(img/session-gray.png)';
        tabFriend.style.backgroundImage = 'url(img/friend.png)';
        // lists[0].classList = 'list hide';
        // lists[1].classList = 'list';
        lists[0].classList.add('hide');
        lists[1].classList.remove('hide');
    }
}

initSwitchTab();

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
    activeSession(allLis,currentLi);
    // 获取被点击会话的历史消息 TODO
    let sessionId = currentLi.getAttribute('session-id');
    getHistoryMessage(sessionId);
}

function activeSession(allLis, currentLi) {
    for(let li of allLis) {
        if(li == currentLi) {
            li.className = 'active';
        } else {
            li.className = '';
        }
    }
}

function getHistoryMessage(sessionId) {

}
