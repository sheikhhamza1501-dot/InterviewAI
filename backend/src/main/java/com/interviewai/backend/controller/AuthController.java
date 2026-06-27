package com.interviewai.backend.controller;

import com.interviewai.backend.dto.RegisterRequest;
import com.interviewai.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return userService.register(request);

    }
}
