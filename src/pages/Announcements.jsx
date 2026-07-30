import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Megaphone } from "lucide-react";
import { fetchAnnouncements, addAnnouncement, addAnnouncementRealtime,removeAnnouncementRealtime } from "../features/announcements/announcementsSlice";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import {socket} from '../socket'

const CATS = { Company: "bg-brand-50 text-brand-700", "HR Policy": "bg-violet-50 text-violet-700", Finance: "bg-teal-50 text-teal-700" };

export default function Announcements() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.announcements);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", category: "Company", audience: "All Employees" });

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);


   // ---- Socket: realtime updates ----
   useEffect(() => {
    socket.on("announcement:new", (announcement) => {
      dispatch(addAnnouncementRealtime(announcement));
    });

    socket.on("announcement:deleted", (payload) => {
      dispatch(removeAnnouncementRealtime(payload));
    });

    return () => {
      socket.off("announcement:new");
      socket.off("announcement:deleted");
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAnnouncement(form));
    setForm({ title: "", body: "", category: "Company", audience: "All Employees" });
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Company-wide updates delivered to every employee's feed."
        actions={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={16} /> New Announcement
          </button>
        }
      />

      {status === "loading" && !list.length ? (
        <Spinner full />
      ) : (
        <div className="space-y-4">
          {list.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center shrink-0">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{a.title}</p>
                    <p className="text-xs text-slate-400">{a.date} · {a.audience}</p>
                  </div>
                </div>
                <span className={`badge ${CATS[a.category] || "bg-slate-100 text-slate-600"} shrink-0`}>{a.category}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="e.g. Office Holiday" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input resize-none" placeholder="Write the announcement..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                <option>Company</option>
                <option>HR Policy</option>
                <option>Finance</option>
              </select>
            </div>
            <div>
              <label className="label">Audience</label>
              <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="input">
                <option>All Employees</option>
                <option>Engineering</option>
                <option>Management Only</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Publish</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
