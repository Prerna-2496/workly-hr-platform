package com.hrplatform.hr_platform.module.payroll.service;

import com.hrplatform.hr_platform.common.AuditLogService;
import com.hrplatform.hr_platform.module.employee.entity.Employee;
import com.hrplatform.hr_platform.module.employee.repository.EmployeeRepository;
import com.hrplatform.hr_platform.module.payroll.entity.*;
import com.hrplatform.hr_platform.module.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRunRepository payrollRunRepository;
    private final PayrollLineItemRepository lineItemRepository;
    private final EmployeeRepository employeeRepository;
    private final TaxCalculator taxCalculator;
    private final AuditLogService auditLogService;

    public PayrollRun runPayroll(Integer month, Integer year, Long tenantId) {

        payrollRunRepository
                .findByTenantIdAndMonthAndYear(tenantId, month, year)
                .ifPresent(existing -> {
                    throw new RuntimeException(
                            "Payroll already run for " + month + "/" + year);
                });

        PayrollRun run = new PayrollRun();
        run.setTenantId(tenantId);
        run.setMonth(month);
        run.setYear(year);
        run.setStatus(PayrollStatus.PROCESSING);
        run = payrollRunRepository.save(run);

        List<Employee> employees = employeeRepository
                .findAllByTenantId(tenantId)
                .stream()
                .filter(Employee::getIsActive)
                .toList();

        double totalNetPay = 0;

        for (Employee emp : employees) {
            PayrollLineItem item = computePayroll(emp, run.getId(),
                    month, year, tenantId);
            lineItemRepository.save(item);
            totalNetPay += item.getNetSalary();
        }

        run.setStatus(PayrollStatus.COMPLETED);
        run.setTotalEmployees(employees.size());
        run.setTotalNetPay(totalNetPay);
        run = payrollRunRepository.save(run);

        // ← audit log added here
        auditLogService.log(
                tenantId,
                "system",
                "RAN_PAYROLL",
                "PayrollRun",
                run.getId().toString(),
                "Month: " + month + ", Year: " + year +
                        ", Employees: " + employees.size() +
                        ", TotalNetPay: " + totalNetPay
        );

        return run;
    }

    private PayrollLineItem computePayroll(Employee emp, Long runId,
                                           Integer month, Integer year,
                                           Long tenantId) {
        double basic     = emp.getBasicSalary() != null ? emp.getBasicSalary() : 0;
        double hra       = emp.getHra() != null ? emp.getHra() : 0;
        double allowance = emp.getAllowance() != null ? emp.getAllowance() : 0;

        double gross = basic + hra + allowance;

        double pf              = basic * 0.12;
        double professionalTax = taxCalculator.calculateProfessionalTax(gross);
        double incomeTax       = taxCalculator.calculateMonthlyIncomeTax(gross * 12);

        double net = gross - pf - professionalTax - incomeTax;

        PayrollLineItem item = new PayrollLineItem();
        item.setPayrollRunId(runId);
        item.setEmployeeId(emp.getId());
        item.setTenantId(tenantId);
        item.setMonth(month);
        item.setYear(year);
        item.setBasicSalary(basic);
        item.setHra(hra);
        item.setAllowance(allowance);
        item.setGrossSalary(gross);
        item.setProvidentFund(Math.round(pf * 100.0) / 100.0);
        item.setProfessionalTax(professionalTax);
        item.setIncomeTax(incomeTax);
        item.setNetSalary(Math.round(net * 100.0) / 100.0);

        return item;
    }

    public List<PayrollRun> getAllRuns(Long tenantId) {
        return payrollRunRepository.findAllByTenantId(tenantId);
    }

    public List<PayrollLineItem> getPayslipsForRun(Long runId) {
        return lineItemRepository.findAllByPayrollRunId(runId);
    }

    public List<PayrollLineItem> getEmployeePayslips(
            Long employeeId, Long tenantId) {
        return lineItemRepository
                .findAllByEmployeeIdAndTenantId(employeeId, tenantId);
    }
}