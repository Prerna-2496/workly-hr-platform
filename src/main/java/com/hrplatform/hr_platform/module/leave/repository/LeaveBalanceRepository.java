package com.hrplatform.hr_platform.module.leave.repository;

import com.hrplatform.hr_platform.module.leave.entity.LeaveBalance;
import com.hrplatform.hr_platform.module.leave.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeAndYear(
            Long employeeId, LeaveType leaveType, Integer year);

    List<LeaveBalance> findAllByEmployeeIdAndYear(Long employeeId, Integer year);
}