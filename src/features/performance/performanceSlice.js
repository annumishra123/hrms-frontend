import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/mockApi";

export const fetchPerformance = createAsyncThunk("performance/fetch", async () => {
  return await api.getPerformance();
});

const performanceSlice = createSlice({
  name: "performance",
  initialState: { reviews: [], okrs: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload.reviews;
        state.okrs = action.payload.okrs;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default performanceSlice.reducer;
