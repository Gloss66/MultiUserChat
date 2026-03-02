package com.gloss.chatroom.mapper;

import com.gloss.chatroom.model.Friend;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface FriendMapper {
    List<Friend> selectFriendList(Integer userId);
}
