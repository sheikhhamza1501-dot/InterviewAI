package com.interviewai.backend.controller;

import com.interviewai.backend.dto.UpdateProfileRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.interviewai.backend.dto.UserProfileResponse;
import com.interviewai.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/api/user/profile")
    public UserProfileResponse getProfile() {
        return userService.getProfile();
    }
    @PutMapping("/api/user/profile")
    public UserProfileResponse updateProfile(@RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(request);
    }
}
