package com.hrplatform.hr_platform.common;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByTenantIdOrderByCreatedAtDesc(Long tenantId);

    List<AuditLog> findAllByUserEmailOrderByCreatedAtDesc(String email);

    List<AuditLog> findAllByEntityOrderByCreatedAtDesc(String entity);
}