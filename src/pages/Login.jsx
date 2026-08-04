import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { Building2, Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { loginAdmin } from "../features/auth/authSlice";
import Spinner from "../components/ui/Spinner";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, status, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
console.log(error,"sdmsdmsm,dm,s");

  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-navy-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-950 to-brand-900 p-12 flex-col justify-between">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-soft">
            <Building2 className="text-white" size={22} />
          </div>
          <div>
            <p className="font-display font-bold text-white">TechSoft Solutions</p>
            <p className="text-xs text-navy-300">HRMS Admin Console</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl font-bold text-white leading-tight max-w-md">
            Run your whole workforce from one panel.
          </h1>
          <p className="text-navy-300 mt-4 max-w-sm">
            Attendance, leave, payroll, recruitment and performance — approve, analyze and act in a
            single enterprise dashboard.
          </p>
          <div className="flex items-center gap-2 mt-8 text-sm text-navy-200">
            <ShieldCheck size={16} className="text-teal-400" />
            Role-based access · Audit-logged · DPDP aligned
          </div>
        </div>

        <p className="relative text-xs text-navy-400">© 2025 TechSoft Solutions Pvt. Ltd. — Confidential</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Building2 className="text-white" size={20} />
            </div>
            <p className="font-display font-bold text-navy-900">TechSoft HRMS</p>
          </div>

          <h2 className="font-display text-2xl font-bold text-slate-800">Welcome back, Admin</h2>
          <p className="text-sm text-slate-400 mt-1.5 mb-8">Sign in to access the HR admin panel.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Work email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-navy-700 focus:ring-navy-500" />
                Remember me
              </label>
              <button type="button" className="text-brand-600 font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="text-sm bg-rose-50 text-rose-600 rounded-lg px-3 py-2.5">{error}</div>
            )}

            <button type="submit" disabled={status === "loading"} className="btn-primary w-full mt-2">
              {status === "loading" ? (
                <>
                  <Spinner /> Signing in...
                </>
              ) : (
                "Sign in to Admin Panel"
              )}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-8">
            Demo credentials are pre-filled — just click Sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
