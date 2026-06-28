package com.hrplatform.hr_platform.common;

import com.hrplatform.hr_platform.module.onboarding.service.OnboardingService;
import com.hrplatform.hr_platform.module.payroll.service.PayrollService;
import com.hrplatform.hr_platform.module.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class PayrollScheduler {

    private final PayrollService payrollService;
    private final OnboardingService onboardingService;
    private final EmployeeRepository employeeRepository;
    private final AuditLogService auditLogService;

    // Runs payroll on 28th of every month at 9AM
    @Scheduled(cron = "0 0 9 28 * ?")
    public void runMonthlyPayroll() {
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();

        System.out.println("=== SCHEDULER === Running payroll for "
                + month + "/" + year);

        // get all unique tenant IDs
        List<Long> tenantIds = employeeRepository.findAll()
                .stream()
                .map(e -> e.getTenantId())
                .distinct()
                .toList();

        for (Long tenantId : tenantIds) {
            try {
                payrollService.runPayroll(month, year, tenantId);
                System.out.println("=== SCHEDULER === Payroll done for tenant: "
                        + tenantId);
            } catch (Exception e) {
                System.out.println("=== SCHEDULER === Payroll failed for tenant "
                        + tenantId + ": " + e.getMessage());
            }
        }
    }

    // Checks overdue onboarding tasks every day at 8AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkOverdueTasks() {
        System.out.println("=== SCHEDULER === Checking overdue onboarding tasks");
        onboardingService.markOverdueTasks();
    }

    // Resets leave balances every Jan 1st at midnight
    @Scheduled(cron = "0 0 0 1 1 ?")
    public void resetLeaveBalances() {
        System.out.println("=== SCHEDULER === Resetting leave balances for new year");
        // leave balance reset logic runs automatically
        // new year = new leave entries created on first request
    }
}