package com.hrplatform.hr_platform.module.payroll.controller;

import com.hrplatform.hr_platform.module.payroll.dto.PayrollRequest;
import com.hrplatform.hr_platform.module.payroll.entity.PayrollLineItem;
import com.hrplatform.hr_platform.module.payroll.service.PayrollService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.PdfPTable;

import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/run")
    public ResponseEntity<?> runPayroll(
            @Valid @RequestBody PayrollRequest req,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                payrollService.runPayroll(req.getMonth(), req.getYear(), tenantId));
    }

    @GetMapping("/runs")
    public ResponseEntity<?> getAllRuns(HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(payrollService.getAllRuns(tenantId));
    }

    @GetMapping("/runs/{runId}/payslips")
    public ResponseEntity<?> getPayslips(
            @PathVariable Long runId,
            HttpServletRequest request) {
        return ResponseEntity.ok(payrollService.getPayslipsForRun(runId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getEmployeePayslips(
            @PathVariable Long employeeId,
            HttpServletRequest request) {
        Long tenantId = (Long) request.getAttribute("tenantId");
        return ResponseEntity.ok(
                payrollService.getEmployeePayslips(employeeId, tenantId));
    }

    @GetMapping("/runs/{runId}/payslips/{employeeId}/pdf")
    public ResponseEntity<byte[]> downloadPayslip(
            @PathVariable Long runId,
            @PathVariable Long employeeId,
            HttpServletRequest request) throws Exception {

        List<PayrollLineItem> items = payrollService.getPayslipsForRun(runId);
        PayrollLineItem item = items.stream()
                .filter(i -> i.getEmployeeId().equals(employeeId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Payslip not found"));

        byte[] pdf = generatePayslipPdf(item);

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition",
                        "attachment; filename=payslip-emp" + employeeId
                                + "-" + item.getMonth() + "-" + item.getYear() + ".pdf")
                .body(pdf);
    }

    private byte[] generatePayslipPdf(PayrollLineItem item) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);
        document.open();

        // ── Header ──
        Font brandFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD,
                new BaseColor(108, 99, 255));
        Paragraph brand = new Paragraph("Workly", brandFont);
        brand.setAlignment(Element.ALIGN_CENTER);
        document.add(brand);

        Font tagFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL,
                new BaseColor(136, 135, 128));
        Paragraph tag = new Paragraph("HR · Payroll · People", tagFont);
        tag.setAlignment(Element.ALIGN_CENTER);
        document.add(tag);

        document.add(new Paragraph(" "));

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD,
                new BaseColor(15, 14, 26));
        Paragraph title = new Paragraph(
                "PAYSLIP — " + getMonthName(item.getMonth()) + " " + item.getYear(),
                titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(" "));

        // ── Employee info ──
        Font labelFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL,
                new BaseColor(136, 135, 128));
        Font valueFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD,
                new BaseColor(15, 14, 26));

        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setSpacingBefore(8);

        addInfoCell(infoTable, "Employee ID", "#" + item.getEmployeeId(),
                labelFont, valueFont);
        addInfoCell(infoTable, "Pay Period",
                getMonthName(item.getMonth()) + " " + item.getYear(),
                labelFont, valueFont);
        addInfoCell(infoTable, "Tenant", "#" + item.getTenantId(),
                labelFont, valueFont);
        addInfoCell(infoTable, "Status", "PAID", labelFont, valueFont);

        document.add(infoTable);
        document.add(new Paragraph(" "));

        // ── Earnings table ──
        Font sectionFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD,
                new BaseColor(15, 14, 26));
        document.add(new Paragraph("Earnings", sectionFont));
        document.add(new Paragraph(" "));

        PdfPTable earningsTable = new PdfPTable(2);
        earningsTable.setWidthPercentage(100);
        earningsTable.setWidths(new float[]{3, 1});

        addTableHeader(earningsTable, "Component", "Amount");
        addTableRow(earningsTable, "Basic Salary",
                "₹" + fmt(item.getBasicSalary()), false);
        addTableRow(earningsTable, "House Rent Allowance (HRA)",
                "₹" + fmt(item.getHra()), false);
        addTableRow(earningsTable, "Special Allowance",
                "₹" + fmt(item.getAllowance()), false);
        addTableRow(earningsTable, "Gross Salary",
                "₹" + fmt(item.getGrossSalary()), true);

        document.add(earningsTable);
        document.add(new Paragraph(" "));

        // ── Deductions table ──
        document.add(new Paragraph("Deductions", sectionFont));
        document.add(new Paragraph(" "));

        PdfPTable deductTable = new PdfPTable(2);
        deductTable.setWidthPercentage(100);
        deductTable.setWidths(new float[]{3, 1});

        addTableHeader(deductTable, "Component", "Amount");
        addTableRow(deductTable, "Provident Fund (12% of Basic)",
                "-₹" + fmt(item.getProvidentFund()), false);
        addTableRow(deductTable, "Professional Tax",
                "-₹" + fmt(item.getProfessionalTax()), false);
        addTableRow(deductTable, "Income Tax (New Regime)",
                "-₹" + fmt(item.getIncomeTax()), false);

        document.add(deductTable);
        document.add(new Paragraph(" "));

        // ── Net salary box ──
        PdfPTable netTable = new PdfPTable(2);
        netTable.setWidthPercentage(100);

        PdfPCell netLabel = new PdfPCell(new Phrase("NET SALARY",
                new Font(Font.FontFamily.HELVETICA, 13, Font.BOLD,
                        new BaseColor(108, 99, 255))));
        netLabel.setBorderColor(new BaseColor(108, 99, 255));
        netLabel.setPadding(10);
        netLabel.setBackgroundColor(new BaseColor(238, 237, 254));

        PdfPCell netValue = new PdfPCell(new Phrase("₹" + fmt(item.getNetSalary()),
                new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD,
                        new BaseColor(59, 109, 17))));
        netValue.setBorderColor(new BaseColor(108, 99, 255));
        netValue.setPadding(10);
        netValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
        netValue.setBackgroundColor(new BaseColor(238, 237, 254));

        netTable.addCell(netLabel);
        netTable.addCell(netValue);
        document.add(netTable);

        document.add(new Paragraph(" "));

        // ── Footer ──
        Font footerFont = new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC,
                new BaseColor(136, 135, 128));
        Paragraph footer = new Paragraph(
                "This is a system-generated payslip from Workly HR Platform. "
                        + "No signature required.", footerFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return out.toByteArray();
    }

    private void addInfoCell(PdfPTable table, String label, String value,
                             Font labelFont, Font valueFont) {
        PdfPCell lc = new PdfPCell(new Phrase(label, labelFont));
        lc.setBorder(Rectangle.NO_BORDER);
        lc.setPadding(4);

        PdfPCell vc = new PdfPCell(new Phrase(value, valueFont));
        vc.setBorder(Rectangle.NO_BORDER);
        vc.setPadding(4);

        table.addCell(lc);
        table.addCell(vc);
    }

    private void addTableHeader(PdfPTable table, String col1, String col2) {
        Font hf = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD,
                BaseColor.WHITE);
        PdfPCell c1 = new PdfPCell(new Phrase(col1, hf));
        PdfPCell c2 = new PdfPCell(new Phrase(col2, hf));
        c1.setBackgroundColor(new BaseColor(15, 14, 26));
        c2.setBackgroundColor(new BaseColor(15, 14, 26));
        c1.setPadding(6);
        c2.setPadding(6);
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(c1);
        table.addCell(c2);
    }

    private void addTableRow(PdfPTable table, String label,
                             String value, boolean bold) {
        Font f = bold
                ? new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD,
                new BaseColor(15, 14, 26))
                : new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL,
                new BaseColor(15, 14, 26));

        PdfPCell c1 = new PdfPCell(new Phrase(label, f));
        PdfPCell c2 = new PdfPCell(new Phrase(value, f));
        c1.setPadding(6);
        c2.setPadding(6);
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(c1);
        table.addCell(c2);
    }

    private String fmt(Double val) {
        if (val == null) return "0";
        return String.format("%,.2f", val);
    }

    private String getMonthName(Integer month) {
        String[] months = {"Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"};
        if (month == null || month < 1 || month > 12) return "";
        return months[month - 1];
    }
}