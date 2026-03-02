package com.gloss.chatroom.model;

import lombok.Data;

@Data
public class Message {
    private Integer messageId;
    private Integer fromId;
    private Integer sessionId;
    private String fromName;
    private String content;
}
