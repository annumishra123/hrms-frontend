import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllTickets, updateTicketStatus, addTicketComment } from '../../api/ticketAdminApi';

export const fetchAllTickets = createAsyncThunk('ticketsAdmin/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await getAllTickets(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Could not load tickets');
  }
});

export const changeTicketStatus = createAsyncThunk(
  'ticketsAdmin/changeStatus',
  async ({ id, status, assignedTo }, { rejectWithValue }) => {
    try {
      const res = await updateTicketStatus(id, { status, assignedTo });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Could not update status');
    }
  }
);

export const postTicketComment = createAsyncThunk(
  'ticketsAdmin/comment',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const res = await addTicketComment(id, text);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Could not add comment');
    }
  }
);

const ticketsAdminSlice = createSlice({
  name: 'ticketsAdmin',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    updateTicketRealtimeAdmin(state, action) {
      const idx = state.list.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
      else state.list.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTickets.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchAllTickets.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload; })
      .addCase(fetchAllTickets.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(changeTicketStatus.fulfilled, (s, a) => {
        const idx = s.list.findIndex((t) => t._id === a.payload._id);
        if (idx !== -1) s.list[idx] = a.payload;
      })
      .addCase(postTicketComment.fulfilled, (s, a) => {
        const idx = s.list.findIndex((t) => t._id === a.payload._id);
        if (idx !== -1) s.list[idx] = a.payload;
      });
  },
});

export const { updateTicketRealtimeAdmin } = ticketsAdminSlice.actions;
export default ticketsAdminSlice.reducer;



