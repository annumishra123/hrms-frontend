import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Search, Bell, ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { openSidebar } from "../../features/ui/uiSlice";
import { logout } from "../../features/auth/authSlice";
import Avatar from "../ui/Avatar";
import { useNavigate } from "react-router-dom";
import NotificationBell from './NotificationBell';

export default function Topbar({ title }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur border-b border-slate-100 flex items-center gap-3 px-4 sm:px-6">
      <button
        onClick={() => dispatch(openSidebar())}
        className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
      >
        <Menu size={20} />
      </button>

      <h2 className="hidden sm:block font-display font-semibold text-slate-700 mr-2 truncate">{title}</h2>

      <div className="max-w-md hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 text-sm text-slate-400 focus-within:ring-2 focus-within:ring-brand-400">
        <Search size={16} />
        <input
          placeholder="Search employees, requests, payslips..."
          className="bg-transparent outline-none w-full text-slate-600 placeholder:text-slate-400"
        />
      </div>

      <div className="flex-1" />

      <button className="relative h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100">
        <Bell size={19} />
        <NotificationBell />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100"
        >
          <Avatar src={user?.avatar} name={user?.name} size={32} />
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
            <p className="text-[11px] text-slate-400">{user?.role}</p>
          </div>
          <ChevronDown size={15} className="text-slate-400 hidden sm:block" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-soft border border-slate-100 py-1.5 z-20">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <UserCircle2 size={16} /> My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}