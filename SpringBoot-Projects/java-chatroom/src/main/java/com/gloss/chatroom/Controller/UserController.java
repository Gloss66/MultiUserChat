package com.gloss.chatroom.Controller;

import com.gloss.chatroom.mapper.UserMapper;
import com.gloss.chatroom.model.Response;
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
    @Autowired
    UserMapper userMapper;
    @Autowired
    Response response;

    @RequestMapping(value="/login")
    public Object login(String userName, String passWord, HttpServletRequest request) {
        User user = userMapper.selectByUserName(userName);
        if(user == null|| !passWord.equals(user.getPassWord())) {
            response.newMap();
            response.put("userId", 0);
            response.put("userName", "");
            return response.getMap();
        }
        HttpSession session = request.getSession(true);
        session.setAttribute("user", user);
        response.newMap();
        response.put("userId", user.getUserId());
        response.put("userName", user.getUserName());
        return response.getMap();
    }

    @RequestMapping(value = "/register")
    public Object register(String username, String passWord) {
        if(username.isEmpty() || passWord.isEmpty()) {
            return new Response().put("Error","Username or password is null");
        }
        User user = new User();
        try{
            user.setPassWord(passWord);
            user.setUserName(username);
            int insert = userMapper.insert(user);
            System.out.println("注册:"+insert);
        } catch (DuplicateKeyException e) {
            return  new Response().put("Error","Username is exist");
        }
        System.out.println(response);
        response.newMap();
        response.put("userId", user.getUserId());
        response.put("userName", user.getUserName());
        return response.getMap();
    }

}











