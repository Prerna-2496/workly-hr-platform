package com.hrplatform.hr_platform.module.leave.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "leave_balances")
@Data
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private Long tenantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer totalDays = 12;

    @Column(nullable = false)
    private Integer usedDays = 0;

    public Integer getRemainingDays() {
        return totalDays - usedDays;
    }
}