package com.hrplatform.hr_platform.module.payroll.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PayrollRequest {

    @NotNull
    @Min(1) @Max(12)
    private Integer month;

    @NotNull
    private Integer year;
}