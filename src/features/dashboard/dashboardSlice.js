import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/mockApi";

export const fetchDashboard = createAsyncThunk("dashboard/fetch", async () => {
  return await api.getDashboardOverview();
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { data: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
