import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/mockApi";

export const fetchDocuments = createAsyncThunk("documents/fetch", async () => {
  return await api.getDocuments();
});

const documentsSlice = createSlice({
  name: "documents",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default documentsSlice.reducer;
