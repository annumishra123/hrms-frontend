import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  CalendarDays,
  Wallet,
  Briefcase,
  Target,
  Network,
  BarChart3,
  Megaphone,
  FolderLock,
  Settings,
  X,
  Building2,
  ShieldCheck,
  ChevronDown,
  LifeBuoy,
  ClipboardCheck,
  Receipt,
} from "lucide-react";
import { closeSidebar } from "../../features/ui/uiSlice";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/holiday-calendar", label: "Holiday Calendar", icon: CalendarDays },
  { to: "/helpdesk", label: "Helpdesk Tickets", icon: LifeBuoy },
  {
    label: "Attendance",
    icon: CalendarCheck2,
    children: [
      { to: "/attendance", label: "Today", end: true },
      { to: "/attendance/monthly", label: "Monthly Log" },
      { to: "/attendance/summary", label: "Summary" },
    ],
  },
  { to: "/leave", label: "Leave Requests", icon: CalendarDays },
  { to: "/regularize", label: "Regularize Requests", icon: ClipboardCheck },
  {
    label: "Payroll",
    icon: Wallet,
    children: [
      { to: "/payroll", label: "Overview", end: true },
      { to: "/payroll/payslips", label: "Payslips" },
      { to: "/payroll/structure", label: "Salary Structure" },
    ],
  },
  {
    label: "Expenses",
    icon: Receipt,
    children: [
      { to: "/expenses", label: "All Expenses", end: true },
      { to: "/expenses?status=Pending", label: "Pending Approvals" },
      { to: "/expenses?status=Approved", label: "Approved" },
      { to: "/expenses?status=Rejected", label: "Rejected" },
    ],
  },
  // { to: "/recruitment", label: "Recruitment", icon: Briefcase },
  { to: "/performance", label: "Performance & OKRs", icon: Target },
  { to: "/org-chart", label: "Organization Chart", icon: Network },
  { to: "/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/documents", label: "Documents Vault", icon: FolderLock },
  // { to: "/user-management", label: "User Management", icon: ShieldCheck },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { to: "/settings/office-location", label: "Office Location", end: true },
      { to: "/settings", label: "General Settings" },
    ],
  },
];

function NavGroup({ item, onNavigate }) {
  const location = useLocation();
  const isChildActive = item.children.some((c) => location.pathname === c.to.split("?")[0]);
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`nav-link w-full justify-between ${isChildActive ? "nav-link-active" : ""}`}
      >
        <span className="flex items-center gap-3">
          <item.icon size={18} strokeWidth={2} />
          <span className="truncate">{item.label}</span>
        </span>
        <ChevronDown
          size={15}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="ml-8 mt-1 space-y-1 border-l border-white/10 pl-3">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-brand-500/15 text-brand-300 font-semibold"
                    : "text-navy-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-soft">
          <Building2 size={18} strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="font-display font-bold text-white text-sm">TechSoft HRMS</p>
          <p className="text-[11px] text-navy-300">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-2 space-y-1">
        {NAV.map((item) =>
          item.children ? (
            <NavGroup key={item.label} item={item} onNavigate={onNavigate} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              <item.icon size={18} strokeWidth={2} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="p-4 mx-3 mb-3 rounded-xl bg-white/5 text-navy-200 text-xs">
        <p className="font-semibold text-white mb-1">Need help?</p>
        <p className="text-navy-300">Reach the platform team via the Helpdesk module.</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-navy-900 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className={`lg:hidden fixed inset-0 z-40 ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-200 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => dispatch(closeSidebar())}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-navy-900 shadow-2xl transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => dispatch(closeSidebar())}
            className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-navy-300 hover:bg-white/10"
          >
            <X size={18} />
          </button>
          <SidebarContent onNavigate={() => dispatch(closeSidebar())} />
        </aside>
      </div>
    </>
  );
}