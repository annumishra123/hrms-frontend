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