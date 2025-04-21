package com.ecommerce.backend.controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        
        return "login"; // This will render home.html from templates folder
    }

    @GetMapping("/forgotpassword")
    public String about() {
        
        return "forgot-password"; // This will render about.html
    }

    @GetMapping("/dashboard")
    public String contact() {
        
        return "dashboard"; // This will render contact.html
    }
}
