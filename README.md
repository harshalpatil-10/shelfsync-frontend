# ShelfSync — Library Management System (Frontend)

A React + Vite frontend for the ShelfSync Library Management System, talking to a Spring Boot + PostgreSQL backend.

## Tech Stack
- React 18 + Vite
- React Router v6
- Axios
- xlsx (client-side Excel export)

## Getting Started

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173

## Environment Variables

Copy `.env.example` to `.env` and set your backend URL:
```
VITE_API_BASE_URL=https://library-management-backend-cv4d.onrender.com/api
```

## Demo Login

Since the backend doesn't yet expose an authentication endpoint, login is a local-only placeholder:
- **Username:** `admin`
- **Password:** `shelfsync123`

Swap `src/utils/auth.js` for real API calls once the backend adds Spring Security / JWT.

## Known Backend Limitations (by design, not bugs)

- **Students (Members):** only Add + View + Search are available. The backend has no update/delete endpoints for members yet.
- **Recent Transactions** on the dashboard reflect actions taken in the current browser session only (stored in `localStorage`), since the backend has no "list all transactions" endpoint yet. Real stats (book counts, overdue list) come directly from the live API.
- **Login/Profile:** placeholder screens, since there's no user/auth backend yet.

## Building for Production

```bash
npm run build
```
Outputs to `dist/` — deploy this folder to Vercel, Netlify, or any static host.

## Project Structure

```
src/
├── components/    # Reusable UI pieces (Navbar, Sidebar, Modal, tables, etc.)
├── context/       # ThemeContext (dark mode)
├── layouts/       # MainLayout (Sidebar + Navbar + Footer wrapper)
├── pages/         # One folder per route, each with its own .jsx + .module.css
├── services/      # API calls (bookService, memberService, borrowService)
└── utils/         # auth, date helpers, export, activity log
```
