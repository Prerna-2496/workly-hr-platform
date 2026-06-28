package com.hrplatform.hr_platform.module.attendance.service;

import com.hrplatform.hr_platform.common.AuditLogService;
import com.hrplatform.hr_platform.module.attendance.dto.ClockInRequest;
import com.hrplatform.hr_platform.module.attendance.entity.AttendanceRecord;
import com.hrplatform.hr_platform.module.attendance.entity.AttendanceStatus;
import com.hrplatform.hr_platform.module.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AuditLogService auditLogService;

    // standard work start time — 9:15 AM is late threshold
    private static final LocalTime LATE_THRESHOLD = LocalTime.of(9, 15);

    // CLOCK IN
    public AttendanceRecord clockIn(ClockInRequest req, Long tenantId) {
        LocalDate today = LocalDate.now();

        // prevent duplicate clock in
        attendanceRepository
                .findByEmployeeIdAndDate(req.getEmployeeId(), today)
                .ifPresent(existing -> {
                    throw new RuntimeException(
                            "Already clocked in today");
                });

        LocalDateTime now = LocalDateTime.now();
        boolean isLate = now.toLocalTime().isAfter(LATE_THRESHOLD);

        AttendanceRecord record = new AttendanceRecord();
        record.setTenantId(tenantId);
        record.setEmployeeId(req.getEmployeeId());
        record.setDate(today);
        record.setClockIn(now);
        record.setStatus(AttendanceStatus.PRESENT);
        record.setIsLate(isLate);

        AttendanceRecord saved = attendanceRepository.save(record);

        auditLogService.log(
                tenantId,
                "employee",
                "CLOCK_IN",
                "AttendanceRecord",
                saved.getId().toString(),
                "Employee: " + req.getEmployeeId() +
                        ", Time: " + now +
                        ", Late: " + isLate
        );

        return saved;
    }

    // CLOCK OUT
    public AttendanceRecord clockOut(Long employeeId, Long tenantId) {
        LocalDate today = LocalDate.now();

        AttendanceRecord record = attendanceRepository
                .findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() ->
                        new RuntimeException("No clock-in found for today"));

        if (record.getClockOut() != null) {
            throw new RuntimeException("Already clocked out today");
        }

        LocalDateTime now = LocalDateTime.now();
        record.setClockOut(now);

        // calculate hours worked
        double hours = java.time.Duration
                .between(record.getClockIn(), now)
                .toMinutes() / 60.0;
        hours = Math.round(hours * 100.0) / 100.0;
        record.setHoursWorked(hours);

        // mark half day if less than 4 hours
        if (hours < 4) {
            record.setStatus(AttendanceStatus.HALF_DAY);
        }

        auditLogService.log(
                tenantId,
                "employee",
                "CLOCK_OUT",
                "AttendanceRecord",
                record.getId().toString(),
                "Employee: " + employeeId +
                        ", Hours: " + hours
        );

        return attendanceRepository.save(record);
    }

    // GET today's attendance for whole company
    public List<AttendanceRecord> getTodayAttendance(Long tenantId) {
        return attendanceRepository
                .findAllByTenantIdAndDate(tenantId, LocalDate.now());
    }

    // GET attendance for one employee
    public List<AttendanceRecord> getEmployeeAttendance(
            Long employeeId, Long tenantId) {
        return attendanceRepository
                .findAllByEmployeeIdAndTenantId(employeeId, tenantId);
    }

    // GET monthly attendance for one employee
    public List<AttendanceRecord> getMonthlyAttendance(
            Long employeeId, Integer month, Integer year) {
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());
        return attendanceRepository
                .findAllByEmployeeIdAndDateBetween(employeeId, from, to);
    }

    // GET monthly summary — present days, absent, late, hours
    public Map<String, Object> getMonthlySummary(
            Long employeeId, Integer month, Integer year) {

        List<AttendanceRecord> records =
                getMonthlyAttendance(employeeId, month, year);

        long presentDays = records.stream()
                .filter(r -> r.getStatus() == AttendanceStatus.PRESENT
                        || r.getStatus() == AttendanceStatus.HALF_DAY)
                .count();

        long lateDays = records.stream()
                .filter(r -> Boolean.TRUE.equals(r.getIsLate()))
                .count();

        double totalHours = records.stream()
                .filter(r -> r.getHoursWorked() != null)
                .mapToDouble(AttendanceRecord::getHoursWorked)
                .sum();
        totalHours = Math.round(totalHours * 100.0) / 100.0;

        long halfDays = records.stream()
                .filter(r -> r.getStatus() == AttendanceStatus.HALF_DAY)
                .count();

        return Map.of(
                "employeeId", employeeId,
                "month", month,
                "year", year,
                "presentDays", presentDays,
                "lateDays", lateDays,
                "halfDays", halfDays,
                "totalHoursWorked", totalHours,
                "totalRecords", records.size()
        );
    }
}