// Central mock dataset — simulates the records a real HRMS API/DB would return.
// Every module (Employees, Attendance, Leave, Payroll, Recruitment, Performance,
// Announcements, Documents, Org Chart, Reports) reads from here via src/api/mockApi.js.

export const departments = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Sales & Marketing",
  "Customer Support",
  "Design",
];

const avatarSeed = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

export const employees = [
  { id: "EMP0125", name: "Anurag Mishra", designation: "Software Developer", department: "Engineering", email: "anurag.mishra@techsoft.com", phone: "+91 98765 43210", status: "Active", joinDate: "2022-03-14", manager: "Rohit Mehta", location: "Bengaluru", avatar: avatarSeed("anurag") },
  { id: "EMP0142", name: "Riya Singh", designation: "React Developer", department: "Engineering", email: "riya.singh@techsoft.com", phone: "+91 98450 11223", status: "Active", joinDate: "2023-01-09", manager: "Rohit Mehta", location: "Bengaluru", avatar: avatarSeed("riya") },
  { id: "EMP0098", name: "Priya Sharma", designation: "HR Manager", department: "Human Resources", email: "priya.sharma@techsoft.com", phone: "+91 99011 22334", status: "Active", joinDate: "2020-06-01", manager: "Neha Verma", location: "Pune", avatar: avatarSeed("priya") },
  { id: "EMP0076", name: "Rohit Verma", designation: "Backend Engineer", department: "Engineering", email: "rohit.verma@techsoft.com", phone: "+91 98230 44556", status: "Active", joinDate: "2021-11-20", manager: "Rohit Mehta", location: "Hyderabad", avatar: avatarSeed("rohitv") },
  { id: "EMP0110", name: "Karan Mehta", designation: "Product Designer", department: "Design", email: "karan.mehta@techsoft.com", phone: "+91 97712 33441", status: "On Leave", joinDate: "2022-08-17", manager: "Isha Kapoor", location: "Bengaluru", avatar: avatarSeed("karan") },
  { id: "EMP0133", name: "Pooja Verma", designation: "QA Engineer", department: "Engineering", email: "pooja.verma@techsoft.com", phone: "+91 96540 88221", status: "Active", joinDate: "2023-04-02", manager: "Rohit Mehta", location: "Pune", avatar: avatarSeed("pooja") },
  { id: "EMP0055", name: "Neha Verma", designation: "HR Head", department: "Human Resources", email: "neha.verma@techsoft.com", phone: "+91 98110 22110", status: "Active", joinDate: "2019-02-11", manager: "-", location: "Pune", avatar: avatarSeed("neha") },
  { id: "EMP0088", name: "Karan Waheera", designation: "Finance Head", department: "Finance", email: "karan.waheera@techsoft.com", phone: "+91 99887 65543", status: "Active", joinDate: "2020-09-23", manager: "-", location: "Mumbai", avatar: avatarSeed("karanw") },
  { id: "EMP0044", name: "Rohit Mehta", designation: "Engineering Head", department: "Engineering", email: "rohit.mehta@techsoft.com", phone: "+91 97654 32109", status: "Active", joinDate: "2018-07-04", manager: "-", location: "Bengaluru", avatar: avatarSeed("rohitm") },
  { id: "EMP0201", name: "Isha Kapoor", designation: "Design Head", department: "Design", email: "isha.kapoor@techsoft.com", phone: "+91 91234 56789", status: "Active", joinDate: "2019-10-30", manager: "-", location: "Bengaluru", avatar: avatarSeed("isha") },
  { id: "EMP0212", name: "Aditya Rao", designation: "Sales Executive", department: "Sales & Marketing", email: "aditya.rao@techsoft.com", phone: "+91 90000 11122", status: "Active", joinDate: "2023-06-19", manager: "Neha Verma", location: "Delhi", avatar: avatarSeed("aditya") },
  { id: "EMP0219", name: "Simran Kaur", designation: "Support Lead", department: "Customer Support", email: "simran.kaur@techsoft.com", phone: "+91 90909 88776", status: "Inactive", joinDate: "2021-01-15", manager: "Neha Verma", location: "Chandigarh", avatar: avatarSeed("simran") },
];

