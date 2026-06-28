package com.hrplatform.hr_platform.module.payroll.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll_runs")
@Data
public class PayrollRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long tenantId;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayrollStatus status = PayrollStatus.PROCESSING;

    private Integer totalEmployees;
    private Double totalNetPay;

    private LocalDateTime runAt;

    @PrePersist
    protected void onCreate() {
        runAt = LocalDateTime.now();
    }
}