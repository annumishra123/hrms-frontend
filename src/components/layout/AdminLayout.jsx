import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/attendance": "Attendance",
  "/leave": "Leave Requests",
  "/payroll": "Payroll",
  "/recruitment": "Recruitment",
  "/performance": "Performance & OKRs",
  "/org-chart": "Organization Chart",
  "/reports": "Reports & Analytics",
  "/announcements": "Announcements",
  "/documents": "Documents Vault",
  "/settings": "Settings",
};

export default function AdminLayout() {
  const location = useLocation();
  const title = TITLES[location.pathname] || "HRMS Admin";

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} />
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