export const attendanceToday = {
  present: 198,
  absent: 18,
  halfDay: 8,
  onLeave: 12,
  totalEmployees: 256,
  percentPresent: 86,
};

export const attendanceTrend = [
  { day: "10 May", present: 240, absent: 16 },
  { day: "11 May", present: 235, absent: 21 },
  { day: "12 May", present: 248, absent: 8 },
  { day: "13 May", present: 210, absent: 46 },
  { day: "14 May", present: 244, absent: 12 },
  { day: "15 May", present: 250, absent: 6 },
  { day: "16 May", present: 198, absent: 18 },
];

export const attendanceLog = [
  { id: 1, empId: "EMP0125", name: "Anurag Mishra", avatar: avatarSeed("anurag"), checkIn: "09:16 AM", checkOut: "06:32 PM", status: "Present", mode: "Face Login", hours: "9h 16m" },
  { id: 2, empId: "EMP0142", name: "Riya Singh", avatar: avatarSeed("riya"), checkIn: "09:02 AM", checkOut: "06:10 PM", status: "Present", mode: "QR Code", hours: "9h 08m" },
  { id: 3, empId: "EMP0076", name: "Rohit Verma", avatar: avatarSeed("rohitv"), checkIn: "09:45 AM", checkOut: "—", status: "Present", mode: "GPS", hours: "In progress" },
  { id: 4, empId: "EMP0110", name: "Karan Mehta", avatar: avatarSeed("karan"), checkIn: "—", checkOut: "—", status: "On Leave", mode: "-", hours: "-" },
  { id: 5, empId: "EMP0133", name: "Pooja Verma", avatar: avatarSeed("pooja"), checkIn: "10:05 AM", checkOut: "02:00 PM", status: "Half Day", mode: "QR Code", hours: "3h 55m" },
  { id: 6, empId: "EMP0212", name: "Aditya Rao", avatar: avatarSeed("aditya"), checkIn: "—", checkOut: "—", status: "Absent", mode: "-", hours: "-" },
  { id: 7, empId: "EMP0219", name: "Simran Kaur", avatar: avatarSeed("simran"), checkIn: "09:30 AM", checkOut: "06:00 PM", status: "Present", mode: "Face Login", hours: "8h 30m" },
];

export const leaveTypes = ["Casual Leave", "Earned Leave", "Sick Leave", "Work From Home", "Loss of Pay"];

export const leaveRequests = [
  { id: "LR1001", empId: "EMP0098", name: "Priya Sharma", avatar: avatarSeed("priya"), type: "Casual Leave", from: "2025-05-16", to: "2025-05-17", days: 2, reason: "Family function", status: "Pending", appliedOn: "2025-05-10" },
  { id: "LR1002", empId: "EMP0076", name: "Rohit Verma", avatar: avatarSeed("rohitv"), type: "Earned Leave", from: "2025-05-20", to: "2025-05-21", days: 2, reason: "Personal work", status: "Pending", appliedOn: "2025-05-12" },
  { id: "LR1003", empId: "EMP0110", name: "Karan Mehta", avatar: avatarSeed("karan"), type: "Sick Leave", from: "2025-05-14", to: "2025-05-15", days: 2, reason: "Fever", status: "Approved", appliedOn: "2025-05-13" },
  { id: "LR1004", empId: "EMP0133", name: "Pooja Verma", avatar: avatarSeed("pooja"), type: "Work From Home", from: "2025-05-19", to: "2025-05-19", days: 1, reason: "Internet issue at office", status: "Approved", appliedOn: "2025-05-11" },
  { id: "LR1005", empId: "EMP0212", name: "Aditya Rao", avatar: avatarSeed("aditya"), type: "Casual Leave", from: "2025-05-22", to: "2025-05-23", days: 2, reason: "Travel", status: "Rejected", appliedOn: "2025-05-09" },
];

export const leaveBalance = { casual: 12, earned: 18, sick: 6, privilege: 3 };

export const payrollSummary = {
  month: "May 2025",
  totalPayroll: "₹1.25 Cr",
  employeesPaid: 254,
  pending: 2,
  avgSalary: "₹78,500",
};

