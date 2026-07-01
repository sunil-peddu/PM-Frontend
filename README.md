# Sprintix — Frontend

A multi-tenant task management platform built with React.js 18 and Tailwind CSS. Sprintix supports four permission levels, org-level data isolation, and role-specific dashboards — designed to help teams manage tasks, track progress, and maintain accountability across projects.

---

## Live Demo

> Coming soon — deploying to Vercel

---

## Screenshots
<img width="1280" height="600" alt="image" src="https://github.com/user-attachments/assets/395eb412-fcfb-477b-a3cd-6d2cb3f48d0a" />


---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React.js 18 |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| Auth & State | React Context API, JWT |
| API Integration | Axios |
| Session Management | localStorage |
| Dev Tools | VS Code, Chrome DevTools, Git |

---

## Features

- **Four-role hierarchy** — Super Admin, Admin, Manager, and User roles with distinct permissions and UI views
- **Role-based dashboards** — each role sees only the data and actions relevant to their access level
- **JWT authentication** — secure login with token-based session management and persistent auth state
- **Org-level data isolation** — each organisation's data is fully separated from others
- **Notification polling** — real-time notification updates without WebSockets
- **Audit logging** — tracks user actions across the platform for accountability
- **Reusable component library** — shared buttons, modals, forms, and tables used across all views
- **Responsive design** — fully functional across desktop, tablet, and mobile screen sizes

---

## Role Access Guide

| Role | Permissions |
|---|---|
| Super Admin | Full platform access — manage all orgs, users, and settings |
| Admin | Manage users and projects within their organisation |
| Manager | Create and assign tasks, view team progress |
| User | View and update assigned tasks only |


---

## Author

**Peddu Sunil**
[linkedin.com/in/sunilpeddu](https://linkedin.com/in/sunilpeddu) | sunilpeddu1612@gmail.com
