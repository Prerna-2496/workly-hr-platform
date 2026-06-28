package com.hrplatform.hr_platform.module.employee.service;

import com.hrplatform.hr_platform.module.employee.dto.EmployeeRequest;
import com.hrplatform.hr_platform.module.employee.entity.Employee;
import com.hrplatform.hr_platform.module.employee.entity.EmploymentType;
import com.hrplatform.hr_platform.module.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    // ADD employee
    public Employee addEmployee(EmployeeRequest req, Long tenantId) {
        if (employeeRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Employee with this email already exists");
        }
        Employee emp = new Employee();
        emp.setTenantId(tenantId);
        emp.setName(req.getName());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());
        emp.setAddress(req.getAddress());
        emp.setJoiningDate(req.getJoiningDate());
        emp.setDepartmentId(req.getDepartmentId());
        emp.setManagerId(req.getManagerId());
        emp.setBasicSalary(req.getBasicSalary());
        emp.setHra(req.getHra());
        emp.setAllowance(req.getAllowance());
        if (req.getEmploymentType() != null) {
            emp.setEmploymentType(EmploymentType.valueOf(req.getEmploymentType()));
        }
        return employeeRepository.save(emp);
    }

    // GET all employees for this company
    public List<Employee> getAllEmployees(Long tenantId) {
        return employeeRepository.findAllByTenantId(tenantId);
    }

    // GET one employee
    public Employee getEmployee(Long id, Long tenantId) {
        return employeeRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    // UPDATE employee
    public Employee updateEmployee(Long id, EmployeeRequest req, Long tenantId) {
        Employee emp = getEmployee(id, tenantId);
        emp.setName(req.getName());
        emp.setPhone(req.getPhone());
        emp.setAddress(req.getAddress());
        emp.setDepartmentId(req.getDepartmentId());
        emp.setManagerId(req.getManagerId());
        emp.setBasicSalary(req.getBasicSalary());
        emp.setHra(req.getHra());
        emp.setAllowance(req.getAllowance());
        return employeeRepository.save(emp);
    }

    // SOFT DELETE — never hard delete employees
    public void deactivateEmployee(Long id, Long tenantId) {
        Employee emp = getEmployee(id, tenantId);
        emp.setIsActive(false);
        employeeRepository.save(emp);
    }
}