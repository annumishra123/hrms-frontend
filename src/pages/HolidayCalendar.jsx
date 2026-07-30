import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Plus, Trash2, Pencil, X, Save, Loader2 } from "lucide-react";
import { fetchHolidays, addHolidaysBulk, editHoliday, removeHoliday } from "../features/holiday/holidaySlice";

const TYPE_STYLES = {
  Public: "bg-emerald-500/15 text-emerald-400",
  Optional: "bg-amber-500/15 text-amber-400",
  Restricted: "bg-rose-500/15 text-rose-400",
};

const emptyRow = () => ({ title: "", date: "", type: "Public", description: "" });

function BulkAddModal({ onClose }) {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([emptyRow()]);
  const [saving, setSaving] = useState(false);

  const updateRow = (i, field, value) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };
  const addRow = () => setRows((r) => [...r, emptyRow()]);
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const valid = rows.filter((r) => r.title.trim() && r.date);
    if (valid.length === 0) return;
    setSaving(true);
    await dispatch(addHolidaysBulk(valid));
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
          <h3 className="font-display font-bold text-navy-900 text-lg">Add Holidays</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-navy-50/60 rounded-xl p-3">
              <input
                placeholder="Holiday name"
                value={row.title}
                onChange={(e) => updateRow(i, "title", e.target.value)}
                className="col-span-4 rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="date"
                value={row.date}
                onChange={(e) => updateRow(i, "date", e.target.value)}
                className="col-span-3 rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <select
                value={row.type}
                onChange={(e) => updateRow(i, "type", e.target.value)}
                className="col-span-2 rounded-lg border border-navy-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option>Public</option>
                <option>Optional</option>
                <option>Restricted</option>
              </select>
              <input
                placeholder="Note (optional)"
                value={row.description}
                onChange={(e) => updateRow(i, "description", e.target.value)}
                className="col-span-2 rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={() => removeRow(i)}
                disabled={rows.length === 1}
                className="col-span-1 h-9 w-9 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 disabled:opacity-30"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={addRow}
            className="flex items-center gap-1.5 text-brand-600 text-sm font-semibold hover:underline"
          >
            <Plus size={15} /> Add another row
          </button>
        </div>

        <div className="px-6 py-4 border-t border-navy-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-navy-500 hover:bg-navy-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save {rows.filter((r) => r.title.trim() && r.date).length || ""} Holiday(s)
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ holiday, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: holiday.title,
    date: holiday.date?.slice(0, 10),
    type: holiday.type,
    description: holiday.description || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await dispatch(editHoliday({ id: holiday._id, data: form }));
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
          <h3 className="font-display font-bold text-navy-900 text-lg">Edit Holiday</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-400">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Holiday name"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option>Public</option>
            <option>Optional</option>
            <option>Restricted</option>
          </select>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Note (optional)"
            rows={2}
          />
        </div>
        <div className="px-6 py-4 border-t border-navy-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-navy-500 hover:bg-navy-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HolidayCalendar() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.holidays);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    dispatch(fetchHolidays(year));
  }, [dispatch, year]);

  const grouped = list.reduce((acc, h) => {
    const month = new Date(h.date).toLocaleString("default", { month: "long" });
    acc[month] = acc[month] || [];
    acc[month].push(h);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy-900">Holiday Calendar</h1>
          <p className="text-navy-400 text-sm mt-0.5">{list.length} holidays scheduled for {year}</p>
        </div>
        <button
          onClick={() => setShowBulkModal(true)}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-soft"
        >
          <Plus size={16} /> Add Holidays
        </button>
      </div>

      {status === "loading" && list.length === 0 ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={28} /></div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-navy-300">
          <CalendarDays size={40} />
          <p className="mt-3 text-sm">No holidays added yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {Object.entries(grouped).map(([month, holidays]) => (
            <div key={month} className="bg-white rounded-2xl shadow-soft border border-navy-100 overflow-hidden">
              <div className="px-5 py-3 bg-navy-50/60 font-display font-bold text-navy-700 text-sm">{month}</div>
              <div className="divide-y divide-navy-100">
                {holidays.map((h) => (
                  <div key={h._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-navy-50/40 group">
                    <div className="flex items-center gap-4">
                      <div className="text-center w-12 shrink-0">
                        <p className="font-display font-bold text-navy-900 text-lg leading-none">
                          {new Date(h.date).getDate()}
                        </p>
                        <p className="text-[10px] text-navy-400 uppercase mt-0.5">
                          {new Date(h.date).toLocaleString("default", { weekday: "short" })}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-navy-800 text-sm">{h.title}</p>
                        {h.description && <p className="text-xs text-navy-400 mt-0.5">{h.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${TYPE_STYLES[h.type]}`}>
                        {h.type}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditing(h)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-navy-400 hover:bg-brand-50 hover:text-brand-600"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => window.confirm(`Delete "${h.title}"?`) && dispatch(removeHoliday(h._id))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-navy-400 hover:bg-rose-50 hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showBulkModal && <BulkAddModal onClose={() => setShowBulkModal(false)} />}
      {editing && <EditModal holiday={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}