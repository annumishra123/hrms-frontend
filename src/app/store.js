import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import employeesReducer from "../features/employees/employeesSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";
import leaveReducer from "../features/leave/leaveSlice";
import payrollReducer from "../features/payroll/payrollSlice";
import recruitmentReducer from "../features/recruitment/recruitmentSlice";
import performanceReducer from "../features/performance/performanceSlice";
import announcementsReducer from "../features/announcements/announcementsSlice";
import documentsReducer from "../features/documents/documentsSlice";
import orgChartReducer from "../features/orgchart/orgChartSlice";
import reportsReducer from "../features/reports/reportsSlice";
import usersReducer from "../features/users/usersSlice";
import uiReducer from "../features/ui/uiSlice";
import holidayReducer from '../features/holiday/holidaySlice'
import ticketsAdminReducer from '../features/tickets/ticketsAdminSlice';

import officeLocationReducer from "../features/officeLocation/officeLocationSlice";

import notificationReducer from '../features/notifications/notificationSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    employees: employeesReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    payroll: payrollReducer,
    recruitment: recruitmentReducer,
    performance: performanceReducer,
    announcements: announcementsReducer,
    documents: documentsReducer,
    orgChart: orgChartReducer,
    reports: reportsReducer,
    users: usersReducer,
    ui: uiReducer,
    holidays: holidayReducer,
    ticketsAdmin: ticketsAdminReducer,
    officeLocation: officeLocationReducer,
    adminNotifications:notificationReducer,
  },
});
