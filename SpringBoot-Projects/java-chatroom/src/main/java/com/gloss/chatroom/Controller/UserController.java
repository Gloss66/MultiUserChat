package com.gloss.chatroom.Controller;

import com.gloss.chatroom.mapper.SessionMapper;
import com.gloss.chatroom.mapper.UserMapper;
import com.gloss.chatroom.model.Response;
import com.gloss.chatroom.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
public class UserController {
    @Autowired
    UserMapper userMapper;
    @Autowired
    Response response;
    @Autowired
    private SessionMapper sessionMapper;

    @RequestMapping(value="/login")
    public Object login(String userName, String passWord, HttpServletRequest request) {
        User user = userMapper.selectByUserName(userName);
//        密码不正确或user为空,则登录失败
        if(user == null|| !passWord.equals(user.getPassWord())) {
            return response.put(Arrays.asList("userId","userName")
                    ,Arrays.asList(0,""));
        }
        HttpSession session = request.getSession(true);
        session.setAttribute("user", user);
        return response.put(Arrays.asList("userId","userName")
                ,Arrays.asList(user.getUserId(),user.getUserName()));
    }

    @RequestMapping(value = "/register")
    public Object register(String userName, String passWord) {
        if(userName.isEmpty() || passWord.isEmpty()) {
            return new Response().put("Error","Username or password is null");
        }
        User user = new User();
        try{
            user.setPassWord(passWord);
            user.setUserName(userName);
            int insert = userMapper.insert(user);
            System.out.println("注册:"+insert);
        } catch (DuplicateKeyException e) {
            return  new Response().put("Error","Username is exist");
        }
        System.out.println(response);
        return response.put(Arrays.asList("userId","userName")
                ,Arrays.asList(user.getUserId(),user.getUserName()));
    }

    @RequestMapping(value = "/userInfo")
    public Object getUserInfo(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if(session == null) {
            System.out.println("[getUserInfo] 当前session对象为空!");
            return new User();
        }
        User user = (User) session.getAttribute("user");
        if(user == null) {
            System.out.println("[getUserInfo] 当前user对象为空!");
            return new User();
        }
        return response.put(Arrays.asList("userId","userName")
                ,Arrays.asList(user.getUserId(),user.getUserName()));
    }

}











