import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPerformanceStats,
  getReviewCycles,
  getAllReviews,
  getAllOkrs,
  submitReviewRating as submitReviewApi,
  finalizeReview as finalizeReviewApi,
  createOkrForEmployee as createOkrApi,
  updateKeyResultProgressAdmin as updateKRApi,
  deleteOkr as deleteOkrApi,
  searchEmployeesLite,
} from "../../api/performanceApi";

// ---------- Thunks ----------

export const fetchPerformanceStats = createAsyncThunk(
  "performance/fetchStats",
  async (cycle, { rejectWithValue }) => {
    try {
      const res = await getPerformanceStats(cycle);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchReviewCycles = createAsyncThunk(
  "performance/fetchCycles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getReviewCycles();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAllReviews = createAsyncThunk(
  "performance/fetchAllReviews",
  async ({ cycle, page, limit, search, status }, { rejectWithValue }) => {
    try {
      return await getAllReviews({ cycle, page, limit, search, status });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAllOkrs = createAsyncThunk(
  "performance/fetchAllOkrs",
  async ({ cycle, page, limit, search }, { rejectWithValue }) => {
    try {
      return await getAllOkrs({ cycle, page, limit, search });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const submitReviewRating = createAsyncThunk(
  "performance/submitReview",
  async (data, { rejectWithValue }) => {
    try {
      const res = await submitReviewApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const finalizeReview = createAsyncThunk(
  "performance/finalizeReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const res = await finalizeReviewApi(reviewId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createOkrForEmployee = createAsyncThunk(
  "performance/createOkr",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createOkrApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateKeyResultProgress = createAsyncThunk(
  "performance/updateKR",
  async ({ okrId, keyResultIndex, progress }, { rejectWithValue }) => {
    try {
      const res = await updateKRApi(okrId, { keyResultIndex, progress });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteOkr = createAsyncThunk(
  "performance/deleteOkr",
  async (okrId, { rejectWithValue }) => {
    try {
      await deleteOkrApi(okrId);
      return okrId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const searchEmployeesForOkr = createAsyncThunk(
  "performance/searchEmployees",
  async (search, { rejectWithValue }) => {
    try {
      const res = await searchEmployeesLite(search);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ---------- Slice ----------

const initialState = {
  cycles: [],
  activeCycle: "",
  cyclesStatus: "idle",

  stats: null,
  statsStatus: "idle",

  reviews: [],
  reviewsTotalCount: 0,
  reviewsTotalPages: 1,
  reviewsCurrentPage: 1,
  reviewsStatus: "idle",

  okrs: [],
  okrsTotalCount: 0,
  okrsTotalPages: 1,
  okrsCurrentPage: 1,
  okrsStatus: "idle",

  actionStatus: "idle",
  actionError: null,

  employeeSearchResults: [],
  employeeSearchStatus: "idle",
};

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    setActiveCycle: (state, action) => {
      state.activeCycle = action.payload;
    },
    clearEmployeeSearch: (state) => {
      state.employeeSearchResults = [];
    },
    clearActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // cycles
      .addCase(fetchReviewCycles.pending, (state) => {
        state.cyclesStatus = "loading";
      })
      .addCase(fetchReviewCycles.fulfilled, (state, action) => {
        state.cyclesStatus = "succeeded";
        state.cycles = action.payload;
        if (!state.activeCycle && action.payload.length) {
          state.activeCycle = action.payload[0];
        }
      })
      .addCase(fetchReviewCycles.rejected, (state) => {
        state.cyclesStatus = "failed";
      })

      // stats
      .addCase(fetchPerformanceStats.pending, (state) => {
        state.statsStatus = "loading";
      })
      .addCase(fetchPerformanceStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchPerformanceStats.rejected, (state) => {
        state.statsStatus = "failed";
      })

      // reviews list
      .addCase(fetchAllReviews.pending, (state) => {
        state.reviewsStatus = "loading";
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.reviewsStatus = "succeeded";
        state.reviews = action.payload.data;
        state.reviewsTotalCount = action.payload.totalCount;
        state.reviewsTotalPages = action.payload.totalPages;
        state.reviewsCurrentPage = action.payload.currentPage;
      })
      .addCase(fetchAllReviews.rejected, (state) => {
        state.reviewsStatus = "failed";
      })

      // okrs list
      .addCase(fetchAllOkrs.pending, (state) => {
        state.okrsStatus = "loading";
      })
      .addCase(fetchAllOkrs.fulfilled, (state, action) => {
        state.okrsStatus = "succeeded";
        state.okrs = action.payload.data;
        state.okrsTotalCount = action.payload.totalCount;
        state.okrsTotalPages = action.payload.totalPages;
        state.okrsCurrentPage = action.payload.currentPage;
      })
      .addCase(fetchAllOkrs.rejected, (state) => {
        state.okrsStatus = "failed";
      })

      // submit rating
      .addCase(submitReviewRating.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(submitReviewRating.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const idx = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.reviews[idx] = action.payload;
        else state.reviews.unshift(action.payload);
      })
      .addCase(submitReviewRating.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      })

      // finalize
      .addCase(finalizeReview.fulfilled, (state, action) => {
        const idx = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.reviews[idx] = action.payload;
      })

      // create OKR
      .addCase(createOkrForEmployee.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(createOkrForEmployee.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.okrs.unshift(action.payload);
      })
      .addCase(createOkrForEmployee.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      })

      // update key result
      .addCase(updateKeyResultProgress.fulfilled, (state, action) => {
        const idx = state.okrs.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.okrs[idx] = action.payload;
      })

      // delete OKR
      .addCase(deleteOkr.fulfilled, (state, action) => {
        state.okrs = state.okrs.filter((o) => o._id !== action.payload);
      })

      // employee search
      .addCase(searchEmployeesForOkr.pending, (state) => {
        state.employeeSearchStatus = "loading";
      })
      .addCase(searchEmployeesForOkr.fulfilled, (state, action) => {
        state.employeeSearchStatus = "succeeded";
        state.employeeSearchResults = action.payload;
      })
      .addCase(searchEmployeesForOkr.rejected, (state) => {
        state.employeeSearchStatus = "failed";
      });
  },
});

export const { setActiveCycle, clearEmployeeSearch, clearActionError } = performanceSlice.actions;
export default performanceSlice.reducer;