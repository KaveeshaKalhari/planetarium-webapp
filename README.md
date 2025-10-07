<div align="center">

# 🌌 Sri Lanka Planetarium Ticket Booking Management System 🎫

A modern web application built with **React**, **TypeScript**, and **Tailwind CSS** for managing online ticket booking at the **Sri Lanka Planetarium**.

---
</div>

## 🚀 Features

- 🎟️ **Online Ticket Booking** – View show schedules and reserve tickets instantly.  
- 🧑‍💼 **Admin Dashboard** – Manage shows, bookings, and user activity with ease.  
- 💳 **Payment Simulation** – Mock flow for handling online payments.  
- 🌌 **Responsive Design** – Optimized for desktop, tablet, and mobile using TailwindCSS.  
- 🔐 **Authentication** – Login and registration system for users and admins.  
- ⚙️ **Scalable Architecture** – Built with React + TypeScript for reliability and maintainability.

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend Framework** | React (with Vite) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Version Control** | Git & GitHub |
| **CI/CD** | GitHub Actions |
| **Deployment** | (Optional) GitHub Pages / Vercel / Netlify |

---

## 📂 Folder Structure

```plaintext
📦 planetarium-webapp/
├── 📁 .github/
│   └── 📁 workflows/           # GitHub Actions workflows (CI/CD)
│
├── 📁 .idea/                   # WebStorm project configuration files
│
├── 📁 node_modules/            # Installed npm dependencies
│
├── 📁 public/                  # Static public assets (index.html, icons, etc.)
│
├── 📁 src/
│   ├── 📁 assets/              # Images, icons, and static resources
│   ├── 📁 Components/          # Reusable UI components (Navbar, Footer, etc.)
│   ├── 📁 Pages/               # Page components (Home, Login, Register, Booking, etc.)
│   ├── App.css                 # Global styles
│   ├── App.tsx                 # Root React component
│   ├── index.css               # Base CSS (includes Tailwind directives)
│   └── main.tsx                # Application entry point
│
├── .gitignore                  # Files and folders ignored by Git
├── eslint.config.js            # ESLint configuration for code quality
├── index.html                  # Main HTML template
├── package.json                # Project dependencies and scripts
├── pnpm-lock.yaml              # Lock file for PNPM package manager
├── postcss.config.js           # Tailwind & PostCSS configuration
├── README.md                   # Project documentation
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # TypeScript app-specific config
├── tsconfig.node.json          # TypeScript node-specific config
└── vite.config.ts              # Vite configuration file
