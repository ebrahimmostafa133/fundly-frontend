# Fundly — Crowdfunding Platform Frontend

A modern, full-featured crowdfunding web application built with React, TypeScript, and Tailwind CSS. Fundly allows users to discover, create, and fund projects while engaging with the community through comments, ratings, and donations.

![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![ITI](https://img.shields.io/badge/ITI-Open_Source_Track-FF6B00?style=for-the-badge&logo=academia&logoColor=white)

🌐 **Live Demo:** [fundly-frontend.vercel.app](https://fundly-frontend.vercel.app/)
🔗 **Backend Repo:** [github.com/ahmed-ehab-reffat/Fundly-Backend](https://github.com/ahmed-ehab-reffat/Fundly-Backend)

---

## ✨ Features

- **Authentication** — Register, login, email activation, forgot/reset password
- **Project Management** — Create, edit, browse, and filter crowdfunding projects
- **Donations** — Donate to projects and track your donation history
- **Comments & Replies** — Threaded comments on project pages
- **Ratings** — Rate projects and view average scores
- **Reports** — Report inappropriate projects or comments
- **User Profiles** — Edit profile, change password, delete account
- **Protected Routes** — Auth-guarded pages with JWT token handling
- **Responsive UI** — Mobile-friendly layout with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React + React Icons |
| Linting | ESLint + TypeScript ESLint |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── api/                  # Axios instance & API service modules
│   ├── axiosInstance.ts
│   ├── authApi.ts
│   ├── projectsApi.ts
│   ├── donationsApi.ts
│   ├── commentsApi.ts
│   ├── ratingsApi.ts
│   └── reportsApi.ts
├── components/
│   └── shared/           # Reusable UI components (Header, Footer, Cards, Modals)
├── hooks/                # Custom React hooks
├── pages/
│   ├── Auth/             # Login, Register, Activate, Forgot/Reset Password
│   ├── Home/             # Landing page
│   ├── Profile/          # View, edit, change password, donations, delete
│   ├── Projects/         # List, create, edit projects
│   ├── ProjectDetails/   # Full project page with comments, ratings, donations
│   └── NotFound/         # 404 page
├── routes/               # App routing with auth guards
└── types/                # TypeScript interfaces and types
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A running instance of the [Fundly backend API](https://github.com/mostafa-khalifaa/fundly-backend) *(or any compatible Django REST API)*

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Mostafa-Khalifaa/fundly-frontend.git
cd fundly-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Edit `.env` with your backend URLs:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000
```

### Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

The app will be available at `http://localhost:5173` by default.

---

## 🔐 Authentication Flow

1. User registers → receives an activation email
2. Email link hits `/activate/:uidb64/:token`
3. On login, JWT access/refresh tokens are stored in `localStorage`
4. Axios instance attaches the `Authorization: Bearer <token>` header automatically
5. Protected routes redirect unauthenticated users to `/login`

---

## 🌐 Deployment

The project is configured for **Vercel** out of the box. The `vercel.json` rewrites all routes to `index.html` for client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

To deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Make sure to set your `VITE_API_BASE_URL` and `VITE_BACKEND_URL` environment variables in your Vercel project settings.

---

## 📄 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint on the codebase |

---

## 👥 Team

| GitHub | Name |
|--------|------|
| [@ebrahimmostafa133](https://github.com/ebrahimmostafa133) | Ebrahim Mostafa |
| [@Mostafa-Khalifaa](https://github.com/Mostafa-Khalifaa) | Mostafa Khalifa |
| [@Shahd3711](https://github.com/Shahd3711) | Shahd |
| [@Khaleddd11](https://github.com/Khaleddd11) | Khaled |
| [@ahmed-ehab-reffat](https://github.com/ahmed-ehab-reffat) | Ahmed Ehab |

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
