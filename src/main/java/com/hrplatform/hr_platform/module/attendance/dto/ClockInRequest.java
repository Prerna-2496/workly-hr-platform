package com.hrplatform.hr_platform.module.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClockInRequest {

    @NotNull
    private Long employeeId;
}