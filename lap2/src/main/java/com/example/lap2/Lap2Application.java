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

    // Bài 2: RequestParam
    @GetMapping("/greet")
    public String greet(@RequestParam String name) {
        return "Xin chào " + name;
    }

    // Bài 2: Search
    @GetMapping("/students/search")
    public String search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page) {

        return "keyword=" + keyword + ", page=" + page;
    }

    // Bài 3: PathVariable
    @GetMapping("/student/{id}")
    public String getStudentById(@PathVariable int id) {
        return "Sinh viên có mã: " + id;
    }

    // Bài 4: Trả về JSON Object
    @GetMapping("/student")
    public Student getStudent() {
        return new Student(1, "Nguyễn Văn A", 20);
    }

    // Bài 5: Trả về danh sách Student
    @GetMapping("/students")
    public List<Student> getStudents() {

        List<Student> list = new ArrayList<>();

        list.add(new Student(1, "A", 20));
        list.add(new Student(2, "B", 21));

        return list;
    }
}