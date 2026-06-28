package com.hrplatform.hr_platform.common;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(Long tenantId, String userEmail, String action,
                    String entity, String entityId, String details) {
        AuditLog log = new AuditLog();
        log.setTenantId(tenantId);
        log.setUserEmail(userEmail);
        log.setAction(action);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getLogsForTenant(Long tenantId) {
        return auditLogRepository
                .findAllByTenantIdOrderByCreatedAtDesc(tenantId);
    }

    public List<AuditLog> getLogsForUser(String email) {
        return auditLogRepository
                .findAllByUserEmailOrderByCreatedAtDesc(email);
    }
}