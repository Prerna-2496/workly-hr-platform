package com.hrplatform.hr_platform.common;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tenantId;
    private String userEmail;
    private String action;       // e.g. "RAN_PAYROLL", "APPROVED_LEAVE"
    private String entity;       // e.g. "PayrollRun", "LeaveRequest"
    private String entityId;     // the ID of the record affected
    private String details;      // extra info as JSON string

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}