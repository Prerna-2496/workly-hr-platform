package com.hrplatform.hr_platform.module.leave.controller;

import com.hrplatform.hr_platform.module.leave.dto.LeaveActionRequest;
import com.hrplatform.hr_platform.module.leave.dto.LeaveApplyRequest;
import com.hrplatform.hr_platform.module.leave.service.LeaveService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeaveController {

    private final LeaveService leaveService;

    // Employee applies
    @PostMapping("/apply")
    public ResponseEntity<?> apply(
            @Valid @RequestBody LeaveApplyRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(leaveService.applyLeave(req, tenantId));
    }

    // Get all leaves (HR view)
    @GetMapping
    public ResponseEntity<?> getAll(HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(leaveService.getAllLeaves(tenantId));
    }

    // Get pending leaves
    @GetMapping("/pending")
    public ResponseEntity<?> getPending(HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(leaveService.getPendingLeaves(tenantId));
    }

    // Get my leaves
    @GetMapping("/my/{employeeId}")
    public ResponseEntity<?> getMyLeaves(
            @PathVariable Long employeeId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(leaveService.getMyLeaves(employeeId, tenantId));
    }

    // Get my balance
    @GetMapping("/balance/{employeeId}")
    public ResponseEntity<?> getBalance(
            @PathVariable Long employeeId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(leaveService.getMyBalance(employeeId, tenantId));
    }

    // Manager approves
    @PutMapping("/{id}/manager-approve")
    public ResponseEntity<?> managerApprove(
            @PathVariable Long id,
            @RequestBody LeaveActionRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                leaveService.managerApprove(id, req.getRemark(), tenantId));
    }

    // HR final approve
    @PutMapping("/{id}/hr-approve")
    public ResponseEntity<?> hrApprove(
            @PathVariable Long id,
            @RequestBody LeaveActionRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                leaveService.hrApprove(id, req.getRemark(), tenantId));
    }

    // Reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long id,
            @RequestBody LeaveActionRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                leaveService.reject(id, req.getRemark(), tenantId));
    }

    // Cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(leaveService.cancel(id, tenantId));
    }
}