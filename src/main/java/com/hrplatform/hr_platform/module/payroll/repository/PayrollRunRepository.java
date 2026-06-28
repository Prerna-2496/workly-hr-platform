package com.hrplatform.hr_platform.module.payroll.repository;

import com.hrplatform.hr_platform.module.payroll.entity.PayrollRun;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PayrollRunRepository extends JpaRepository<PayrollRun, Long> {

    List<PayrollRun> findAllByTenantId(Long tenantId);

    Optional<PayrollRun> findByTenantIdAndMonthAndYear(
            Long tenantId, Integer month, Integer year);
}