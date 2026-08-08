import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  X,
  CheckCircle2,
  Edit2,
  IndianRupee,
} from "lucide-react";
import {
  fetchEmployees,
  setSearch,
  setDepartmentFilter,
  setStatusFilter,
  toggleEmployeeStatus,
  addEmployee,
  editEmployee,
  editEmployeeSalary,
} from "../features/employees/employeesSlice";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { departments } from "../data/mockData";

const ROLES = ["employee", "manager", "hr", "admin"];

const initialForm = {
  name: "",
  designation: "",
  department: departments[0],
  email: "",
  password: "",
  mobile: "",
  role: "employee",
};

// Model ke salary schema se match: basic, hra, specialAllowance, otherAllowance, pf, professionalTax
const initialSalaryForm = {
  basic: "",
  hra: "",
  specialAllowance: "",
  otherAllowance: "",
  pf: "",
  professionalTax: "",
};

export default function Employees() {
  const dispatch = useDispatch();
  const { list, status, search, department, statusFilter } = useSelector((s) => s.employees);

  // View modal
  const [selected, setSelected] = useState(null);

  // Add modal
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ designation: "", department: departments[0] });
  const [salaryForm, setSalaryForm] = useState(initialSalaryForm);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [toast, setToast] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filtered = list?.data?.filter((e) => {
    const matchSearch =
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e._id?.toLowerCase().includes(search.toLowerCase()) ||
      e.designation?.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "All" || e.department === department;
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  // ---- Add Employee ----
  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(addEmployee(form)).unwrap();
      setAddOpen(false);
      setToast(`${form.name || "New employee"} added successfully.`);
      setForm(initialForm);
      dispatch(fetchEmployees());
    } catch (err) {
      setToast(typeof err === "string" ? err : "Failed to add employee");
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  // ---- Activate/Deactivate ----
  const handleActivetd = (userId, isActive) => {
    dispatch(toggleEmployeeStatus({ userId, isActive }));
    setToast(`Employee status updated successfully.`);
    setTimeout(() => setToast(""), 3000);
  };

  // ---- Edit Employee (details + salary/PF/PT) ----
  const openEditModal = (emp) => {
    setEditTarget(emp);
    setEditForm({
      designation: emp.designation || "",
      department: emp.department || departments[0],
    });
    setSalaryForm({
      basic: emp.salary?.basic ?? "",
      hra: emp.salary?.hra ?? "",
      specialAllowance: emp.salary?.specialAllowance ?? "",
      otherAllowance: emp.salary?.otherAllowance ?? "",
      pf: emp.salary?.pf ?? "",
      professionalTax: emp.salary?.professionalTax ?? "",
    });
    setEditOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      // 1. Basic details (designation/department)
      await dispatch(editEmployee({ userId: editTarget._id, data: editForm })).unwrap();

      // 2. Salary structure — model schema ke exact fields
      await dispatch(
        editEmployeeSalary({
          userId: editTarget._id,
          salary: {
            basic: Number(salaryForm.basic) || 0,
            hra: Number(salaryForm.hra) || 0,
            specialAllowance: Number(salaryForm.specialAllowance) || 0,
            otherAllowance: Number(salaryForm.otherAllowance) || 0,
            pf: Number(salaryForm.pf) || 0,
            professionalTax: Number(salaryForm.professionalTax) || 0,
          },
        })
      ).unwrap();

      setEditOpen(false);
      setToast("Employee details updated successfully.");
      dispatch(fetchEmployees());
    } catch (err) {
      setToast(typeof err === "string" ? err : "Failed to update employee");
    } finally {
      setEditSubmitting(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle={`${list.length} employees across ${departments.length} departments`}
        actions={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={16} /> Add Employee
          </button>
        }
      />

      {/* Floating toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="rounded-xl bg-teal-50 text-teal-700 text-sm px-4 py-3 shadow-lg border border-teal-100 flex items-center gap-2 max-w-sm">
            <CheckCircle2 size={16} className="shrink-0" />
            <span className="flex-1">{toast}</span>
            <button onClick={() => setToast("")}><X size={15} /></button>
          </div>
        </div>
      )}

      <div className="card p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search by name, ID or designation..."
            className="bg-transparent outline-none w-full text-sm text-slate-600 placeholder:text-slate-400"
          />
        </div>
        <select
          value={department}
          onChange={(e) => dispatch(setDepartmentFilter(e.target.value))}
          className="input md:w-52"
        >
          <option>All</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          className="input md:w-44"
        >
          <option>All</option>
          <option>Active</option>
          <option>On Leave</option>
          <option>Inactive</option>
        </select>
      </div>

      {status === "loading" ? (
        <Spinner full />
      ) : filtered?.length === 0 ? (
        <div className="card">
          <EmptyState icon={Search} title="No employees found" subtitle="Try adjusting your search or filters." />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-th">Employee</th>
                  <th className="table-th">Department</th>
                  <th className="table-th">Location</th>
                  <th className="table-th">Joined</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered?.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <Avatar src={e.avatar} name={e.name} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-700 truncate">{e.name}</p>
                          <p className="text-xs text-slate-400 truncate">{e.designation} · {e.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td text-slate-500">{e.department}</td>
                    <td className="table-td text-slate-500">{e.location}</td>
                    <td className="table-td text-slate-500">{e.joinDate}</td>
                    <td className="table-td">
                      <button
                        type="button"
                        className="cursor-pointer inline-block w-16 text-left"
                        onClick={() => handleActivetd(e._id, !e.isActive)}
                      >
                        {e.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => setSelected(e)} className="text-brand-600 font-semibold hover:underline">
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(e)}
                          className="text-slate-500 hover:text-brand-600 inline-flex items-center gap-1"
                          title="Edit employee"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View profile modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Employee Profile">
        {selected && (
          <div>
            <div className="flex items-center gap-4 mb-5">
              <Avatar src={selected.avatar} name={selected.name} size={64} />
              <div>
                <p className="font-display font-bold text-lg text-slate-800">{selected.name}</p>
                <p className="text-sm text-slate-400">{selected.designation}</p>
                <div className="mt-1.5"><Badge>{selected.status}</Badge></div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600"><Mail size={16} className="text-slate-400" /> {selected.email}</div>
              <div className="flex items-center gap-3 text-slate-600"><Phone size={16} className="text-slate-400" /> {selected.phone}</div>
              <div className="flex items-center gap-3 text-slate-600"><MapPin size={16} className="text-slate-400" /> {selected.location}</div>
              <div className="flex items-center gap-3 text-slate-600"><Briefcase size={16} className="text-slate-400" /> {selected.department} · Reports to {selected.manager}</div>
            </div>

            {selected.salary && (
              <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Basic Salary</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">₹{selected.salary.basic ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">HRA</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">₹{selected.salary.hra ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Special Allowance</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">₹{selected.salary.specialAllowance ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Other Allowance</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">₹{selected.salary.otherAllowance ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">PF Deduction</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">₹{selected.salary.pf ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Professional Tax</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">₹{selected.salary.professionalTax ?? 0}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Employee ID</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{selected.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Joined</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{selected.updatedAt}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add employee modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Employee">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="e.g. Sameer Khan" />
          </div>

          <div>
            <label className="label">Designation</label>
            <input required value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="input" placeholder="e.g. Backend Engineer" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input">
                {departments.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input">
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Work Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="name@techsoft.com" />
          </div>

          <div>
            <label className="label">Mobile Number</label>
            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
              className="input"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-secondary flex-1" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary flex-1 disabled:opacity-50" disabled={submitting}>
              {submitting ? "Saving..." : "Save Employee"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit employee modal — details + salary/PF/professional tax */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={`Edit ${editTarget?.name || "Employee"}`}>
        <form onSubmit={handleEditSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Designation</label>
              <input
                required
                value={editForm.designation}
                onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                className="input"
                placeholder="e.g. Backend Engineer"
              />
            </div>
            <div>
              <label className="label">Department</label>
              <select
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                className="input"
              >
                {departments.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-3">
              <IndianRupee size={15} /> Salary Structure
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Basic Salary</label>
                <input
                  type="number"
                  min="0"
                  value={salaryForm.basic}
                  onChange={(e) => setSalaryForm({ ...salaryForm, basic: e.target.value })}
                  className="input"
                  placeholder="e.g. 40000"
                />
              </div>
              <div>
                <label className="label">HRA</label>
                <input
                  type="number"
                  min="0"
                  value={salaryForm.hra}
                  onChange={(e) => setSalaryForm({ ...salaryForm, hra: e.target.value })}
                  className="input"
                  placeholder="e.g. 15000"
                />
              </div>
              <div>
                <label className="label">Special Allowance</label>
                <input
                  type="number"
                  min="0"
                  value={salaryForm.specialAllowance}
                  onChange={(e) => setSalaryForm({ ...salaryForm, specialAllowance: e.target.value })}
                  className="input"
                  placeholder="e.g. 10000"
                />
              </div>
              <div>
                <label className="label">Other Allowance</label>
                <input
                  type="number"
                  min="0"
                  value={salaryForm.otherAllowance}
                  onChange={(e) => setSalaryForm({ ...salaryForm, otherAllowance: e.target.value })}
                  className="input"
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-700 mb-3">Deductions</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">PF Deduction</label>
                <input
                  type="number"
                  min="0"
                  value={salaryForm.pf}
                  onChange={(e) => setSalaryForm({ ...salaryForm, pf: e.target.value })}
                  className="input"
                  placeholder="e.g. 6000"
                />
              </div>
              <div>
                <label className="label">Professional Tax</label>
                <input
                  type="number"
                  min="0"
                  value={salaryForm.professionalTax}
                  onChange={(e) => setSalaryForm({ ...salaryForm, professionalTax: e.target.value })}
                  className="input"
                  placeholder="e.g. 200"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setEditOpen(false)} className="btn-secondary flex-1" disabled={editSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 disabled:opacity-50" disabled={editSubmitting}>
              {editSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}