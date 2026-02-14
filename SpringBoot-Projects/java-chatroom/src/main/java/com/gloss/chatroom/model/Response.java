package com.gloss.chatroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class Response {
    private String key;
    private Object value;
    private ConcurrentHashMap<String,Object> map = new ConcurrentHashMap<>();

    /**
     * 单参数
     * @return
     */
    public ConcurrentHashMap<String,Object> put(){
        ConcurrentHashMap<String,Object> map = new ConcurrentHashMap<>();
        map.put(key,value);
        return map;
    }

    /**
     * 多参数
     * @param key
     * @param value
     * @return
     */
    public ConcurrentHashMap<String, Object> put(String key, Object value){
        map.put(key,value);
        return map;
    }

    public ConcurrentHashMap<String, Object> newMap(){
        map = new ConcurrentHashMap<>();
        return map;
    }
}

