package com.hrplatform.hr_platform.common;

import com.hrplatform.hr_platform.module.employee.repository.EmployeeRepository;
import com.hrplatform.hr_platform.module.leave.entity.LeaveStatus;
import com.hrplatform.hr_platform.module.leave.repository.LeaveRequestRepository;
import com.hrplatform.hr_platform.module.payroll.repository.PayrollLineItemRepository;
import com.hrplatform.hr_platform.module.payroll.repository.PayrollRunRepository;
import com.hrplatform.hr_platform.module.onboarding.entity.TaskStatus;
import com.hrplatform.hr_platform.module.onboarding.repository.OnboardingTaskRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRunRepository payrollRunRepository;
    private final PayrollLineItemRepository payrollLineItemRepository;
    private final OnboardingTaskRepository onboardingTaskRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard(
            HttpServletRequest request) {

        Long tenantId = (Long) request.getAttribute("tenantId");

        // Employee stats
        var allEmployees = employeeRepository.findAllByTenantId(tenantId);
        long totalEmployees = allEmployees.size();
        long activeEmployees = allEmployees.stream()
                .filter(e -> e.getIsActive()).count();
        long inactiveEmployees = totalEmployees - activeEmployees;

        // Leave stats
        var allLeaves = leaveRequestRepository.findAllByTenantId(tenantId);
        long pendingLeaves = allLeaves.stream()
                .filter(l -> l.getStatus() == LeaveStatus.PENDING).count();
        long approvedLeaves = allLeaves.stream()
                .filter(l -> l.getStatus() == LeaveStatus.APPROVED).count();

        // Payroll stats
        var allRuns = payrollRunRepository.findAllByTenantId(tenantId);
        long totalPayrollRuns = allRuns.size();
        double totalPayrollExpense = allRuns.stream()
                .mapToDouble(r -> r.getTotalNetPay() != null ? r.getTotalNetPay() : 0)
                .sum();

        // Onboarding stats
        var allTasks = onboardingTaskRepository.findAllByTenantId(tenantId);
        long totalTasks = allTasks.size();
        long completedTasks = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long pendingTasks = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.PENDING).count();
        int onboardingRate = totalTasks == 0 ? 0
                : (int) ((completedTasks * 100) / totalTasks);

        // Payroll history (last 6 runs)
        var payrollHistory = allRuns.stream()
                .sorted((a, b) -> {
                    if (!a.getYear().equals(b.getYear()))
                        return b.getYear() - a.getYear();
                    return b.getMonth() - a.getMonth();
                })
                .limit(6)
                .map(r -> Map.of(
                        "month", r.getMonth(),
                        "year", r.getYear(),
                        "totalNetPay", r.getTotalNetPay() != null ? r.getTotalNetPay() : 0,
                        "totalEmployees", r.getTotalEmployees() != null ? r.getTotalEmployees() : 0
                ))
                .toList();

        return ResponseEntity.ok(Map.of(
                "employees", Map.of(
                        "total", totalEmployees,
                        "active", activeEmployees,
                        "inactive", inactiveEmployees
                ),
                "leaves", Map.of(
                        "total", allLeaves.size(),
                        "pending", pendingLeaves,
                        "approved", approvedLeaves
                ),
                "payroll", Map.of(
                        "totalRuns", totalPayrollRuns,
                        "totalExpense", totalPayrollExpense,
                        "history", payrollHistory
                ),
                "onboarding", Map.of(
                        "totalTasks", totalTasks,
                        "completedTasks", completedTasks,
                        "pendingTasks", pendingTasks,
                        "completionRate", onboardingRate
                )
        ));
    }
}