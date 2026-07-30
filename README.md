# TechSoft HRMS — Admin Panel

A fully responsive **React.js + Tailwind CSS + Redux Toolkit** admin dashboard for the HRMS Mobile App
roadmap. Covers all admin-facing modules shown in the reference dashboard mockup: Dashboard analytics,
Employees, Attendance, Leave approvals, Payroll, Recruitment, Performance & OKRs, Organization Chart,
Reports & Analytics, Announcements, Documents Vault and Settings.

## Tech Stack

- **React 19** + **Vite** — app shell & build tooling
- **Redux Toolkit** — global state, one slice per module, `createAsyncThunk` for data fetching
- **React Router v6** — routing + protected admin routes
- **Tailwind CSS 3** — utility-first styling, custom navy/brand theme
- **Recharts** — dashboard/report charts (area, bar, line, pie)
- **lucide-react** — icon set

## Mock API layer (swap-in ready for a real backend)

All data currently comes from `src/api/mockApi.js`, which wraps `src/data/mockData.js` and returns
**Promises with artificial network latency** — exactly like a real `fetch`/`axios` call would. Redux
thunks (`src/features/*/*.js`) call these functions the same way they'd call a real REST endpoint.

To connect the real Node.js/Express + MongoDB API, edit `src/api/mockApi.js` and replace each function
body with an `axios.get('/api/...')` call. No component or Redux slice code needs to change since the
function signatures already match what a real API should return.

## Getting Started

```bash
npm install
npm run dev       # start local dev server (http://localhost:5173)
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## Login

The login screen is pre-filled with a demo admin account — just click **Sign in to Admin Panel**
(no real backend/auth is wired up, it's a mock `loginAdmin` thunk that resolves after ~700ms).

## Project Structure

```
src/
  api/mockApi.js          # simulated REST layer (swap for real API)
  data/mockData.js        # seed data: employees, attendance, leave, payroll, etc.
  app/store.js             # Redux store, combines all slices
  features/<module>/       # one Redux slice per module (auth, employees, attendance, leave,
                            # payroll, recruitment, performance, announcements, documents,
                            # orgchart, reports, ui)
  components/
    layout/                # Sidebar, Topbar, AdminLayout, ProtectedRoute
    ui/                     # StatCard, Badge, Avatar, Modal, Spinner, PageHeader, EmptyState
  pages/                   # one page per route (Dashboard, Employees, Attendance, Leave,
                            # Payroll, Recruitment, Performance, OrgChart, Reports,
                            # Announcements, Documents, Settings, Login)
```

## Responsiveness

- Sidebar collapses into a slide-in mobile drawer below the `lg` breakpoint.
- All KPI grids, tables (horizontal scroll on small screens) and charts adapt from a 1-column mobile
  layout up to a 4-column desktop layout.
- Modals become bottom sheets on mobile, centered dialogs on desktop.

## Notes

- Avatars are generated via DiceBear (public, no auth) using employee name seeds.
- Currency values are formatted in INR (Rs.) with the `en-IN` locale.
- This is a self-contained frontend; all "writes" (approve leave, add employee, publish
  announcement, move candidate stage) update Redux/mock-API state only and reset on page reload.
# hrms-frontend