export const payrollTrend = [
  { month: "Dec", amount: 118 },
  { month: "Jan", amount: 119 },
  { month: "Feb", amount: 121 },
  { month: "Mar", amount: 120 },
  { month: "Apr", amount: 123 },
  { month: "May", amount: 125 },
];

export const payslips = [
  { empId: "EMP0125", name: "Anurag Mishra", avatar: avatarSeed("anurag"), designation: "Software Developer", basic: 50000, hra: 15000, special: 10000, other: 3500, pf: 6000, tax: 200, net: 78500, status: "Paid" },
  { empId: "EMP0142", name: "Riya Singh", avatar: avatarSeed("riya"), designation: "React Developer", basic: 48000, hra: 14000, special: 9500, other: 3000, pf: 5760, tax: 150, net: 68590, status: "Paid" },
  { empId: "EMP0098", name: "Priya Sharma", avatar: avatarSeed("priya"), designation: "HR Manager", basic: 62000, hra: 18000, special: 12000, other: 4200, pf: 7440, tax: 620, net: 88140, status: "Paid" },
  { empId: "EMP0076", name: "Rohit Verma", avatar: avatarSeed("rohitv"), designation: "Backend Engineer", basic: 52000, hra: 15500, special: 10500, other: 3200, pf: 6240, tax: 240, net: 74720, status: "Pending" },
  { empId: "EMP0110", name: "Karan Mehta", avatar: avatarSeed("karan"), designation: "Product Designer", basic: 46000, hra: 13500, special: 8800, other: 2800, pf: 5520, tax: 130, net: 65450, status: "Pending" },
];

export const openPositions = [
  { id: "JD-201", title: "React Developer", department: "Engineering", location: "Bengaluru", type: "Full-time", applicants: 34, status: "Open", postedOn: "2025-05-01" },
  { id: "JD-202", title: "Node.js Backend Engineer", department: "Engineering", location: "Remote", type: "Full-time", applicants: 28, status: "Open", postedOn: "2025-04-22" },
  { id: "JD-203", title: "UI/UX Designer", department: "Design", location: "Pune", type: "Full-time", applicants: 19, status: "Open", postedOn: "2025-05-05" },
  { id: "JD-204", title: "HR Executive", department: "Human Resources", location: "Mumbai", type: "Full-time", applicants: 12, status: "Open", postedOn: "2025-05-08" },
  { id: "JD-205", title: "QA Automation Engineer", department: "Engineering", location: "Hyderabad", type: "Contract", applicants: 15, status: "On Hold", postedOn: "2025-04-18" },
];

export const candidates = [
  { id: "C-501", name: "Riya Singh", role: "React Developer", avatar: avatarSeed("riya"), appliedOn: "2025-05-17", stage: "Shortlisted", experience: "3 yrs" },
  { id: "C-502", name: "Karan Mehta", role: "React Developer", avatar: avatarSeed("karan"), appliedOn: "2025-05-16", stage: "Interview", experience: "4 yrs" },
  { id: "C-503", name: "Pooja Verma", role: "React Developer", avatar: avatarSeed("pooja"), appliedOn: "2025-05-16", stage: "Applied", experience: "2 yrs" },
  { id: "C-504", name: "Sameer Khan", role: "Node.js Backend Engineer", avatar: avatarSeed("sameer"), appliedOn: "2025-05-15", stage: "Offered", experience: "5 yrs" },
  { id: "C-505", name: "Ananya Das", role: "UI/UX Designer", avatar: avatarSeed("ananya"), appliedOn: "2025-05-14", stage: "Interview", experience: "3 yrs" },
  { id: "C-506", name: "Vikram Joshi", role: "HR Executive", avatar: avatarSeed("vikram"), appliedOn: "2025-05-12", stage: "Rejected", experience: "2 yrs" },
];

