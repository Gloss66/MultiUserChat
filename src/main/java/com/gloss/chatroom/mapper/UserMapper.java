package com.gloss.chatroom.mapper;

import com.gloss.chatroom.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    /**
     * 插入信息
     * @param user
     * @return int
     */
    int insert(User user);

    /**
     * 查询信息
     * @param userName
     * @return User
     */
    User selectByUserName(String userName);

}
