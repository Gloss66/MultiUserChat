create database if not exists java_chatroom charset utf8;

use java_chatroom;

-- 用户表
drop table if exists user;
create table user(
    `id` int primary key auto_increment,
    `username` varchar(20) unique NOT NULL,
    `password` varchar(20) NOT NULL,
    `delete_flag` TINYINT (4) NULL DEFAULT 0,
    `create_time` DATETIME DEFAULT now(),
    `update_time` DATETIME DEFAULT now() ON UPDATE now()
);

insert into user(id,username,password) values(1,'zhangsan','123456'),(2,'lisi','456789');
-- -------------------------------------------------------
-- 好友表
drop table if exists friend;
create table friend(
    `userId` int NOT NULL ,
    `friendId` int NOT NULL,
    `delete_flag` TINYINT (4) NULL DEFAULT 0,
    `create_time` DATETIME DEFAULT now(),
    `update_time` DATETIME DEFAULT now() ON UPDATE now()
);

insert into friend(userId,friendId) values(1,2),(2,1);
insert into friend(userId,friendId) values(1,3),(3,1);
-- -------------------------------------------------------
-- 会话表
drop table if exists session;
create table session(
    `sessionId` int primary key auto_increment,
    -- 上次会话时间
    `lastTime` datetime,
    `delete_flag` TINYINT (4) NULL DEFAULT 0,
    `create_time` DATETIME DEFAULT now(),
    `update_time` DATETIME DEFAULT now() ON UPDATE now()
);
insert into session(sessionId,lastTime) values(1,'2023-01-01 00:00:00');
insert into session(sessionId,lastTime) values(2,'2023-01-02 00:00:00');
-- -------------------------------------------------------
-- 会话和用户关联表
drop table if exists session_user;
create table session_user(
    `sessionId` int NOT NULL,
    `userId` int NOT NULL,
    `delete_flag` TINYINT (4) NULL DEFAULT 0,
    `create_time` DATETIME DEFAULT now(),
    `update_time` DATETIME DEFAULT now() ON UPDATE now()
);
insert into session_user(sessionId,userId) values(1,1),(1,2);
insert into session_user(sessionId,userId) values(2,2),(2,3);

# insert into session(sessionId,lastTime) values(10,'2023-01-02 00:00:00');
# insert into session_user(sessionId,userId) values(10,1),(10,15);
# insert into session(sessionId,lastTime) values(11,'2023-01-02 00:00:00');
# insert into session_user(sessionId,userId) values(11,1),(11,16);
# insert into session(sessionId,lastTime) values(12,'2023-01-02 00:00:00');
# insert into session_user(sessionId,userId) values(12,1),(12,17);
# insert into session(sessionId,lastTime) values(13,'2023-01-02 00:00:00');
# insert into session_user(sessionId,userId) values(13,1),(13,18);
#
# insert into session(sessionId,lastTime) values(8,'2023-01-02 00:00:00');
# insert into session_user(sessionId,userId) values(8,1),(8,13);
# insert into session(sessionId,lastTime) values(9,'2023-01-02 00:00:00');
# insert into session_user(sessionId,userId) values(9,1),(9,14);

# insert into friend(userId,friendId) values(1,12),(12,1);
# insert into friend(userId,friendId) values(1,10),(10,1);
# insert into friend(userId,friendId) values(1,6),(6,1);
# insert into friend(userId,friendId) values(1,13),(13,1);
# insert into friend(userId,friendId) values(1,8),(8,1);
# insert into friend(userId,friendId) values(1,14),(14,1);
# insert into friend(userId,friendId) values(1,15),(15,1);
# insert into friend(userId,friendId) values(1,16),(16,1);
# insert into friend(userId,friendId) values(1,17),(17,1);
# insert into friend(userId,friendId) values(1,18),(18,1);

-- -------------------------------------------------------
-- 消息表
drop table if exists message;
create table message(
    `messageId` int primary key auto_increment,
    `fromId` int,
    `sessionId` int,
    `content` varchar(2048),
    `postTime` DATETIME DEFAULT now(),
    `delete_flag` TINYINT (4) NULL DEFAULT 0,
    `create_time` DATETIME DEFAULT now(),
    `update_time` DATETIME DEFAULT now() ON UPDATE now()
);

insert into message(fromId,sessionId,content) values(1,1,'你好');
insert into message(fromId,sessionId,content) values(2,1,'你好');
insert into message(fromId,sessionId,content) values(1,1,'我是张三');
insert into message(fromId,sessionId,content) values(2,1,'我是李四');

insert into message(fromId,sessionId,content) values(1,1,'一起玩游戏吗?');
insert into message(fromId,sessionId,content) values(2,1,'好哇,那什么时候玩?');
insert into message(fromId,sessionId,content) values(1,1,'今晚8点钟');
insert into message(fromId,sessionId,content) values(2,1,'OK,那就今晚8点玩');