export const performanceReviews = [
  { empId: "EMP0125", name: "Anurag Mishra", avatar: avatarSeed("anurag"), designation: "Software Developer", overallRating: 4.6, self: 4.5, manager: 4.3, peers: 4.1, directReports: 4.0, cycle: "Q2 2025" },
  { empId: "EMP0142", name: "Riya Singh", avatar: avatarSeed("riya"), designation: "React Developer", overallRating: 4.3, self: 4.4, manager: 4.2, peers: 4.0, directReports: -1, cycle: "Q2 2025" },
  { empId: "EMP0076", name: "Rohit Verma", avatar: avatarSeed("rohitv"), designation: "Backend Engineer", overallRating: 4.0, self: 4.1, manager: 3.9, peers: 3.8, directReports: -1, cycle: "Q2 2025" },
  { empId: "EMP0110", name: "Karan Mehta", avatar: avatarSeed("karan"), designation: "Product Designer", overallRating: 4.4, self: 4.5, manager: 4.4, peers: 4.2, directReports: -1, cycle: "Q2 2025" },
];

export const okrs = [
  { id: 1, empId: "EMP0125", objective: "Improve Product Quality", progress: 70, keyResults: [{ label: "Reduce bugs by 30%", progress: 70 }, { label: "Increase code coverage", progress: 70 }, { label: "Improve review time", progress: 60 }] },
  { id: 2, empId: "EMP0142", objective: "Ship React Native migration", progress: 55, keyResults: [{ label: "Migrate 10 core screens", progress: 60 }, { label: "Cut bundle size 20%", progress: 45 }, { label: "Zero P1 regressions", progress: 90 }] },
];

export const announcements = [
  { id: 1, title: "Office Holiday", body: "The office will be closed on account of Buddha Purnima.", date: "2025-05-24", category: "Company", audience: "All Employees" },
  { id: 2, title: "Townhall Meeting", body: "Company-wide townhall on Q1 results and roadmap at 11 AM in the main auditorium.", date: "2025-05-20", category: "Company", audience: "All Employees" },
  { id: 3, title: "New Policy Update", body: "Updated Work From Home policy is now live — please review and acknowledge.", date: "2025-05-14", category: "HR Policy", audience: "All Employees" },
  { id: 4, title: "Payroll Cycle Reminder", body: "Submit expense claims before 25th to be included in this month's payroll run.", date: "2025-05-12", category: "Finance", audience: "All Employees" },
];

export const documentsVault = [
  { id: 1, name: "Aadhaar Card", employee: "Anurag Mishra", uploadedOn: "2025-01-10", status: "Verified", type: "Identity" },
  { id: 2, name: "PAN Card", employee: "Anurag Mishra", uploadedOn: "2025-01-10", status: "Verified", type: "Identity" },
  { id: 3, name: "Offer Letter", employee: "Riya Singh", uploadedOn: "2025-02-01", status: "Verified", type: "Employment" },
  { id: 4, name: "Salary Slip - Apr", employee: "Rohit Verma", uploadedOn: "2025-04-30", status: "Verified", type: "Payroll" },
  { id: 5, name: "Experience Letter", employee: "Pooja Verma", uploadedOn: "2025-03-20", status: "Pending Review", type: "Employment" },
];

export const orgChart = {
  name: "Rohit Mehta",
  title: "Engineering Head",
  avatar: avatarSeed("rohitm"),
  team: "23 Employees",
  children: [
    { name: "Anurag Mishra", title: "Software Developer", avatar: avatarSeed("anurag"), team: "" },
    { name: "Riya Singh", title: "React Developer", avatar: avatarSeed("riya"), team: "" },
    { name: "Rohit Verma", title: "Backend Engineer", avatar: avatarSeed("rohitv"), team: "" },
  ],
  peers: [
    { name: "Neha Verma", title: "HR Head", avatar: avatarSeed("neha"), team: "18 Employees" },
    { name: "Karan Waheera", title: "Finance Head", avatar: avatarSeed("karanw"), team: "16 Employees" },
    { name: "Isha Kapoor", title: "Design Head", avatar: avatarSeed("isha"), team: "12 Employees" },
  ],
};

export const departmentDistribution = [
  { name: "Engineering", value: 96, color: "#255ce6" },
  { name: "Sales & Marketing", value: 42, color: "#14b8a6" },
  { name: "Customer Support", value: 38, color: "#f59e0b" },
  { name: "Human Resources", value: 26, color: "#ec4899" },
  { name: "Finance", value: 30, color: "#8b5cf6" },
  { name: "Design", value: 24, color: "#0ea5e9" },
];

