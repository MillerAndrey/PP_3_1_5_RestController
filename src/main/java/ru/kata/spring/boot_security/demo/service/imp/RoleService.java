package ru.kata.spring.boot_security.demo.service.imp;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {

    List<Role> findRoles();
}
