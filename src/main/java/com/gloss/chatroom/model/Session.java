package com.gloss.chatroom.model;

import lombok.Data;
import java.util.List;

@Data
public class Session {
    private Integer sessionId;
    private List<Friend> friends;
    private String lastMessage;
}
