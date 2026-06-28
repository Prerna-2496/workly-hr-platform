package com.hrplatform.hr_platform.module.onboarding.service;

import com.hrplatform.hr_platform.module.onboarding.dto.CreateTaskRequest;
import com.hrplatform.hr_platform.module.onboarding.entity.OnboardingTask;
import com.hrplatform.hr_platform.module.onboarding.entity.TaskStatus;
import com.hrplatform.hr_platform.module.onboarding.repository.OnboardingTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OnboardingService {

    private final OnboardingTaskRepository taskRepository;

    // HR creates a task for an employee
    public OnboardingTask createTask(CreateTaskRequest req, Long tenantId) {
        OnboardingTask task = new OnboardingTask();
        task.setTenantId(tenantId);
        task.setEmployeeId(req.getEmployeeId());
        task.setTaskName(req.getTaskName());
        task.setDescription(req.getDescription());
        task.setDueDate(req.getDueDate());
        task.setStatus(TaskStatus.PENDING);
        return taskRepository.save(task);
    }

    // Auto-create default tasks when employee joins
    public void createDefaultTasks(Long employeeId, Long tenantId,
                                   LocalDate joiningDate) {
        String[][] defaults = {
                {"Upload ID Proof", "Upload Aadhaar/PAN card"},
                {"Sign Offer Letter", "Sign and return the offer letter"},
                {"Setup Work Email", "Configure your company email account"},
                {"Complete Policy Training", "Read and acknowledge company policies"},
                {"Asset Acknowledgement", "Sign for laptop and equipment received"}
        };

        for (int i = 0; i < defaults.length; i++) {
            OnboardingTask task = new OnboardingTask();
            task.setTenantId(tenantId);
            task.setEmployeeId(employeeId);
            task.setTaskName(defaults[i][0]);
            task.setDescription(defaults[i][1]);
            task.setDueDate(joiningDate.plusDays(i + 1));
            task.setStatus(TaskStatus.PENDING);
            taskRepository.save(task);
        }
    }

    // Employee marks task as complete
    public OnboardingTask completeTask(Long taskId, Long tenantId) {
        OnboardingTask task = taskRepository
                .findByIdAndTenantId(taskId, tenantId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    // Get all tasks for an employee
    public List<OnboardingTask> getEmployeeTasks(
            Long employeeId, Long tenantId) {
        return taskRepository
                .findAllByEmployeeIdAndTenantId(employeeId, tenantId);
    }

    // Get all tasks across company (HR view)
    public List<OnboardingTask> getAllTasks(Long tenantId) {
        return taskRepository.findAllByTenantId(tenantId);
    }

    // Get progress summary for an employee
    public java.util.Map<String, Object> getProgress(
            Long employeeId, Long tenantId) {
        List<OnboardingTask> tasks = getEmployeeTasks(employeeId, tenantId);
        long total = tasks.size();
        long completed = tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .count();
        int percentage = total == 0 ? 0 : (int) ((completed * 100) / total);

        return java.util.Map.of(
                "totalTasks", total,
                "completedTasks", completed,
                "pendingTasks", total - completed,
                "completionPercentage", percentage
        );
    }

    // Mark overdue tasks (called by scheduler)
    public void markOverdueTasks() {
        List<OnboardingTask> overdue = taskRepository
                .findAllByStatusAndDueDateBefore(
                        TaskStatus.PENDING, LocalDate.now());
        overdue.forEach(task -> {
            task.setStatus(TaskStatus.OVERDUE);
            taskRepository.save(task);
        });
    }
}