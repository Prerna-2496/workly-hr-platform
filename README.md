# Workly

**A multi-tenant HR & payroll platform with approval-gated authentication**

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-brightgreen)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Workly is a full-stack HR system modeled on how production platforms like Rippling actually work — built around real organizational hierarchy, not just CRUD endpoints with a login screen bolted on.

---

## The core idea: access is earned, not assumed

Most student projects let anyone register and immediately use the app. Workly doesn't.

Every new account starts as a **request**, stored in a completely separate table from real users. A Super Admin or HR Admin has to explicitly review and approve it before a loginable account is ever created. There's no flag to bypass and no backdoor — the account simply does not exist until someone in authority approves it.
Super Admin  →  approves HR Admins

HR Admin     →  approves Managers and Employees, scoped to their own company

Manager      →  approves Employee leave requests

Employee     →  self-service only

Every step in this chain — new requests, approvals, rejections — triggers a real email notification, sent via Gmail SMTP.

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3, Java 17, Spring Security |
| Auth | JWT (role + tenant ID embedded in token) |
| Database | MySQL, Hibernate / JPA |
| PDF generation | iText |
| Email | Spring Mail (Gmail SMTP) |
| Frontend | React, TypeScript, Tailwind CSS |
| Data viz | Recharts |
| HTTP client | Axios |

---

## Features

| Module | What it actually does |
|---|---|
| **Multi-tenancy** | Every entity carries a `tenantId`. Every query filters by it, scoped from the logged-in user's JWT. Multiple companies share one database with zero cross-tenant data leakage. |
| **Payroll engine** | Computes real deductions — PF at 12% of basic, slab-based professional tax, income tax on annualized gross — to produce an actual net salary. Generates a branded, downloadable PDF payslip on demand. |
| **Leave management** | Two-step approval state machine: a manager must approve before HR can give final sign-off. Leave balance is only deducted on final approval. |
| **Onboarding** | Auto-generates a five-task checklist for every new employee, with live completion tracking. |
| **Attendance** | Clock in/out with real business rules baked in — clocking in after 9:15 AM is auto-flagged late, under 4 hours worked auto-marks a half day. |
| **Audit logging** | Every sensitive action — payroll runs, approvals, clock-ins — writes a permanent, queryable log entry. |
| **Scheduler** | Cron-based background jobs: automatic monthly payroll execution and daily overdue-task checks, independent of any user action. |

---

## Project structure
hr-platform/

├── src/main/java/com/hrplatform/hr_platform/

│   ├── config/              JWT filter, security config, CORS

│   ├── common/               Audit logging, email service, dashboard, scheduler

│   └── module/

│       ├── auth/              Login, access requests, role hierarchy

│       ├── employee/          Employee CRUD

│       ├── leave/             Leave application and approval workflow

│       ├── payroll/           Tax computation, payroll runs, PDF payslips

│       ├── onboarding/         Task checklist engine

│       └── attendance/         Clock in/out, monthly summaries

└── workly/                     React + TypeScript frontend

└── src/

├── pages/               One component per route

├── components/          Shared layout (role-aware sidebar)

└── api.ts                Axios client with auto-attached JWT

---

## Running it locally

**Backend**
```bash
cd hr-platform
```
Set your MySQL credentials, JWT secret, and Gmail app password in `src/main/resources/application.properties`, then:
```bash
mvn spring-boot:run
```

**Frontend**
```bash
cd hr-platform/workly
npm install
npm start
```

Backend runs on `localhost:8081`, frontend on `localhost:3000`.

---

## A bug worth mentioning

While testing the approval system, I found that an HR Admin could approve access requests belonging to a *different* company — the approval endpoint only checked whether a request was pending, not whether it actually belonged to the approver's own tenant. I added an explicit authorization check at the service layer, and confirmed the fix by verifying a cross-tenant approval attempt now correctly fails with an authorization error rather than silently succeeding.

---
