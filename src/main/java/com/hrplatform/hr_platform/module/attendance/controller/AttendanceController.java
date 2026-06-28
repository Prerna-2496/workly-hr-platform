package com.hrplatform.hr_platform.module.attendance.controller;

import com.hrplatform.hr_platform.module.attendance.dto.ClockInRequest;
import com.hrplatform.hr_platform.module.attendance.service.AttendanceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    // Employee clocks in
    @PostMapping("/clock-in")
    public ResponseEntity<?> clockIn(
            @Valid @RequestBody ClockInRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                attendanceService.clockIn(req, tenantId));
    }

    // Employee clocks out
    @PutMapping("/clock-out/{employeeId}")
    public ResponseEntity<?> clockOut(
            @PathVariable Long employeeId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                attendanceService.clockOut(employeeId, tenantId));
    }

    // Get today's attendance (HR view)
    @GetMapping("/today")
    public ResponseEntity<?> getTodayAttendance(
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                attendanceService.getTodayAttendance(tenantId));
    }

    // Get all attendance for one employee
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getEmployeeAttendance(
            @PathVariable Long employeeId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                attendanceService.getEmployeeAttendance(employeeId, tenantId));
    }

    // Get monthly attendance for one employee
    @GetMapping("/employee/{employeeId}/month/{month}/year/{year}")
    public ResponseEntity<?> getMonthlyAttendance(
            @PathVariable Long employeeId,
            @PathVariable Integer month,
            @PathVariable Integer year,
            HttpServletRequest request) {
        return ResponseEntity.ok(
                attendanceService.getMonthlyAttendance(employeeId, month, year));
    }

    // Get monthly summary
    @GetMapping("/employee/{employeeId}/summary/{month}/{year}")
    public ResponseEntity<?> getMonthlySummary(
            @PathVariable Long employeeId,
            @PathVariable Integer month,
            @PathVariable Integer year,
            HttpServletRequest request) {
        return ResponseEntity.ok(
                attendanceService.getMonthlySummary(employeeId, month, year));
    }
}