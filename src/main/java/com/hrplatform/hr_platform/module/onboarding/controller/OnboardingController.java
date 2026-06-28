package com.hrplatform.hr_platform.module.onboarding.controller;

import com.hrplatform.hr_platform.module.onboarding.dto.CreateTaskRequest;
import com.hrplatform.hr_platform.module.onboarding.service.OnboardingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OnboardingController {

    private final OnboardingService onboardingService;

    // HR creates a task
    @PostMapping("/task")
    public ResponseEntity<?> createTask(
            @Valid @RequestBody CreateTaskRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(onboardingService.createTask(req, tenantId));
    }

    // Get all tasks for an employee
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getEmployeeTasks(
            @PathVariable Long employeeId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                onboardingService.getEmployeeTasks(employeeId, tenantId));
    }

    // Get progress for an employee
    @GetMapping("/employee/{employeeId}/progress")
    public ResponseEntity<?> getProgress(
            @PathVariable Long employeeId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                onboardingService.getProgress(employeeId, tenantId));
    }

    // Get all tasks (HR view)
    @GetMapping("/all")
    public ResponseEntity<?> getAllTasks(HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(onboardingService.getAllTasks(tenantId));
    }

    // Employee completes a task
    @PutMapping("/task/{taskId}/complete")
    public ResponseEntity<?> completeTask(
            @PathVariable Long taskId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                onboardingService.completeTask(taskId, tenantId));
    }

    // Auto-create default tasks for new employee
    @PostMapping("/employee/{employeeId}/setup")
    public ResponseEntity<?> setupDefaultTasks(
            @PathVariable Long employeeId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        onboardingService.createDefaultTasks(
                employeeId, tenantId, java.time.LocalDate.now());
        return ResponseEntity.ok("Default onboarding tasks created");
    }
}