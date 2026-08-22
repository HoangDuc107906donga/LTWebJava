package com.example.lap3.controller;

import com.example.lap3.entity.Student;
import com.example.lap3.repository.StudentRepository;
import com.example.lap3.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    // 1. Trang danh sách + Tìm kiếm theo tên
    @GetMapping("/students")
    public String listStudents(@RequestParam(value = "keyword", required = false) String keyword, Model model) {
        List<Student> students;
        if (keyword != null && !keyword.trim().isEmpty()) {
            students = studentRepository.findByNameContainingIgnoreCase(keyword);
        } else {
            students = studentService.getAllStudents();
        }
        model.addAttribute("students", students);
        model.addAttribute("keyword", keyword);

        return "students";
    }

    // 2. Trang xem chi tiết sinh viên
    @GetMapping("/students/{id}")
    public String viewStudent(@PathVariable("id") int id, Model model) {
        Student student = studentRepository.findById(id).orElse(null);
        model.addAttribute("student", student);
        return "student-detail";
    }
}