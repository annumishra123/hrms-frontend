import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/mockApi";

export const fetchOrgChart = createAsyncThunk("orgChart/fetch", async () => {
  return await api.getOrgChart();
});

const orgChartSlice = createSlice({
  name: "orgChart",
  initialState: { data: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgChart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrgChart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchOrgChart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default orgChartSlice.reducer;
