package com.gloss.chatroom.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gloss.chatroom.component.OnlineUserManager;
import com.gloss.chatroom.mapper.MessageMapper;
import com.gloss.chatroom.mapper.SessionMapper;
import com.gloss.chatroom.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;

@Component
public class WebSocketController extends TextWebSocketHandler {
    @Autowired
    private OnlineUserManager onlineUserManager;
    @Autowired
    private SessionMapper sessionMapper;
    @Autowired
    private MessageMapper messageMapper;

    private ObjectMapper objectMapper = new ObjectMapper();

    /**
     *  连接成功时,将用户ID和会话记录到在线用户管理器中
     * @param session WebSocket会话
     * @throws Exception 连接失败时抛出异常
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("[Websocket] 连接成功!");
        User user = (User)session.getAttributes().get("user");
        if(user==null){
            System.out.println("[Websocket] 连接用户失败,用户未登录!");
            return;
        }
        System.out.println("[Websocket] 连接用户: " + user.getUserName());
        onlineUserManager.online(user.getUserId(),session);
    }

    /**
     *  处理websocket接收到的文本消息
     * @param session WebSocket会话
     * @param message 文本消息
     * @throws Exception 处理消息失败时抛出异常
     */
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("[Websocket] 收到消息: " + message);
        User user= (User)session.getAttributes().get("user");
        if(user==null){
            return;
        }
        MessageRequest messageRequest = objectMapper.readValue(message.getPayload(), MessageRequest.class);
        if(messageRequest.getType().equals("message")){
            transferMessage(user,messageRequest);
        }else{
            System.out.println("[Websocket] 收到非message消息类型: " + messageRequest.getType());
        }
    }

    /**
     *  转发消息给目标会话
     * @param fromUser 发送消息的用户
     * @param req 消息请求对象,包含目标会话ID和消息内容
     */
    public void transferMessage(User fromUser, MessageRequest req) throws IOException {
        MessageResponse res = new MessageResponse();
        res.setType(req.getType());
        res.setFromId(fromUser.getUserId());
        res.setFromName(fromUser.getUserName());
        res.setSessionId(req.getSessionId());
        res.setContent(req.getContent());
        String respJson = objectMapper.writeValueAsString(res);
        System.out.println("[Websocket] 转发消息: " + respJson);
        //根据sessionId获取一个会话中除发送消息的用户以外的所有用户
        List<Friend> friends = sessionMapper.getFriendsBySessionId(req.getSessionId(), fromUser.getUserId());
        // 给发送消息的用户也转发一次消息,则将其添加到列表中
        friends.add(new Friend(fromUser.getUserId(),fromUser.getUserName()));
        // 遍历每个好友,将消息转发给他们
        for(Friend friend : friends){
            WebSocketSession webSocketSession = onlineUserManager.getSession(friend.getFriendId());
            if(webSocketSession==null){
                //若用户不在,则不转发消息
                System.out.println("[Websocket] 用户 " + friend.getFriendName() + " 不在线,将消息转存入历史消息!");
                continue;
            }
            webSocketSession.sendMessage(new TextMessage(respJson));
        }
        //将转发的消息存入message数据库
        Message message = new Message();
        message.setFromId(fromUser.getUserId());
        message.setSessionId(req.getSessionId());
        message.setContent(req.getContent());
        System.out.println("[Websocket] 存储消息: " + message.getContent().replaceAll("\n","\\\\n"));
        messageMapper.addMessage(message);
    }

    /**
     *  连接关闭时,将用户ID和会话从在线用户管理器中移除
     * @param session WebSocket会话
     * @param status 关闭状态
     * @throws Exception 关闭连接失败时抛出异常
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("[Websocket] 连接关闭! "+status.getReason());
        User user = (User)session.getAttributes().get("user");
        if(user==null){
            return;
        }
        onlineUserManager.offline(user.getUserId(),session);
    }

    /**
     *  处理websocket传输错误时,将用户ID和会话从在线用户管理器中移除
     * @param session WebSocket会话
     * @param exception 传输错误异常
     * @throws Exception 处理错误失败时抛出异常
     */
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.out.println("[Websocket] 连接异常!" + exception.getMessage());
        User user = (User)session.getAttributes().get("user");
        if(user==null){
            return;
        }
        onlineUserManager.offline(user.getUserId(),session);
    }
}
