# MultiUserChat
多用户聊天网页程序

项目演示网址：https://web.sutaiyu.site:12345/login.html
## 项目简介

Java-chatroom 是一个基于 Spring Boot 开发的实时聊天系统，支持用户注册、登录、好友管理、实时消息发送等功能。该项目采用分层架构设计，结合 WebSocket 技术实现实时通信，为用户提供流畅的聊天体验。

## 功能特点

- **用户管理**：支持用户注册、登录、登出功能
- **好友管理**：实现好友的添加、查询等操作
- **会话管理**：创建和管理用户间的聊天会话
- **实时消息**：基于 WebSocket 实现实时消息推送
- **在线状态**：跟踪用户在线状态，确保消息准确送达
- **消息历史**：存储和查询聊天历史记录

## 技术栈

- **后端**：Spring Boot、MyBatis、WebSocket
- **前端**：HTML、CSS、JavaScript
- **数据库**：关系型数据库（通过 SQL 脚本初始化）

## 项目结构

```
Java-chatroom/
├── src/
│   ├── main/
│   │   ├── java/com/gloss/chatroom/
│   │   │   ├── Controller/       # 控制器层
│   │   │   │   ├── FriendController.java
│   │   │   │   ├── MessageController.java
│   │   │   │   ├── SessionController.java
│   │   │   │   ├── UserController.java
│   │   │   │   └── WebSocketController.java
│   │   │   ├── Config/           # 配置类
│   │   │   │   └── WebSocketConfig.java
│   │   │   ├── Manager/          # 管理器
│   │   │   │   └── OnlineUserManager.java
│   │   │   ├── Mapper/           # 数据访问层
│   │   │   │   ├── FriendMapper.java
│   │   │   │   ├── MessageMapper.java
│   │   │   │   ├── SessionMapper.java
│   │   │   │   └── UserMapper.java
│   │   │   ├── Model/            # 数据模型
│   │   │   │   ├── Friend.java
│   │   │   │   ├── Message.java
│   │   │   │   ├── Session.java
│   │   │   │   ├── SessionUserItem.java
│   │   │   │   └── User.java
│   │   │   └── Service/          # 服务层
│   │   │       ├── FriendService.java
│   │   │       ├── MessageService.java
│   │   │       ├── SessionService.java
│   │   │       └── UserService.java
│   │   ├── resources/
│   │   │   ├── mapper/           # MyBatis 映射文件
│   │   │   │   ├── FriendMapper.xml
│   │   │   │   ├── MessageMapper.xml
│   │   │   │   ├── SessionMapper.xml
│   │   │   │   └── UserMapper.xml
│   │   │   ├── static/           # 静态资源
│   │   │   │   ├── css/
│   │   │   │   ├── js/
│   │   │   │   ├── client.html   # 聊天页面
│   │   │   │   ├── login.html    # 登录页面
│   │   │   │   └── register.html # 注册页面
│   │   │   ├── application.properties # 应用配置
│   │   │   └── db.sql            # 数据库初始化脚本
│   └── test/                     # 测试代码
├── pom.xml                       # Maven 依赖配置
└── README.md                     # 项目说明文档
```

## 安装与运行

### 环境要求

- JDK 1.8+
- Maven 3.0+
- 关系型数据库（如 MySQL）

### 安装步骤

1. **克隆项目**：

   ```bash
   git clone <项目地址>
   cd Java-chatroom
   ```

2. **配置数据库**：

    - 创建数据库（如 `chatroom`）
    - 执行 `src/main/resources/db.sql` 脚本初始化表结构

3. **修改配置**：

    - 编辑 `src/main/resources/application.properties` 文件，配置数据库连接信息

4. **编译项目**：

   ```bash
   mvn clean package
   ```

5. **运行项目**：

   ```bash
   nohup java -jar MutiUserChat-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
   ```

6. **访问应用**：

    - 浏览器本地访问 `http://localhost:12345/login.html` 

    - 浏览器远程访问 `http://<服务器IP>:12345/login.html`
## 使用说明

### 1. 用户注册

- 访问 `http://localhost:12345/register.html`
- 填写用户名、密码等信息进行注册

### 2. 用户登录

- 访问 `http://localhost:12345/login.html`
- 输入用户名和密码进行登录

### 3. 聊天功能

- 登录后进入聊天页面，可查看会话列表和好友列表
- 点击会话进入聊天界面，发送和接收消息
- 支持实时消息推送，无需刷新页面

### 4. 好友管理

- 在好友列表中添加新好友
- 查看已添加的好友列表

### 5. 登出系统

- 点击页面中的登出按钮，系统会销毁会话并返回登录页面

## 数据库设计

### 核心表结构

1. **user 表**：存储用户信息
    - id: 用户ID
    - username: 用户名
    - password: 密码
    - ...

2. **friend 表**：存储好友关系
    - id: 好友关系ID
    - userId: 用户ID
    - friendId: 好友ID
    - ...

3. **session 表**：存储聊天会话
    - sessionId: 会话ID
    - lastTime: 最后消息时间
    - ...

4. **session_user 表**：存储会话与用户的关联
    - sessionId: 会话ID
    - userId: 用户ID
    - ...

5. **message 表**：存储消息记录
    - messageId: 消息ID
    - sessionId: 会话ID
    - fromId: 发送者ID
    - content: 消息内容
    - postTime: 发送时间
    - ...

## 核心功能实现

### 1. 实时消息

- 使用 WebSocket 实现服务器与客户端的双向通信
- 通过 `WebSocketController` 处理消息的接收和发送
- 使用 `OnlineUserManager` 管理在线用户，确保消息准确送达

### 2. 会话管理

- 通过 `SessionController` 和 `SessionService` 处理会话的创建和管理
- 会话列表按最后消息时间排序，方便用户查看最新消息

### 3. 用户认证

- 登录时验证用户名和密码
- 登录成功后创建会话，存储用户信息
- 登出时调用 `session.invalidate()` 销毁会话，确保安全

## 注意事项

1. **数据库配置**：确保正确配置数据库连接信息，包括 URL、用户名和密码
2. **端口占用**：默认使用 12345 端口，如需修改请在 `application.properties` 中配置
3. **WebSocket 支持**：确保浏览器支持 WebSocket 功能
4. **安全考虑**：生产环境中建议添加 HTTPS 支持，增强安全性

## 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。