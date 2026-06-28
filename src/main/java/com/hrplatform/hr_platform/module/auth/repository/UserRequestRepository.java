package com.hrplatform.hr_platform.module.auth.repository;

import com.hrplatform.hr_platform.module.auth.entity.RequestStatus;
import com.hrplatform.hr_platform.module.auth.entity.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRequestRepository extends JpaRepository<UserRequest, Long> {
    List<UserRequest> findAllByStatus(RequestStatus status);
    List<UserRequest> findAllByTenantId(Long tenantId);
    List<UserRequest> findAllByStatusAndTenantId(RequestStatus status, Long tenantId);
    boolean existsByEmail(String email);
}