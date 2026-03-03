package com.gloss.chatroom.mapper;

import com.gloss.chatroom.model.Friend;
import com.gloss.chatroom.model.Session;
import com.gloss.chatroom.model.SessionUserItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SessionMapper {
    /**
     * 查询用户所有会话ID
     * @param userId 用户id
     * @return 会话ID
     */
    List<Integer> getSessionIdsByUserId(Integer userId);

    /**
     * 查询会话中的好友
     * @param sessionId 会话id
     * @param selfUserId 查询者的用户id
     * @return 会话中的好友
     */
    List<Friend> getFriendsBySessionId(Integer sessionId, Integer selfUserId);

    /**
     * 创建会话
     * @param session 会话对象
     * @return 插入操作的影响行数
     */
    int createSession(Session session);

    /**
     * 新建会话和用户关联记录
     * @param sessionUserItem 会话用户关联记录
     */
    void createSessionUser(SessionUserItem sessionUserItem);

    /**
     * 更新会话的最后活跃时间
     * @param sessionId 会话id
     */
    void updateLastTime(Integer sessionId);
}
