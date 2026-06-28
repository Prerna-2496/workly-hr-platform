package com.hrplatform.hr_platform.module.leave.service;

import com.hrplatform.hr_platform.common.AuditLogService;
import com.hrplatform.hr_platform.module.leave.dto.LeaveApplyRequest;
import com.hrplatform.hr_platform.module.leave.entity.*;
import com.hrplatform.hr_platform.module.leave.repository.LeaveBalanceRepository;
import com.hrplatform.hr_platform.module.leave.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final AuditLogService auditLogService;

    public LeaveRequest applyLeave(LeaveApplyRequest req, Long tenantId) {
        LeaveType leaveType = LeaveType.valueOf(req.getLeaveType());

        int year = req.getFromDate().getYear();
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndYear(req.getEmployeeId(), leaveType, year)
                .orElseGet(() -> createDefaultBalance(
                        req.getEmployeeId(), tenantId, leaveType, year));

        int daysRequested = (int) (req.getToDate().toEpochDay()
                - req.getFromDate().toEpochDay() + 1);

        if (balance.getRemainingDays() < daysRequested) {
            throw new RuntimeException("Insufficient leave balance. Remaining: "
                    + balance.getRemainingDays() + " days");
        }

        LeaveRequest leave = new LeaveRequest();
        leave.setTenantId(tenantId);
        leave.setEmployeeId(req.getEmployeeId());
        leave.setLeaveType(leaveType);
        leave.setFromDate(req.getFromDate());
        leave.setToDate(req.getToDate());
        leave.setReason(req.getReason());
        leave.setStatus(LeaveStatus.PENDING);

        LeaveRequest saved = leaveRequestRepository.save(leave);

        // audit log
        auditLogService.log(
                tenantId,
                "employee",
                "APPLIED_LEAVE",
                "LeaveRequest",
                saved.getId().toString(),
                "Employee: " + req.getEmployeeId() +
                        ", Type: " + leaveType +
                        ", Days: " + daysRequested
        );

        return saved;
    }

    public LeaveRequest managerApprove(Long leaveId, String remark,
                                       Long tenantId) {
        LeaveRequest leave = getLeave(leaveId, tenantId);

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Leave is not in PENDING state");
        }

        leave.setStatus(LeaveStatus.MANAGER_APPROVED);
        leave.setManagerRemark(remark);
        leave.setManagerActionAt(LocalDateTime.now());
        LeaveRequest saved = leaveRequestRepository.save(leave);

        // audit log
        auditLogService.log(
                tenantId,
                "manager",
                "MANAGER_APPROVED_LEAVE",
                "LeaveRequest",
                leaveId.toString(),
                "Employee: " + leave.getEmployeeId() +
                        ", Remark: " + remark
        );

        return saved;
    }

    public LeaveRequest hrApprove(Long leaveId, String remark, Long tenantId) {
        LeaveRequest leave = getLeave(leaveId, tenantId);

        if (leave.getStatus() != LeaveStatus.MANAGER_APPROVED) {
            throw new RuntimeException("Leave must be Manager Approved first");
        }

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setHrRemark(remark);
        leave.setHrActionAt(LocalDateTime.now());

        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndYear(
                        leave.getEmployeeId(), leave.getLeaveType(),
                        leave.getFromDate().getYear())
                .orElseThrow(() -> new RuntimeException("Balance not found"));

        balance.setUsedDays(balance.getUsedDays() + leave.getTotalDays());
        leaveBalanceRepository.save(balance);

        LeaveRequest saved = leaveRequestRepository.save(leave);

        // audit log
        auditLogService.log(
                tenantId,
                "hr",
                "APPROVED_LEAVE",
                "LeaveRequest",
                leaveId.toString(),
                "Employee: " + leave.getEmployeeId() +
                        ", Days: " + leave.getTotalDays() +
                        ", Remark: " + remark
        );

        return saved;
    }

    public LeaveRequest reject(Long leaveId, String remark, Long tenantId) {
        LeaveRequest leave = getLeave(leaveId, tenantId);
        leave.setStatus(LeaveStatus.REJECTED);
        leave.setHrRemark(remark);
        leave.setHrActionAt(LocalDateTime.now());
        LeaveRequest saved = leaveRequestRepository.save(leave);

        auditLogService.log(
                tenantId,
                "hr",
                "REJECTED_LEAVE",
                "LeaveRequest",
                leaveId.toString(),
                "Employee: " + leave.getEmployeeId() +
                        ", Remark: " + remark
        );

        return saved;
    }

    public LeaveRequest cancel(Long leaveId, Long tenantId) {
        LeaveRequest leave = getLeave(leaveId, tenantId);
        if (leave.getStatus() == LeaveStatus.APPROVED) {
            throw new RuntimeException("Cannot cancel an already approved leave");
        }
        leave.setStatus(LeaveStatus.CANCELLED);
        return leaveRequestRepository.save(leave);
    }

    public List<LeaveRequest> getAllLeaves(Long tenantId) {
        return leaveRequestRepository.findAllByTenantId(tenantId);
    }

    public List<LeaveRequest> getMyLeaves(Long employeeId, Long tenantId) {
        return leaveRequestRepository
                .findAllByEmployeeIdAndTenantId(employeeId, tenantId);
    }

    public List<LeaveRequest> getPendingLeaves(Long tenantId) {
        return leaveRequestRepository
                .findAllByStatusAndTenantId(LeaveStatus.PENDING, tenantId);
    }

    public List<LeaveBalance> getMyBalance(Long employeeId, Long tenantId) {
        int year = java.time.LocalDate.now().getYear();
        return leaveBalanceRepository.findAllByEmployeeIdAndYear(employeeId, year);
    }

    private LeaveRequest getLeave(Long id, Long tenantId) {
        return leaveRequestRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
    }

    private LeaveBalance createDefaultBalance(Long employeeId, Long tenantId,
                                              LeaveType type, int year) {
        LeaveBalance b = new LeaveBalance();
        b.setEmployeeId(employeeId);
        b.setTenantId(tenantId);
        b.setLeaveType(type);
        b.setYear(year);
        b.setTotalDays(12);
        b.setUsedDays(0);
        return leaveBalanceRepository.save(b);
    }
}