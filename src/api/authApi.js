import axiosInstance from "./interceptor";

export const login = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);  
  return response.data;
};



export const getAllEmp = async (data) => {  
  const response = await axiosInstance.get("/employees/all-emp", data);  
  return response.data;
};

export const activeAccountDactied = async (userId, data) => {  
  const response = await axiosInstance.put(`admin/emp-deactivate/${userId}`, data);   
  return response.data;
};


export const createUserByadmin = async (data) => {  
  const response = await axiosInstance.post(`auth/register`, data);   
  return response.data;
};


// Employee ki basic detail update (designation/department)
export const updateEmployeeById = async (userId, data) => {
  const response = await axiosInstance.put(`employees/${userId}`, data);
  return response.data;
};

// Salary structure (Basic, HRA, Allowances, PF, Professional Tax) update
export const updateEmployeeSalary = async (userId, data) => {
  const response = await axiosInstance.put(`employees/${userId}/salary`, data);
  return response.data;
};