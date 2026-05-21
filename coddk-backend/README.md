# Coddk – Educational Platform Backend

A secure and scalable RESTful API built with Node.js, Express, and MongoDB for managing student registrations, employee accounts, email verification workflows, and platform-wide settings.

The backend powers the Coddk educational CRM platform and provides role-based access control for employees, admins, and superadmins.

---

# Features

## Authentication & Authorization

- JWT-based authentication
- Secure login system
- Role-based access control
- Protected API routes
- Current authenticated user retrieval

Supported roles:

- Employee
- Admin
- Superadmin

---

## Student Submission System

The platform supports multiple registration workflows:

### Public Direct Submission

Students can submit registration forms directly without email verification.

### Email Verification Workflow

Students receive a verification code via email before the submission is accepted.

### Employee Submission Workflow

Employees can:

- Send verification codes manually
- Verify student submissions
- Add submissions directly

---

## Submission Management

Authorized users can:

- Retrieve all submissions
- Filter submissions by status
- Edit submission information
- Update submission status
- Delete submissions

Superadmins can additionally:

- Delete all pending submissions at once

---

## Employee & Admin Management

Admins and superadmins can:

- Create employee accounts
- Create admin accounts
- Update user information
- Delete users
- Control direct-add permissions

---

## Global Settings

Superadmins can manage public platform behavior including:

- Enable/disable email verification globally

---

# Tech Stack

## Backend

- Node.js
- Express 5

## Database

- MongoDB
- Mongoose

## Authentication & Security

- JWT (JSON Web Tokens)
- bcrypt

## Email Service

- Nodemailer
- Brevo SMTP / Gmail SMTP

---

# Project Structure

```bash
server/
├── controllers/      # Business logic
├── middleware/       # Authentication & authorization middleware
├── models/           # Mongoose database models
├── routes/           # API route definitions
├── scripts/          # Utility scripts
├── utils/            # Helper functions
├── config/           # Configuration files
├── server.js         # Application entry point
└── .env              # Environment variables
