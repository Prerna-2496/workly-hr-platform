package com.hrplatform.hr_platform.module.onboarding.repository;

import com.hrplatform.hr_platform.module.onboarding.entity.OnboardingTask;
import com.hrplatform.hr_platform.module.onboarding.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OnboardingTaskRepository
        extends JpaRepository<OnboardingTask, Long> {

    List<OnboardingTask> findAllByEmployeeIdAndTenantId(
            Long employeeId, Long tenantId);

    List<OnboardingTask> findAllByTenantId(Long tenantId);

    List<OnboardingTask> findAllByStatusAndDueDateBefore(
            TaskStatus status, LocalDate date);

    Optional<OnboardingTask> findByIdAndTenantId(Long id, Long tenantId);
}