export const monthlyHiring = [
  { month: "Dec", hires: 6 },
  { month: "Jan", hires: 9 },
  { month: "Feb", hires: 7 },
  { month: "Mar", hires: 11 },
  { month: "Apr", hires: 8 },
  { month: "May", hires: 12 },
];

export const attritionTrend = [
  { month: "Dec", rate: 2.1 },
  { month: "Jan", rate: 1.8 },
  { month: "Feb", rate: 2.4 },
  { month: "Mar", rate: 1.6 },
  { month: "Apr", rate: 1.9 },
  { month: "May", rate: 1.4 },
];

export const auditLogs = [
  { id: 1, user: "Neha Verma", action: "Approved leave request LR1003", module: "Leave", timestamp: "2025-05-15 10:24 AM" },
  { id: 2, user: "Karan Waheera", action: "Generated payroll run for May 2025", module: "Payroll", timestamp: "2025-05-15 09:02 AM" },
  { id: 3, user: "Priya Sharma", action: "Updated employee profile EMP0110", module: "Employees", timestamp: "2025-05-14 05:41 PM" },
  { id: 4, user: "Admin", action: "Rejected leave request LR1005", module: "Leave", timestamp: "2025-05-14 02:10 PM" },
  { id: 5, user: "Rohit Mehta", action: "Published new job posting JD-205", module: "Recruitment", timestamp: "2025-05-13 11:55 AM" },
];

export const currentAdmin = {
  name: "Neha Verma",
  role: "HR Head / Admin",
  avatar: avatarSeed("neha"),
  email: "neha.verma@techsoft.com",
  company: "TechSoft Solutions Pvt. Ltd.",
};

// ---- Admin Users & RBAC ----
// Who creates admins: the first Super Admin is seeded directly in the
// database (see backend seed script). Every admin/HR user after that is
// created from this User Management screen by someone who already has the
// "Manage Users" permission (Super Admin or HR Head by default).

export const roles = [
  {
    id: "super_admin",
    label: "Super Admin",
    description: "Full access to every module, including creating other admins.",
    permissions: ["manage_users", "manage_payroll", "approve_leave", "manage_recruitment", "view_reports", "manage_settings"],
  },
  {
    id: "hr_manager",
    label: "HR Manager",
    description: "Manages employees, leave, recruitment and announcements.",
    permissions: ["approve_leave", "manage_recruitment", "view_reports"],
  },
  {
    id: "finance_admin",
    label: "Finance Admin",
    description: "Manages payroll, payslips and expense approvals.",
    permissions: ["manage_payroll", "view_reports"],
  },
  {
    id: "recruiter",
    label: "Recruiter",
    description: "Manages job postings and the candidate pipeline only.",
    permissions: ["manage_recruitment"],
  },
];

export const adminUsers = [
  { id: "U001", name: "Neha Verma", email: "neha.verma@techsoft.com", avatar: avatarSeed("neha"), roleId: "super_admin", status: "Active", createdBy: "System (initial seed)", createdOn: "2019-02-11", lastLogin: "2025-05-16 09:02 AM" },
  { id: "U002", name: "Priya Sharma", email: "priya.sharma@techsoft.com", avatar: avatarSeed("priya"), roleId: "hr_manager", status: "Active", createdBy: "Neha Verma", createdOn: "2020-06-05", lastLogin: "2025-05-15 05:41 PM" },
  { id: "U003", name: "Karan Waheera", email: "karan.waheera@techsoft.com", avatar: avatarSeed("karanw"), roleId: "finance_admin", status: "Active", createdBy: "Neha Verma", createdOn: "2020-09-25", lastLogin: "2025-05-14 11:20 AM" },
  { id: "U004", name: "Aditya Rao", email: "aditya.rao@techsoft.com", avatar: avatarSeed("aditya"), roleId: "recruiter", status: "Invited", createdBy: "Priya Sharma", createdOn: "2025-05-10", lastLogin: "—" },
];

