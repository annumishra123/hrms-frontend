import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/interceptor'; // 

export const fetchAdminNotifications = createAsyncThunk(
  'adminNotifications/fetch',
  async () => {
    const res = await api.get('/notifications');
    return res.data;
  }
);

export const markAllRead = createAsyncThunk('adminNotifications/markAllRead', async () => {
  await api.patch('/notifications/read-all');
});

const notificationSlice = createSlice({
  name: 'adminNotifications',
  initialState: {
    list: [],
    unreadCount: 0,
  },
  reducers: {
    addRealtimeNotification: (state, action) => {
      state.list.unshift({ ...action.payload, read: false });
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
        state.list = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.list.forEach((n) => (n.read = true));
        state.unreadCount = 0;
      });
  },
});

export const { addRealtimeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;