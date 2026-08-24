package com.example.lap2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class Lap2Application {

    public static void main(String[] args) {
        SpringApplication.run(Lap2Application.class, args);
    }

    // Bài 1: Hello API
    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot API";
    }

    // Bài 2: PathVariable
    @GetMapping("/student/{id}")
    public String getStudent(@PathVariable int id) {
        return "Sinh viên có mã: " + id;
    }

    // Bài 3: RequestParam
    @GetMapping(value = "/student", params = "name")
    public String greet(@RequestParam String name) {
        return "Xin chào " + name;
    }

    // Bài 3: RequestParam tìm kiếm
    @GetMapping("/searchStudent")
    public String searchStudent(
            @RequestParam String name,
            @RequestParam(defaultValue = "1") int age) {

        return "Tên=" + name + ", tuổi=" + age;
    }

    // Bài 4A: Trả về JSON Object
    @GetMapping(value = "/student", params = "!name")
    public Student getStudent() {
        return new Student(1, "Nguyễn Văn A", 20);
    }

    // Bài 4B: Trả về danh sách
    @GetMapping("/studentall")
    public List<Student> getStudents() {

        List<Student> list = new ArrayList<>();

        list.add(new Student(1, "A", 20));
        list.add(new Student(2, "B", 21));

        return list;
    }

    // Bài 5: RequestHeader
    @GetMapping("/getstudent")
    public String getStudents(
            @RequestHeader("Authorization") String authorization) {

        return "Authorization = " + authorization;
    }

    // Đường dẫn phụ để xem trên Chrome
    @GetMapping("/getstudent-web")
    public String getStudentWeb() {
        return "Authorization = Bearer abc123";
    }
}