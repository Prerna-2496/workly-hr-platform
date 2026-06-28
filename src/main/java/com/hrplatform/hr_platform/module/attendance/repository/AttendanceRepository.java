package com.hrplatform.hr_platform.module.attendance.repository;

import com.hrplatform.hr_platform.module.attendance.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<AttendanceRecord, Long> {

    Optional<AttendanceRecord> findByEmployeeIdAndDate(
            Long employeeId, LocalDate date);

    List<AttendanceRecord> findAllByEmployeeIdAndTenantId(
            Long employeeId, Long tenantId);

    List<AttendanceRecord> findAllByTenantIdAndDate(
            Long tenantId, LocalDate date);

    List<AttendanceRecord> findAllByEmployeeIdAndDateBetween(
            Long employeeId, LocalDate from, LocalDate to);

    List<AttendanceRecord> findAllByTenantIdAndDateBetween(
            Long tenantId, LocalDate from, LocalDate to);
}