import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { socket } from "./socket";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Recruitment from "./pages/Recruitment";
import Performance from "./pages/Performance";
import OrgChart from "./pages/OrgChart";
import Reports from "./pages/Reports";
import Announcements from "./pages/Announcements";
import Documents from "./pages/Documents";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";

import AttendanceMonthly from "./pages/AttendanceMonthly";
import AttendanceSummary from "./pages/AttendanceSummary";

import PayrollOverview from "./pages/PayrollOverview";
import PayrollPayslips from "./pages/PayrollPayslips";

import HolidayCalendar from "./pages/HolidayCalendar";
import HelpdeskAdmin from "./pages/HelpdeskAdmin";

import OfficeLocationSettings from "./pages/OfficeLocationSettings";
import AdminSocketListener from "./components/AdminSocketListener";
import ExpensesPage from "./pages/ExpensesPage";
import RegularizeRequests from "./pages/RegularizeRequests";

// NOTE: purana "Payroll" page (./pages/Payroll) ab kahin bhi import/use
// nahi ho raha — wo dead/unused page tha jo hamesha "Loading payroll..."
// dikhata tha kyunki uska data fetch comment-out tha. Route "/payroll"
// ab sirf PayrollOverview par map hota hai.

export default function App() {
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("register", user._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <BrowserRouter>
      <AdminSocketListener />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<Leave />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="performance" element={<Performance />} />
          <Route path="org-chart" element={<OrgChart />} />
          <Route path="reports" element={<Reports />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="documents" element={<Documents />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />

          <Route path="/attendance/monthly" element={<AttendanceMonthly />} />
          <Route path="/attendance/summary" element={<AttendanceSummary />} />

          <Route path="/holiday-calendar" element={<HolidayCalendar />} />
          <Route path="/helpdesk" element={<HelpdeskAdmin />} />

          {/* FIX: sirf ek hi /payroll route — PayrollOverview (Run Payroll wala) */}
          <Route path="/payroll" element={<PayrollOverview />} />
          <Route path="/payroll/payslips" element={<PayrollPayslips />} />

          <Route path="/settings/office-location" element={<OfficeLocationSettings />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/regularize" element={<RegularizeRequests />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}