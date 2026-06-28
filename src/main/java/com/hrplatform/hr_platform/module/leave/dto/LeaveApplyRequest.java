package com.hrplatform.hr_platform.module.leave.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class LeaveApplyRequest {

    @NotNull
    private Long employeeId;

    @NotNull
    private String leaveType;

    @NotNull
    private LocalDate fromDate;

    @NotNull
    private LocalDate toDate;

    private String reason;
}