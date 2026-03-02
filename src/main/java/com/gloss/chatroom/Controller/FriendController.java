package com.gloss.chatroom.Controller;

import com.gloss.chatroom.mapper.FriendMapper;
import com.gloss.chatroom.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
public class FriendController {
    @Autowired
    FriendMapper friendMapper;
    @RequestMapping(value = "/friendList")
    public Object getFriendList(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            System.out.println("[getFriendList] 当前session对象不存在!");
            return new ArrayList<>();
        }
        User user = (User) session.getAttribute("user");
        if (user == null){
            System.out.println("[getFriendList] 当前session对象中user不存在!");
            return new ArrayList<>();
        }
        return friendMapper.selectFriendList(user.getUserId());
    }
}
