package com.gloss.chatroom.mapper;

import com.gloss.chatroom.model.Message;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MessageMapper {
    /**
     * 根据会话ID查询最后一条消息
     * @param sessionId 会话ID
     * @return 最后一条消息内容
     */
    String getLastMessageBySessionId(Integer sessionId);

    /**
     * 根据会话ID查询所有消息
     * @param sessionId 会话ID
     * @return 会话中的所有消息列表
     */
    List<Message> getMessagesBySessionId(Integer sessionId);

    /**
     * 添加一条消息
     * @param message 消息对象
     */
    void addMessage(Message message);
}
