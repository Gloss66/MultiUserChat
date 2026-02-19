package com.gloss.chatroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
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
     * @param key
     * @param value
     * @return ConcurrentHashMap<String, Object>
     */
    public ConcurrentHashMap<String, Object> put(String key, Object value){
        map.put(key,value);
        return map;
    }

    /**
     * 多参数
     * @param list1
     * @param list2
     * @return ConcurrentHashMap<String, Object>
     */
    public ConcurrentHashMap<String, Object> put(List<String> list1, List<?> list2){
        newMap();
        for (int i = 0; i < list1.size(); i++) {
            map.put(list1.get(i),list2.get(i));
        }
        return map;
    }

    /**
     *
     * 为对象创建新的map容器
     * @return
     */
    public void newMap(){
        map = new ConcurrentHashMap<>();
    }
}


