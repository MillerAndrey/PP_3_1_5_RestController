package ru.kata.spring.boot_security.demo.service.imp;


import ru.kata.spring.boot_security.demo.model.User;


import java.util.List;


public interface UserService {


    List<User> getAllUsers();

    User show(long id);

    void save(User user);

    void update(User updateUser);

    void delete(Long id);

    User findByUserName(String username);

}
