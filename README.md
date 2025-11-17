# Client Directory Structure

## Overview
This directory contains the frontend implementation of the Job Application Portal using React.js, Tailwind CSS, and GSAP.

## Directory Structure
```
client/
├── public/                 # Static assets
│   ├── index.html         # Main HTML file
│   └── ...
├── src/                   # Source code
│   ├── assets/            # Images, icons, GSAP animations
│   ├── components/        # Reusable React components
│   ├── pages/             # Route-specific pages
│   ├── context/           # React Context API for global state
│   ├── services/          # API calls using Axios
│   ├── styles/            # Tailwind CSS + custom styles
│   ├── hooks/             # Custom hooks
│   ├── App.jsx            # Main app component with routing
│   └── index.js           # Entry point
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Frontend dependencies
```

## Setup Instructions
1. Install dependencies: `npm install`
2. Run the development server: `npm start`

## Features
### Applicant Features
- Register/Login with secure JWT auth stored in HttpOnly cookies
- Browse jobs with filters and search (by location, category, etc.)
- Apply for jobs with resume upload
- Track job application statuses in dashboard

### Employer Features
- Register/Login secured by JWT auth
- Create, update, delete job postings
- View applicants for their jobs and update application statuses

### Admin Features
- View all users (applicants and employers), update/delete accounts
- Oversee all job listings, remove or edit inappropriate ones
- View all applications, update application statuses
- Role management and access control enforcement

## Technology Stack
- **Frontend**: React.js, Tailwind CSS, GSAP (animations), Axios, React Router
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **HTTP Client**: Axios