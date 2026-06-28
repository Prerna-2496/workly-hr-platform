package com.hrplatform.hr_platform.module.employee.controller;

import com.hrplatform.hr_platform.module.employee.dto.EmployeeRequest;
import com.hrplatform.hr_platform.module.employee.entity.Employee;
import com.hrplatform.hr_platform.module.employee.service.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Employee> addEmployee(
            @Valid @RequestBody EmployeeRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(employeeService.addEmployee(req, tenantId));
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees(
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(employeeService.getAllEmployees(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(employeeService.getEmployee(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(employeeService.updateEmployee(id, req, tenantId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateEmployee(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        employeeService.deactivateEmployee(id, tenantId);
        return ResponseEntity.ok("Employee deactivated successfully");
    }
}