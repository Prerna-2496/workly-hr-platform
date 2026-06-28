package com.hrplatform.hr_platform.module.payroll.repository;

import com.hrplatform.hr_platform.module.payroll.entity.PayrollLineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PayrollLineItemRepository
        extends JpaRepository<PayrollLineItem, Long> {

    List<PayrollLineItem> findAllByPayrollRunId(Long payrollRunId);

    List<PayrollLineItem> findAllByEmployeeIdAndTenantId(
            Long employeeId, Long tenantId);

    Optional<PayrollLineItem> findByEmployeeIdAndMonthAndYear(
            Long employeeId, Integer month, Integer year);
}