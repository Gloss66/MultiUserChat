package com.gloss.chatroom.controller;

import com.gloss.chatroom.mapper.MessageMapper;
import com.gloss.chatroom.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
public class MessageController {
    @Autowired
    private MessageMapper messageMapper;

    @RequestMapping(value="/message")
    public Object getMessages(Integer sessionId) {
        List<Message> messages = messageMapper.getMessagesBySessionId(sessionId);
        Collections.reverse(messages);
        return messages;
    }
}
