package com.example.lap3.repository;

import com.example.lap3.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    
    // Thêm hàm tìm kiếm sinh viên theo tên (không phân biệt chữ hoa/thường)
    List<Student> findByNameContainingIgnoreCase(String keyword);
    
}