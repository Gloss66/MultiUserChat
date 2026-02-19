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
---------------------------------------------------------
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
---------------------------------------------------------
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
---------------------------------------------------------
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


