package com.hrplatform.hr_platform.module.onboarding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateTaskRequest {

    @NotNull
    private Long employeeId;

    @NotBlank
    private String taskName;

    private String description;

    private LocalDate dueDate;
}
