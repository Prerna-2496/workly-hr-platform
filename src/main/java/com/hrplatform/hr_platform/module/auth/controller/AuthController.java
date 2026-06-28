package com.hrplatform.hr_platform.module.auth.controller;

import com.hrplatform.hr_platform.module.auth.dto.LoginRequest;
import com.hrplatform.hr_platform.module.auth.dto.RegisterRequest;
import com.hrplatform.hr_platform.module.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/request-access")
    public ResponseEntity<?> requestAccess(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.requestAccess(req));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<?> getPending(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(authService.getPendingRequests(role, tenantId));
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getAllRequests(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(authService.getAllRequests(role, tenantId));
    }

    @PostMapping("/requests/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(authService.approveRequest(id, role, tenantId));
    }

    @PostMapping("/requests/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id,
                                    @RequestBody Map<String, String> body,
                                    HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                authService.rejectRequest(id, body.get("reason"), role, tenantId));
    }
}