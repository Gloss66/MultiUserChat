package com.gloss.chatroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.annotations.ConstructorArgs;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {
    private Integer userId;
    private String userName;
    private String passWord;
//    private Integer deleteFlag;
//    private String createTime;
//    private String updateTime;
}
