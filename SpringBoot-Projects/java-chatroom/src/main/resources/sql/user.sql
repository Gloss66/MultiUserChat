create database if not exists java_chatroom charset utf8;

use java_chatroom;

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
