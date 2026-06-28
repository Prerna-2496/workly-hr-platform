package com.hrplatform.hr_platform.module.auth.service;

import com.hrplatform.hr_platform.common.EmailService;
import com.hrplatform.hr_platform.config.JwtUtil;
import com.hrplatform.hr_platform.module.auth.dto.LoginRequest;
import com.hrplatform.hr_platform.module.auth.dto.RegisterRequest;
import com.hrplatform.hr_platform.module.auth.entity.*;
import com.hrplatform.hr_platform.module.auth.repository.UserRepository;
import com.hrplatform.hr_platform.module.auth.repository.UserRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserRequestRepository userRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    // Submit access request — goes to PENDING, notifies Super Admin
    public UserRequest requestAccess(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRequestRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Access request already submitted for this email");
        }

        UserRequest request = new UserRequest();
        request.setName(req.getName());
        request.setEmail(req.getEmail());
        request.setPassword(passwordEncoder.encode(req.getPassword()));
        request.setRequestedRole(Role.valueOf(req.getRole()));
        request.setTenantId(req.getTenantId());
        request.setCompanyName(req.getCompanyName());
        request.setStatus(RequestStatus.PENDING);
        UserRequest saved = userRequestRepository.save(request);

        emailService.notifySuperAdminNewRequest(
                saved.getName(),
                saved.getEmail(),
                saved.getRequestedRole().name(),
                saved.getCompanyName() != null ? saved.getCompanyName() : "N/A"
        );

        return saved;
    }

    // Login — only approved + active users can login
    public Map<String, Object> login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsApproved()) {
            throw new RuntimeException("Your account is pending approval");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Your account has been deactivated");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getTenantId()
        );

        return Map.of(
                "token", token,
                "role", user.getRole().name(),
                "tenantId", user.getTenantId(),
                "name", user.getName() != null ? user.getName() : "User"
        );
    }

    // Pending requests — Super Admin sees all, others see ONLY their own tenant
    public List<UserRequest> getPendingRequests(String role, Long tenantId) {
        if (role.equals("SUPER_ADMIN")) {
            return userRequestRepository.findAllByStatus(RequestStatus.PENDING);
        }
        return userRequestRepository.findAllByStatusAndTenantId(
                RequestStatus.PENDING, tenantId);
    }

    // All requests (history) — same scoping rule
    public List<UserRequest> getAllRequests(String role, Long tenantId) {
        if (role.equals("SUPER_ADMIN")) {
            return userRequestRepository.findAll();
        }
        return userRequestRepository.findAllByTenantId(tenantId);
    }

    // Approve — now enforces that the approver is authorized for this request's tenant
    public User approveRequest(Long requestId, String approverRole, Long approverTenantId) {
        UserRequest req = userRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request already processed");
        }

        // Super Admin can approve anything. Everyone else can only approve
        // requests that belong to their own tenant.
        if (!approverRole.equals("SUPER_ADMIN") && !req.getTenantId().equals(approverTenantId)) {
            throw new RuntimeException("You are not authorized to approve requests outside your company");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setRole(req.getRequestedRole());
        user.setTenantId(req.getTenantId());
        user.setIsActive(true);
        user.setIsApproved(true);
        userRepository.save(user);

        req.setStatus(RequestStatus.APPROVED);
        req.setResolvedAt(LocalDateTime.now());
        userRequestRepository.save(req);

        emailService.notifyRequestApproved(
                req.getName(),
                req.getEmail(),
                req.getRequestedRole().name()
        );

        return user;
    }

    // Reject — same authorization check as approve
    public UserRequest rejectRequest(Long requestId, String reason,
                                     String approverRole, Long approverTenantId) {
        UserRequest req = userRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!approverRole.equals("SUPER_ADMIN") && !req.getTenantId().equals(approverTenantId)) {
            throw new RuntimeException("You are not authorized to reject requests outside your company");
        }

        req.setStatus(RequestStatus.REJECTED);
        req.setRejectionReason(reason);
        req.setResolvedAt(LocalDateTime.now());
        UserRequest saved = userRequestRepository.save(req);

        emailService.notifyRequestRejected(
                req.getName(),
                req.getEmail(),
                reason
        );

        return saved;
    }
}