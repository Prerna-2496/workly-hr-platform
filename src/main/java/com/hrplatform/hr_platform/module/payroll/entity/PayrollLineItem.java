package com.hrplatform.hr_platform.module.payroll.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "payroll_line_items")
@Data
public class PayrollLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long payrollRunId;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private Long tenantId;

    private Integer month;
    private Integer year;

    // Earnings
    private Double basicSalary;
    private Double hra;
    private Double allowance;
    private Double grossSalary;

    // Deductions
    private Double providentFund;     // 12% of basic
    private Double professionalTax;   // slab based
    private Double incomeTax;         // annual slab / 12

    // Final
    private Double netSalary;
}