package com.gloss.chatroom.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HTTPSConfig {
    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.setPort(8443); // 自定义 HTTPS 端口
        // 配置 HTTP 端口（如 80）并重定向到 HTTPS
        tomcat.addAdditionalTomcatConnectors(createHttpConnector());
        return tomcat;
    }

    private org.apache.catalina.connector.Connector createHttpConnector() {
        org.apache.catalina.connector.Connector connector = new org.apache.catalina.connector.Connector(
                org.apache.coyote.http11.Http11NioProtocol.class.getName());
        connector.setScheme("http");
        connector.setPort(80);  // HTTP 端口
        connector.setSecure(false);
        connector.setRedirectPort(8443);  // 重定向到 HTTPS 端口
        return connector;
    }
}
