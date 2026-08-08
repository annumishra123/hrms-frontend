// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getAllEmp, activeAccountDactied, createUserByadmin } from "../../api/authApi";


// export const fetchEmployees = createAsyncThunk("employees/all-emp", async (data, { rejectWithValue }) => {
//   try {
//     return await getAllEmp(data);
//   } catch (err) {
//     return rejectWithValue(err.message);
//   }
// });


// export const toggleEmployeeStatus = createAsyncThunk(
//   "employees/deactivate",
//   async ({ userId, isActive }, { rejectWithValue }) => {
//     try {
//       const response = await activeAccountDactied(userId, { isActive });
//       return response;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );


// // Naya employee create karna (Admin)
// export const addEmployee = createAsyncThunk(
//   "employees/create",
//   async (employeeData, { rejectWithValue }) => {
//     try {
//       const response = await createUserByadmin(employeeData);
//       return response;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );


// const employeesSlice = createSlice({
//   name: "employees",
//   initialState: {
//     list: [],
//     status: "idle",
//     error: null,
//     search: "",
//     department: "All",
//     statusFilter: "All",
//   },
//   reducers: {
//     setSearch: (state, action) => {
//       state.search = action.payload;
//     },
//     setDepartmentFilter: (state, action) => {
//       state.department = action.payload;
//     },
//     setStatusFilter: (state, action) => {
//       state.statusFilter = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEmployees.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchEmployees.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.list = action.payload;
//       })
//       .addCase(fetchEmployees.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })

//       .addCase(toggleEmployeeStatus.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const { userId, isActive } = action.meta.arg;
//         const index = state.list.data.findIndex((emp) => emp._id === userId);
//         if (index !== -1) {
//           state.list.data[index].isActive = isActive;
//         }
//       })
//       .addCase(toggleEmployeeStatus.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })

//       // Add Employee
//       .addCase(addEmployee.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(addEmployee.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         // Naye employee ko list ke sabse upar daal do (turant dikhne ke liye)
//         if (state.list?.data && action.payload?.data) {
//           state.list.data.unshift(action.payload.data);
//         }
//       })
//       .addCase(addEmployee.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || action.error.message;
//       });
//   },
// });

// export const { setSearch, setDepartmentFilter, setStatusFilter } = employeesSlice.actions;
// export default employeesSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllEmp,
  activeAccountDactied,
  createUserByadmin,
  updateEmployeeById,
  updateEmployeeSalary,
} from "../../api/authApi";

export const fetchEmployees = createAsyncThunk("employees/all-emp", async (data, { rejectWithValue }) => {
  try {
    return await getAllEmp(data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleEmployeeStatus = createAsyncThunk(
  "employees/deactivate",
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const response = await activeAccountDactied(userId, { isActive });
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Naya employee create karna (Admin)
export const addEmployee = createAsyncThunk(
  "employees/create",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await createUserByadmin(employeeData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Employee ki basic detail edit (designation/department)
export const editEmployee = createAsyncThunk(
  "employees/edit",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await updateEmployeeById(userId, data);
      return { userId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Salary + PF + Professional Tax update
export const editEmployeeSalary = createAsyncThunk(
  "employees/editSalary",
  async ({ userId, salary }, { rejectWithValue }) => {
    try {
      const response = await updateEmployeeSalary(userId, salary);
      return { userId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    search: "",
    department: "All",
    statusFilter: "All",
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setDepartmentFilter: (state, action) => {
      state.department = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(toggleEmployeeStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { userId, isActive } = action.meta.arg;
        const index = state.list.data.findIndex((emp) => emp._id === userId);
        if (index !== -1) {
          state.list.data[index].isActive = isActive;
        }
      })
      .addCase(toggleEmployeeStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.list?.data && action.payload?.data) {
          state.list.data.unshift(action.payload.data);
        }
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Edit basic details (designation / department)
      .addCase(editEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { userId, data } = action.payload;
        const index = state.list.data.findIndex((emp) => emp._id === userId);
        if (index !== -1) {
          state.list.data[index] = { ...state.list.data[index], ...data };
        }
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Edit salary / PF / professional tax
      .addCase(editEmployeeSalary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editEmployeeSalary.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { userId, data } = action.payload;
        const index = state.list.data.findIndex((emp) => emp._id === userId);
        if (index !== -1) {
          state.list.data[index] = { ...state.list.data[index], salary: data.salary };
        }
      })
      .addCase(editEmployeeSalary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setSearch, setDepartmentFilter, setStatusFilter } = employeesSlice.actions;
export default employeesSlice.reducer;