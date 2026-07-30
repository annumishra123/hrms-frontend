import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnnouncements, createAnnouncement } from "../../api/announcementApi";

const mapAnnouncementToUI = (item) => ({
  id: item._id,
  title: item.title,
  body: item.body,
  category: item.category,
  audience: item.audience,
  date: new Date(item.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
});

export const fetchAnnouncements = createAsyncThunk("announcements/fetch", async () => {
  const res = await getAnnouncements();
  return res.data.map(mapAnnouncementToUI);
});

export const addAnnouncement = createAsyncThunk("announcements/create", async (announcement) => {
  const res = await createAnnouncement(announcement);
  return mapAnnouncementToUI(res.data);
});

const announcementsSlice = createSlice({
  name: "announcements",
  initialState: { list: [], status: "idle", error: null },
  reducers: {

    addAnnouncementRealtime: (state, action) => {
      const mapped = mapAnnouncementToUI(action.payload);
      const exists = state.list.some((a) => a.id === mapped.id);
      if (!exists) {
        state.list.unshift(mapped);
      }
    },

    removeAnnouncementRealtime: (state, action) => {
      state.list = state.list.filter((a) => a.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addAnnouncement.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});


export const { addAnnouncementRealtime, removeAnnouncementRealtime } = announcementsSlice.actions;
export default announcementsSlice.reducer;