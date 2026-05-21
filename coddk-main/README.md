# Coddk – Educational Platform (Frontend)

Coddk is a modern educational CRM platform designed to simplify student registration workflows, employee management, and verification processes.  
The frontend is built with React and Bootstrap, providing a responsive, fast, and user-friendly interface for students, employees, admins, and superadmins.

---

# Overview

The platform allows educational organizations to:

- Accept public student registrations
- Verify users through email confirmation
- Manage submissions and application statuses
- Control employees and administrators
- Enable or disable verification globally
- Monitor pending registrations
- Provide a modern dashboard experience

The application supports Arabic RTL layouts and includes a modern dark-themed UI with glassmorphism styling.

---

# Tech Stack

### Core Technologies

- **React 19**
- **Vite**
- **React Router 7**
- **Bootstrap 5**
- **Axios**

### UI & Styling

- Arabic RTL support
- Cairo & Tajawal fonts
- Responsive design
- Dark mode UI
- Glassmorphism cards and components

---

# Main Features

## Authentication System

- JWT-based authentication
- Role-based access control
- Employee login
- Admin login
- Superadmin login
- Persistent authentication using local storage/context

---

## Student Registration

Students can:

- Submit registration forms directly
- Verify submissions using email confirmation codes
- Complete forms without creating accounts

The verification process can be enabled or disabled globally by the superadmin.

---

## Dashboard Management

Authorized users can:

- View all submissions
- Search submissions instantly
- Edit submission data
- Delete submissions
- Update submission statuses

---

## Employee & Admin Management

Admins and superadmins can:

- Create employees
- Create admins
- Edit user information
- Delete accounts
- Enable or disable direct-add permissions

---

## Pending Submissions

The system includes a dedicated pending submissions section where:

- Pending applications are displayed separately
- Superadmins can permanently clear all pending records

---

## Global Settings

Superadmins can control platform-wide settings including:

- Email verification toggle
- Registration workflow behavior

---

## Additional UI Features

- Floating WhatsApp contact button
- Responsive mobile-first design
- Smooth navigation experience
- Reusable component architecture

---

# Project Structure

```bash
src/
├── api/           # Axios configuration and API interceptors
├── components/    # Shared reusable components
├── context/       # Authentication and global state management
├── pages/         # Application pages
├── Router/        # Route configuration
├── assets/        # Static assets
└── index.css      # Global styles
