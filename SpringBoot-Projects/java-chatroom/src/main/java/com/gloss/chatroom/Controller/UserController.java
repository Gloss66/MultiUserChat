package com.gloss.chatroom.Controller;

import com.gloss.chatroom.mapper.UserMapper;
import com.gloss.chatroom.model.User;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Resource
    UserMapper userMapper;

    @RequestMapping(value="/login")
    public Object login(String userName, String passWord, HttpServletRequest request) {
        User user = userMapper.selectByUserName(userName);
        if(user == null|| !passWord.equals(user.getPassWord())) {
            return null;
        }
        HttpSession session = request.getSession(true);
        session.setAttribute("user", user);
        return user;
    }

    @RequestMapping(value = "/register")
    public Object register(String username, String passWord) {
        User user = new User();
        try{
            user.setPassWord(passWord);
            user.setUserName(username);
            int insert = userMapper.insert(user);
            System.out.println("注册:"+insert);
        } catch (DuplicateKeyException e) {
            user= new User();
        }
        return user;
    }

}











