package com.hrplatform.hr_platform.module.employee.repository;

import com.hrplatform.hr_platform.module.employee.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findAllByTenantId(Long tenantId);
}