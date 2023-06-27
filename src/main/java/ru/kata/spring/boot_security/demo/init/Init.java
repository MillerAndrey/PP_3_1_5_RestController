package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.imp.UserService;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class Init {

    private UserService userService;

    @Autowired
    public Init(UserService userService) {
        this.userService = userService;
    }

    @PostConstruct
    private void postConstruct() {
        Role ROLE_ADMIN = new Role(1L, "ROLE_ADMIN");
        Role ROLE_USER = new Role(2L,"ROLE_USER");
        User admin = new User("admin", "admin", (byte) 23, "admin",
                new HashSet<>(Arrays.asList(ROLE_ADMIN,ROLE_USER)),"admin@mail.ru");
        User user = new User("user", "user", (byte) 26, "user",
                new HashSet<>(List.of(ROLE_USER)),"user@mail.ru");
        if (userService.findByUserName(admin.getEmail()) == null) {
            userService.save(admin);
        }
        if (userService.findByUserName(user.getEmail()) == null) {
            userService.save(user);
        }
    }

}
