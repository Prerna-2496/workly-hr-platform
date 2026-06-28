package com.hrplatform.hr_platform.common;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private static final String SUPER_ADMIN_EMAIL = "prerna.rajora2424@gmail.com";
    private static final String FROM_EMAIL = "prerna.rajora2424@gmail.com";

    public void notifySuperAdminNewRequest(String requesterName,
                                           String requesterEmail,
                                           String requestedRole,
                                           String companyName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(FROM_EMAIL);
            helper.setTo(SUPER_ADMIN_EMAIL);
            helper.setSubject("[Workly] New Access Request — " + requesterName);
            helper.setText(buildNewRequestEmail(
                    requesterName, requesterEmail, requestedRole, companyName), true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }
    }

    public void notifyRequestApproved(String userName, String userEmail, String role) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(FROM_EMAIL);
            helper.setTo(userEmail);
            helper.setSubject("[Workly] Your access request has been approved!");
            helper.setText(buildApprovedEmail(userName, role), true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }
    }

    public void notifyRequestRejected(String userName, String userEmail, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(FROM_EMAIL);
            helper.setTo(userEmail);
            helper.setSubject("[Workly] Update on your access request");
            helper.setText(buildRejectedEmail(userName, reason), true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }
    }

    public void notifyLeaveApproved(String userEmail, String userName,
                                    String fromDate, String toDate, String leaveType) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(FROM_EMAIL);
            helper.setTo(userEmail);
            helper.setSubject("[Workly] Your leave request has been approved");
            helper.setText(buildLeaveApprovedEmail(userName, fromDate, toDate, leaveType), true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }
    }

    public void notifyLeaveRejected(String userEmail, String userName,
                                    String fromDate, String toDate, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(FROM_EMAIL);
            helper.setTo(userEmail);
            helper.setSubject("[Workly] Update on your leave request");
            helper.setText(buildLeaveRejectedEmail(userName, fromDate, toDate, reason), true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }
    }

    // ── HTML templates ──

    private String buildNewRequestEmail(String name, String email, String role, String company) {
        return "<!DOCTYPE html><html><body style='font-family:Arial,sans-serif;background:#f5f6fa;margin:0;padding:20px'>"
                + "<div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)'>"
                + "<div style='background:#FF6B35;padding:32px;text-align:center'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px'>Workly</h1>"
                + "<p style='color:rgba(255,255,255,0.8);margin:8px 0 0'>HR Platform</p></div>"
                + "<div style='padding:32px'>"
                + "<h2 style='color:#2d3436;margin:0 0 8px'>New Access Request</h2>"
                + "<p style='color:#636e72;margin:0 0 24px'>Someone has requested access to Workly.</p>"
                + "<div style='background:#f5f6fa;border-radius:8px;padding:20px;margin-bottom:24px'>"
                + "<p style='margin:0 0 8px'><strong>Name:</strong> " + name + "</p>"
                + "<p style='margin:0 0 8px'><strong>Email:</strong> " + email + "</p>"
                + "<p style='margin:0 0 8px'><strong>Role:</strong> " + role + "</p>"
                + "<p style='margin:0'><strong>Company:</strong> " + company + "</p></div>"
                + "<a href='http://localhost:3000/login' style='display:inline-block;background:#FF6B35;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600'>Review Request</a></div>"
                + "<div style='padding:20px 32px;border-top:1px solid #f1efe8'>"
                + "<p style='color:#b2bec3;font-size:12px;margin:0'>Workly HR Platform — automated notification.</p></div></div></body></html>";
    }

    private String buildApprovedEmail(String name, String role) {
        return "<!DOCTYPE html><html><body style='font-family:Arial,sans-serif;background:#f5f6fa;margin:0;padding:20px'>"
                + "<div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)'>"
                + "<div style='background:#FF6B35;padding:32px;text-align:center'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px'>Workly</h1></div>"
                + "<div style='padding:32px'>"
                + "<h2 style='color:#2d3436;margin:0 0 8px'>You're approved!</h2>"
                + "<p style='color:#636e72;margin:0 0 16px'>Welcome to Workly, " + name + "!</p>"
                + "<div style='background:#f5f6fa;border-radius:8px;padding:20px;margin-bottom:24px'>"
                + "<p style='margin:0 0 8px'><strong>Role assigned:</strong> " + role.replace("_", " ") + "</p>"
                + "<p style='margin:0'>You can now login to Workly.</p></div>"
                + "<a href='http://localhost:3000/login' style='display:inline-block;background:#FF6B35;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600'>Login to Workly</a></div>"
                + "<div style='padding:20px 32px;border-top:1px solid #f1efe8'>"
                + "<p style='color:#b2bec3;font-size:12px;margin:0'>Workly HR Platform</p></div></div></body></html>";
    }

    private String buildRejectedEmail(String name, String reason) {
        return "<!DOCTYPE html><html><body style='font-family:Arial,sans-serif;background:#f5f6fa;margin:0;padding:20px'>"
                + "<div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)'>"
                + "<div style='background:#2d3436;padding:32px;text-align:center'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px'>Workly</h1></div>"
                + "<div style='padding:32px'>"
                + "<h2 style='color:#2d3436;margin:0 0 8px'>Access Request Update</h2>"
                + "<p style='color:#636e72;margin:0 0 24px'>Hi " + name + ", we reviewed your access request.</p>"
                + "<div style='background:#fff5f5;border-left:4px solid #d63031;padding:16px;border-radius:0 8px 8px 0'>"
                + "<p style='margin:0 0 8px;color:#d63031;font-weight:600'>Not approved</p>"
                + "<p style='margin:0;color:#636e72'>Reason: " + (reason != null ? reason : "No reason provided") + "</p></div></div>"
                + "<div style='padding:20px 32px;border-top:1px solid #f1efe8'>"
                + "<p style='color:#b2bec3;font-size:12px;margin:0'>Workly HR Platform</p></div></div></body></html>";
    }

    private String buildLeaveApprovedEmail(String name, String fromDate, String toDate, String leaveType) {
        return "<!DOCTYPE html><html><body style='font-family:Arial,sans-serif;background:#f5f6fa;margin:0;padding:20px'>"
                + "<div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)'>"
                + "<div style='background:#FF6B35;padding:32px;text-align:center'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px'>Workly</h1></div>"
                + "<div style='padding:32px'>"
                + "<h2 style='color:#2d3436;margin:0 0 8px'>Leave Approved!</h2>"
                + "<div style='background:#f5f6fa;border-radius:8px;padding:20px;margin-bottom:24px'>"
                + "<p style='margin:0 0 8px'><strong>Leave type:</strong> " + leaveType + "</p>"
                + "<p style='margin:0 0 8px'><strong>From:</strong> " + fromDate + "</p>"
                + "<p style='margin:0'><strong>To:</strong> " + toDate + "</p></div>"
                + "<p style='color:#636e72'>Enjoy your time off, " + name + "!</p></div>"
                + "<div style='padding:20px 32px;border-top:1px solid #f1efe8'>"
                + "<p style='color:#b2bec3;font-size:12px;margin:0'>Workly HR Platform</p></div></div></body></html>";
    }

    private String buildLeaveRejectedEmail(String name, String fromDate, String toDate, String reason) {
        return "<!DOCTYPE html><html><body style='font-family:Arial,sans-serif;background:#f5f6fa;margin:0;padding:20px'>"
                + "<div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)'>"
                + "<div style='background:#2d3436;padding:32px;text-align:center'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px'>Workly</h1></div>"
                + "<div style='padding:32px'>"
                + "<h2 style='color:#2d3436;margin:0 0 8px'>Leave Request Update</h2>"
                + "<p style='color:#636e72;margin:0 0 24px'>Hi " + name + ", your leave request has been reviewed.</p>"
                + "<div style='background:#fff5f5;border-left:4px solid #d63031;padding:16px;border-radius:0 8px 8px 0'>"
                + "<p style='margin:0 0 8px;color:#d63031;font-weight:600'>Not approved</p>"
                + "<p style='margin:0 0 8px;color:#636e72'>From: " + fromDate + " To: " + toDate + "</p>"
                + "<p style='margin:0;color:#636e72'>Reason: " + (reason != null ? reason : "No reason provided") + "</p></div></div>"
                + "<div style='padding:20px 32px;border-top:1px solid #f1efe8'>"
                + "<p style='color:#b2bec3;font-size:12px;margin:0'>Workly HR Platform</p></div></div></body></html>";
    }
}