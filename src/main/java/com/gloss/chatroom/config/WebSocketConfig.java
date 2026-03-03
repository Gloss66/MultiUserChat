package com.gloss.chatroom.config;

import com.gloss.chatroom.controller.TestWebSocketController;
import com.gloss.chatroom.controller.WebSocketController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Autowired
    private TestWebSocketController testWebSocketController;

    @Autowired
    private WebSocketController webSocketController;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(testWebSocketController, "/test");
        registry.addHandler(webSocketController, "/websocket")
//                注册HttpSession拦截器,可将HttpSession中的attribute键值对拷贝到WebsocketSession
                .addInterceptors(new HttpSessionHandshakeInterceptor());
    }
}
