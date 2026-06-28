package com.hrplatform.hr_platform.module.leave.repository;

import com.hrplatform.hr_platform.module.leave.entity.LeaveRequest;
import com.hrplatform.hr_platform.module.leave.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findAllByTenantId(Long tenantId);

    List<LeaveRequest> findAllByEmployeeIdAndTenantId(Long employeeId, Long tenantId);

    List<LeaveRequest> findAllByStatusAndTenantId(LeaveStatus status, Long tenantId);

    Optional<LeaveRequest> findByIdAndTenantId(Long id, Long tenantId);
}