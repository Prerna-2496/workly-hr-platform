package com.hrplatform.hr_platform.module.attendance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records")
@Data
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long tenantId;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private LocalDate date;

    private LocalDateTime clockIn;
    private LocalDateTime clockOut;

    private Double hoursWorked;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    private Boolean isLate = false;

    // standard work start time is 9AM
    // if clockIn after 9:15AM, mark as late
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}