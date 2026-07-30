import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/mockApi";

export const fetchAdminUsers = createAsyncThunk("users/fetch", async () => {
  const [users, roles] = await Promise.all([api.getAdminUsers(), api.getRoles()]);
  return { users, roles };
});

export const inviteAdminUser = createAsyncThunk("users/invite", async (payload, { getState }) => {
  const invitedBy = getState().auth.user?.name || "Admin";
  return await api.inviteAdminUser({ ...payload, invitedBy });
});

export const changeAdminUserRole = createAsyncThunk("users/changeRole", async ({ id, roleId }) => {
  return await api.updateAdminUserRole(id, roleId);
});

export const toggleAdminUserStatus = createAsyncThunk("users/toggleStatus", async (id) => {
  return await api.toggleAdminUserStatus(id);
});

export const removeAdminUser = createAsyncThunk("users/remove", async (id) => {
  return await api.removeAdminUser(id);
});

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], roles: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.users;
        state.roles = action.payload.roles;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(inviteAdminUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(changeAdminUserRole.fulfilled, (state, action) => {
        const u = state.list.find((u) => u.id === action.payload.id);
        if (u) u.roleId = action.payload.roleId;
      })
      .addCase(toggleAdminUserStatus.fulfilled, (state, action) => {
        const u = state.list.find((u) => u.id === action.payload.id);
        if (u) u.status = action.payload.status;
      })
      .addCase(removeAdminUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload.id);
      });
  },
});

export default usersSlice.reducer;
