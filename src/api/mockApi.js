// Mock REST API layer.
// In a real deployment, every function below would be an axios/fetch call to
// the Node.js/Express backend (see roadmap doc, section "Technology Stack").
// Keeping the same function signatures means swapping to a real API later
// only requires editing this file — Redux slices and components don't change.

import * as data from "../data/mockData";

const LATENCY = 450;

const clone = (v) => JSON.parse(JSON.stringify(v));

const delay = (payload, ms = LATENCY) =>
  new Promise((resolve) => setTimeout(() => resolve(clone(payload)), ms));

export const api = {
  // Auth
  login: (email, password) => {
    if (!email || !password) {
      return Promise.reject(new Error("Email and password are required"));
    }
    return delay({ token: "mock-jwt-token", user: data.currentAdmin }, 700);
  },

  // Dashboard / Reports
  getDashboardOverview: () =>
    delay({
      attendanceToday: data.attendanceToday,
      attendanceTrend: data.attendanceTrend,
      payrollSummary: data.payrollSummary,
      departmentDistribution: data.departmentDistribution,
      totalEmployees: data.employees.length + 244,
      onLeave: data.attendanceToday.onLeave,
      newHires: data.monthlyHiring[data.monthlyHiring.length - 1].hires,
      openPositions: data.openPositions.filter((p) => p.status === "Open").length,
    }),

  getReports: () =>
    delay({
      departmentDistribution: data.departmentDistribution,
      monthlyHiring: data.monthlyHiring,
      attritionTrend: data.attritionTrend,
      payrollTrend: data.payrollTrend,
      attendanceTrend: data.attendanceTrend,
    }),

  // Employees
  getEmployees: () => delay(data.employees),
  getDepartments: () => delay(data.departments),

  // Attendance
  getAttendance: () =>
    delay({ today: data.attendanceToday, trend: data.attendanceTrend, log: data.attendanceLog }),

  // Leave
  getLeaveRequests: () => delay(data.leaveRequests),
  getLeaveBalance: () => delay(data.leaveBalance),
  updateLeaveStatus: (id, status) => {
    const request = data.leaveRequests.find((r) => r.id === id);
    if (request) request.status = status;
    return delay({ id, status });
  },

  // Payroll
  getPayroll: () => delay({ summary: data.payrollSummary, trend: data.payrollTrend, payslips: data.payslips }),

  // Recruitment
  getRecruitment: () => delay({ positions: data.openPositions, candidates: data.candidates }),
  updateCandidateStage: (id, stage) => {
    const c = data.candidates.find((c) => c.id === id);
    if (c) c.stage = stage;
    return delay({ id, stage });
  },

  // Performance
  getPerformance: () => delay({ reviews: data.performanceReviews, okrs: data.okrs }),

  // Announcements
  getAnnouncements: () => delay(data.announcements),
  createAnnouncement: (announcement) => {
    const newItem = { id: Date.now(), date: new Date().toISOString().slice(0, 10), ...announcement };
    data.announcements.unshift(newItem);
    return delay(newItem);
  },

  // Documents
  getDocuments: () => delay(data.documentsVault),

  // Org chart
  getOrgChart: () => delay(data.orgChart),

  // Audit logs
  getAuditLogs: () => delay(data.auditLogs),

  // Admin Users & RBAC — who can create/manage admins
  getRoles: () => delay(data.roles),
  getAdminUsers: () => delay(data.adminUsers),
  inviteAdminUser: ({ name, email, roleId, invitedBy }) => {
    const newUser = {
      id: `U${String(data.adminUsers.length + 1).padStart(3, "0")}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      roleId,
      status: "Invited",
      createdBy: invitedBy || "Admin",
      createdOn: new Date().toISOString().slice(0, 10),
      lastLogin: "—",
    };
    data.adminUsers.unshift(newUser);
    return delay(newUser);
  },
  updateAdminUserRole: (id, roleId) => {
    const u = data.adminUsers.find((u) => u.id === id);
    if (u) u.roleId = roleId;
    return delay({ id, roleId });
  },
  toggleAdminUserStatus: (id) => {
    const u = data.adminUsers.find((u) => u.id === id);
    if (u) u.status = u.status === "Active" ? "Suspended" : "Active";
    return delay({ id, status: u?.status });
  },
  removeAdminUser: (id) => {
    const idx = data.adminUsers.findIndex((u) => u.id === id);
    if (idx > -1) data.adminUsers.splice(idx, 1);
    return delay({ id, deleted: true });
  },
};
