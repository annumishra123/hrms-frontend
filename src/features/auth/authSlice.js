// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { login } from "../../api/authApi";

// export const loginAdmin = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
//   try {
//     return await login(data);
//   } catch (err) {
//     return rejectWithValue(err.message);
//   }
// });

// const storedUser = (() => {
//   try {
//     return JSON.parse(sessionStorage.getItem("hrms_admin_user"));
//   } catch {
//     return null;
//   }
// })();

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: storedUser || null,
//     token: storedUser ? "mock-jwt-token" : null,
//     status: "idle",
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       sessionStorage.removeItem("hrms_admin_user");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginAdmin.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(loginAdmin.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.user = action.payload.data.user;
//         state.token = action.payload.data.accessToken
//         sessionStorage.setItem("hrms_admin_user", JSON.stringify(action.payload.data.user));
//       })
//       .addCase(loginAdmin.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Login faillsed";
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../../api/authApi";

export const loginAdmin = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    return await login(data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});


const storedUser = (() => {
  try {
    return JSON.parse(sessionStorage.getItem("hrms_admin_user"));
  } catch {
    return null;
  }
})();

const storedToken = sessionStorage.getItem("hrms_admin_token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    token: storedToken,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("hrms_admin_user");
      sessionStorage.removeItem("hrms_admin_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;

        sessionStorage.setItem("hrms_admin_user", JSON.stringify(action.payload.data.user));
        sessionStorage.setItem("hrms_admin_token", action.payload.data.accessToken);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;