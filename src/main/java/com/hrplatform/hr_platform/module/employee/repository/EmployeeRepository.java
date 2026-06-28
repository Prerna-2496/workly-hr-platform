package com.hrplatform.hr_platform.module.employee.repository;

import com.hrplatform.hr_platform.module.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // get all employees for a company
    List<Employee> findAllByTenantId(Long tenantId);

    // get one employee — only if they belong to the right company
    Optional<Employee> findByIdAndTenantId(Long id, Long tenantId);

    // get all employees in a department
    List<Employee> findAllByDepartmentIdAndTenantId(Long departmentId, Long tenantId);

    boolean existsByEmail(String email);
}