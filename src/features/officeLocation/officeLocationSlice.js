import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor"; // apke existing axios instance ka path use karein

// GET /api/office-location
export const fetchOfficeLocation = createAsyncThunk(
  "officeLocation/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/office-location");
      return res.data.office;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Location fetch nahi ho payi");
    }
  }
);

// POST /api/office-location
export const saveOfficeLocation = createAsyncThunk(
  "officeLocation/save",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/location/office-location", payload);
      return res.data.office;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Location save nahi ho payi");
    }
  }
);

const officeLocationSlice = createSlice({
  name: "officeLocation",
  initialState: {
    office: null,
    status: "idle", // idle | loading | succeeded | failed
    saveStatus: "idle",
    error: null,
  },
  reducers: {
    clearOfficeLocationError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfficeLocation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOfficeLocation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.office = action.payload;
      })
      .addCase(fetchOfficeLocation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveOfficeLocation.pending, (state) => {
        state.saveStatus = "loading";
      })
      .addCase(saveOfficeLocation.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.office = action.payload;
      })
      .addCase(saveOfficeLocation.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearOfficeLocationError } = officeLocationSlice.actions;
export default officeLocationSlice.reducer;