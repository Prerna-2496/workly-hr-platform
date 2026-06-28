package com.hrplatform.hr_platform.module.employee.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EmployeeRequest {

    @NotBlank
    private String name;


    private String email;

    private String phone;
    private String address;
    private String employmentType;

    @NotNull
    private LocalDate joiningDate;

    private Long departmentId;
    private Long managerId;

    private Double basicSalary;
    private Double hra;
    private Double allowance;
}