package com.gloss.chatroom.Controller;

import com.gloss.chatroom.mapper.MessageMapper;
import com.gloss.chatroom.mapper.SessionMapper;
import com.gloss.chatroom.model.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import java.util.ArrayList;
import java.util.List;

@RestController
public class SessionController {
    @Autowired
    SessionMapper sessionMapper;
    @Autowired
    MessageMapper messageMapper;
    @Autowired
    Response response;

    @RequestMapping(value="/sessionList")
    public List<Session> getSessionList(HttpServletRequest request){
        List<Session> sessionList = new ArrayList<>();
        HttpSession httpSession = request.getSession(false);
        if(httpSession == null){
            System.out.println("[getSessionList] 当前session不存在!");
            return sessionList;
        }
        User user = (User) httpSession.getAttribute("user");
        if(user == null){
            System.out.println("[getSessionList] 当前session中用户信息不存在!");
            return sessionList;
        }
        // 查询用户所有会话ID
        List<Integer> sessionIdList = sessionMapper.getSessionIdsByUserId(user.getUserId());
        // 遍历每个会话,获取相关信息
        for(Integer sessionId : sessionIdList){
            Session session = new Session();
            session.setSessionId(sessionId);
            // 查询会话的对话好友
            List<Friend> friends = sessionMapper.getFriendsBySessionId(sessionId,user.getUserId());
            session.setFriends(friends);
            // 查询每个会话最后一条信息
            String lastMessage = messageMapper.getLastMessageBySessionId(sessionId);
            if(lastMessage == null){
                session.setLastMessage("");
            }else{
                session.setLastMessage(lastMessage);
            }
            // 将每条会话放入会话列表
            sessionList.add(session);
        }
        return sessionList;
    }

    @RequestMapping(value="/session")
    @Transactional
    public Object createSession(Integer toUserId, @SessionAttribute("user") User user){
        Session session = new Session();
        sessionMapper.createSession(session);
        SessionUserItem item1 = new SessionUserItem();
        item1.setUserId(user.getUserId());
        item1.setSessionId(session.getSessionId());
        sessionMapper.createSessionUser(item1);
        SessionUserItem item2 = new SessionUserItem();
        item2.setUserId(toUserId);
        item2.setSessionId(session.getSessionId());
        sessionMapper.createSessionUser(item2);
        return response.put("sessionId",session.getSessionId());
    }

    @RequestMapping(value="/updateLastTime")
    @Transactional
    public Object updateLastTime(Integer toUserId, @SessionAttribute("user") User user){
        sessionMapper.updateLastTime(user.getUserId(), toUserId);
        return response.put("success", true);
    }
}
