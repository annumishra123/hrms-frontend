import { useState } from "react";
import { useSelector } from "react-redux";
import { Moon, Sun, Globe, Bell, ShieldCheck } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Avatar from "../components/ui/Avatar";

const LANGS = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Gujarati"];

export default function Settings() {
  const user = useSelector((s) => s.auth.user);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("English");
  const [notifs, setNotifs] = useState({ email: true, push: true, whatsapp: false, sms: false });

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your admin profile, notifications and platform preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 card p-6 text-center h-fit">
          <Avatar src={user?.avatar} name={user?.name} size={80} />
          <p className="font-display font-bold text-slate-800 mt-4">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.role}</p>
          <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          <button className="btn-secondary w-full mt-5">Edit Profile</button>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={17} className="text-navy-700" />
              <h3 className="font-display font-bold text-slate-800">Notification Preferences</h3>
            </div>
            <div className="space-y-3">
              {Object.entries({ email: "Email alerts", push: "Push notifications", whatsapp: "WhatsApp Business updates", sms: "SMS alerts" }).map(
                ([key, label]) => (
                  <label key={key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-600">{label}</span>
                    <button
                      onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                      className={`w-11 h-6 rounded-full transition relative ${notifs[key] ? "bg-navy-800" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifs[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </label>
                )
              )}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={17} className="text-navy-700" />
              <h3 className="font-display font-bold text-slate-800">Language & Appearance</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Display Language</label>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="input">
                  {LANGS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Theme</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDark(false)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold border ${!dark ? "bg-navy-800 text-white border-navy-800" : "border-slate-200 text-slate-500"}`}
                  >
                    <Sun size={15} /> Light
                  </button>
                  <button
                    onClick={() => setDark(true)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold border ${dark ? "bg-navy-800 text-white border-navy-800" : "border-slate-200 text-slate-500"}`}
                  >
                    <Moon size={15} /> Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={17} className="text-navy-700" />
              <h3 className="font-display font-bold text-slate-800">Security</h3>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-slate-600 font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400">OTP-based verification for sensitive actions</p>
              </div>
              <button className="btn-secondary">Enable</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
