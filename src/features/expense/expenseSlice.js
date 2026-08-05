import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor";

// ---- Thunks ----
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/expense", { params: { all: "true" } });
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Could not load expenses");
    }
  }
);

export const updateExpenseStatus = createAsyncThunk(
  "expenses/updateStatus",
  async ({ id, status, reviewNote }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/expense/${id}/status`, { status, reviewNote });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Could not update expense status");
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  newCount: 0,       
  latestNew: null,   
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    // socket se naya expense aane par
    expenseAddedFromSocket(state, action) {
      const expense = action.payload;
      const exists = state.items.some((e) => e._id === expense._id);
      if (!exists) {
        state.items.unshift(expense);
        state.newCount += 1;
        state.latestNew = expense;
      }
    },
    // socket se status update / edit aane par
    expenseUpdatedFromSocket(state, action) {
      const expense = action.payload;
      const idx = state.items.findIndex((e) => e._id === expense._id);
      if (idx === -1) {
        state.items.unshift(expense);
      } else {
        state.items[idx] = expense;
      }
    },
    expenseRemovedFromSocket(state, action) {
      const id = action.payload;
      state.items = state.items.filter((e) => e._id !== id);
    },
    clearNewCount(state) {
      state.newCount = 0;
    },
    clearLatestNew(state) {
      state.latestNew = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExpenseStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateExpenseStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  expenseAddedFromSocket,
  expenseUpdatedFromSocket,
  expenseRemovedFromSocket,
  clearNewCount,
  clearLatestNew,
} = expenseSlice.actions;

export const selectExpenses = (state) => state.expenses.items;
export const selectExpensesLoading = (state) => state.expenses.loading;
export const selectExpensesError = (state) => state.expenses.error;
export const selectNewExpenseCount = (state) => state.expenses.newCount;
export const selectLatestNewExpense = (state) => state.expenses.latestNew;

export default expenseSlice.reducer;