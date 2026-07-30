import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/mockApi";

export const fetchRecruitment = createAsyncThunk("recruitment/fetch", async () => {
  return await api.getRecruitment();
});

export const moveCandidateStage = createAsyncThunk("recruitment/moveStage", async ({ id, stage }) => {
  return await api.updateCandidateStage(id, stage);
});

const recruitmentSlice = createSlice({
  name: "recruitment",
  initialState: { positions: [], candidates: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruitment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecruitment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.positions = action.payload.positions;
        state.candidates = action.payload.candidates;
      })
      .addCase(fetchRecruitment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(moveCandidateStage.fulfilled, (state, action) => {
        const c = state.candidates.find((c) => c.id === action.payload.id);
        if (c) c.stage = action.payload.stage;
      });
  },
});

export default recruitmentSlice.reducer;
