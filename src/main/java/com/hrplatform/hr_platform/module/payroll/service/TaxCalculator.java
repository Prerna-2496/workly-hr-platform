package com.hrplatform.hr_platform.module.payroll.service;

import org.springframework.stereotype.Component;

@Component
public class TaxCalculator {

    // Professional Tax — Maharashtra slab
    public double calculateProfessionalTax(double monthlySalary) {
        if (monthlySalary <= 7500) return 0;
        if (monthlySalary <= 10000) return 175;
        return 200; // max professional tax per month
    }

    // Income Tax — New Regime FY 2024-25
    // Takes annual salary, returns monthly deduction
    public double calculateMonthlyIncomeTax(double annualSalary) {
        double tax = 0;

        if (annualSalary <= 300000) {
            tax = 0;
        } else if (annualSalary <= 600000) {
            tax = (annualSalary - 300000) * 0.05;
        } else if (annualSalary <= 900000) {
            tax = 15000 + (annualSalary - 600000) * 0.10;
        } else if (annualSalary <= 1200000) {
            tax = 45000 + (annualSalary - 900000) * 0.15;
        } else if (annualSalary <= 1500000) {
            tax = 90000 + (annualSalary - 1200000) * 0.20;
        } else {
            tax = 150000 + (annualSalary - 1500000) * 0.30;
        }

        // add 4% health and education cess
        tax = tax * 1.04;

        // return monthly amount
        return Math.round(tax / 12);
    }
}