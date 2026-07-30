import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, ShieldCheck, MoreVertical, Ban, CheckCircle2, Trash2, Info } from "lucide-react";
import {
  fetchAdminUsers,
  inviteAdminUser,
  changeAdminUserRole,
  toggleAdminUserStatus,
  removeAdminUser,
} from "../features/users/usersSlice";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

const roleBadgeTone = {
  super_admin: "bg-navy-800 text-white",
  hr_manager: "bg-brand-50 text-brand-700",
  finance_admin: "bg-violet-50 text-violet-700",
  recruiter: "bg-teal-50 text-teal-700",
};

export default function UserManagement() {
  const dispatch = useDispatch();
  const { list, roles, status } = useSelector((s) => s.users);
  const currentUser = useSelector((s) => s.auth.user);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [menuFor, setMenuFor] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", roleId: "hr_manager" });

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const roleLabel = (roleId) => roles.find((r) => r.id === roleId)?.label || roleId;

  const handleInvite = (e) => {
    e.preventDefault();
    dispatch(inviteAdminUser(form));
    setForm({ name: "", email: "", roleId: "hr_manager" });
    setInviteOpen(false);
  };

  if (status === "loading" && !list.length) return <Spinner full label="Loading admin users..." />;

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Who can create and manage other admins — invite, assign roles, suspend or remove access."
        actions={
          <button onClick={() => setInviteOpen(true)} className="btn-primary">
            <UserPlus size={16} /> Invite Admin User
          </button>
        }
      />

      <div className="card p-4 mb-6 flex items-start gap-3 bg-brand-50/50 border-brand-100">
        <Info size={18} className="text-brand-600 mt-0.5 shrink-0" />
        <p className="text-sm text-brand-800">
          The very first <strong>Super Admin</strong> account is created by the backend team via a one-time
          database seed script during setup. Every admin/HR user after that is created right here by anyone
          holding the <strong>Manage Users</strong> permission.
        </p>
      </div>

      {/* Roles overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {roles.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-navy-700" />
              <p className="font-semibold text-slate-700 text-sm">{r.label}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{r.description}</p>
            <div className="flex flex-wrap gap-1">
              {r.permissions.map((p) => (
                <span key={p} className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-500 rounded-full px-2 py-1">
                  {p.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Admin users table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-display font-bold text-slate-800">Admin & HR Users ({list.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="table-th">User</th>
                <th className="table-th">Role</th>
                <th className="table-th">Created By</th>
                <th className="table-th">Last Login</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <Avatar src={u.avatar} name={u.name} size={34} />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-700 truncate">{u.name}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    {u.roleId === "super_admin" ? (
                      <span className={`badge ${roleBadgeTone[u.roleId]}`}>{roleLabel(u.roleId)}</span>
                    ) : (
                      <select
                        value={u.roleId}
                        onChange={(e) => dispatch(changeAdminUserRole({ id: u.id, roleId: e.target.value }))}
                        className="input !py-1.5 !px-2.5 text-xs !w-40"
                      >
                        {roles.filter((r) => r.id !== "super_admin").map((r) => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="table-td text-slate-500">{u.createdBy}</td>
                  <td className="table-td text-slate-500">{u.lastLogin}</td>
                  <td className="table-td"><Badge>{u.status}</Badge></td>
                  <td className="table-td text-right relative">
                    {u.roleId !== "super_admin" && (
                      <>
                        <button
                          onClick={() => setMenuFor(menuFor === u.id ? null : u.id)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 ml-auto"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {menuFor === u.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-soft border border-slate-100 py-1.5 z-20 text-left">
                              <button
                                onClick={() => {
                                  dispatch(toggleAdminUserStatus(u.id));
                                  setMenuFor(null);
                                }}
                                className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
                              >
                                {u.status === "Active" ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                                {u.status === "Active" ? "Suspend" : "Reactivate"}
                              </button>
                              <button
                                onClick={() => {
                                  dispatch(removeAdminUser(u.id));
                                  setMenuFor(null);
                                }}
                                className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 size={14} /> Remove Access
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Admin User">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="e.g. Sameer Khan" />
          </div>
          <div>
            <label className="label">Work Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="name@techsoft.com" />
          </div>
          <div>
            <label className="label">Role</label>
            <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} className="input">
              {roles.filter((r) => r.id !== "super_admin").map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1.5">{roles.find((r) => r.id === form.roleId)?.description}</p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2.5">
            Invited by <strong>{currentUser?.name}</strong> — an invite email with a setup link will be sent.
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setInviteOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Send Invite</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
