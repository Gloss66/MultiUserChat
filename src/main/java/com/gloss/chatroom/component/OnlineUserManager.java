package com.gloss.chatroom.component;

import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

@Component
@Data
public class OnlineUserManager {
    private ConcurrentHashMap<Integer, WebSocketSession> sessions = new ConcurrentHashMap<>();

    /**
     *  用户上线,记录用户Id和 WebsocketSession
     * @param userId  用户ID
     * @param session WebSocket会话
     */
    public void online(Integer userId,WebSocketSession session){
        if(sessions.get(userId) != null){
            System.out.println("[OnlineUserManager] 用户 " + userId + " 已上线,不可重复登录!");
            return;
        }
        sessions.put(userId,session);
        System.out.println("[OnlineUserManager] 用户 " + userId + " 上线!");
    }

    /**
     *  用户下线,根据用户ID和WebSocket会话删除记录
     * @param userId  用户ID
     * @param session WebSocket会话
     */
    public void offline(Integer userId,WebSocketSession session){
        WebSocketSession existSession = sessions.get(userId);
//       处理多开失败导致的websocket会话误删的情况
        if(existSession == session){
            sessions.remove(userId);
            System.out.println("[OnlineUserManager] 用户 " + userId + " 下线!");
        }
    }

    /**
     * 根据用户ID获取对应的WebSocket会话
     * @param userId 用户ID
     * @return WebSocket会话
     */
    public WebSocketSession getSession(Integer userId){
        return sessions.get(userId);
    }
}
