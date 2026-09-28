package com.example.lap3.controller;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.example.lap3.entity.Student;
import com.example.lap3.service.StudentService;

@Controller
@RequestMapping("/students")
public class StudentWebController {

    @Autowired
    private StudentService studentService;

    // 1. Xem danh sách & Tìm kiếm
    @GetMapping
    public String showStudentPage(@RequestParam(required = false) String keyword, Model model) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            model.addAttribute("students", studentService.search(keyword));
        } else {
            model.addAttribute("students", studentService.getAll());
        }
        model.addAttribute("keyword", keyword);
        return "students";
    }

    // 2. Mở form Thêm mới
    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("student", new Student());
        return "student-add";
    }

    // 3. Xử lý lưu Thêm mới hoặc Cập nhật (Đã sửa lỗi 500 ép kiểu UUID)
    @PostMapping("/save")
    public String saveStudent(@ModelAttribute("student") Student student) {
        // Tự tạo UUID mới nếu là tạo mới sinh viên (id bị null)
        if (student.getId() == null) {
            student.setId(UUID.randomUUID());
        }
        studentService.save(student);
        return "redirect:/students";
    }

    // 4. Mở form Sửa
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable UUID id, Model model) {
        model.addAttribute("student", studentService.getById(id));
        return "student-edit";
    }

    // 5. Xem chi tiết
    @GetMapping("/detail/{id}")
    public String showDetail(@PathVariable UUID id, Model model) {
        model.addAttribute("student", studentService.getById(id));
        return "student-detail";
    }

    // 6. Xóa sinh viên
    @GetMapping("/delete/{id}")
    public String deleteStudent(@PathVariable UUID id) {
        studentService.delete(id);
        return "redirect:/students";
    }
}