import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHolidays, bulkAddHolidays, updateHoliday, deleteHoliday } from '../../api/holidayApi';

export const fetchHolidays = createAsyncThunk('holidays/fetch', async (year, { rejectWithValue }) => {
  try {
    const res = await getHolidays(year);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Could not load holidays');
  }
});

export const addHolidaysBulk = createAsyncThunk('holidays/bulkAdd', async (holidays, { rejectWithValue }) => {
  try {
    const res = await bulkAddHolidays(holidays);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Could not add holidays');
  }
});

export const editHoliday = createAsyncThunk('holidays/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateHoliday(id, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Could not update holiday');
  }
});

export const removeHoliday = createAsyncThunk('holidays/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteHoliday(id);
    return id;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Could not delete holiday');
  }
});

const holidaySlice = createSlice({
  name: 'holidays',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchHolidays.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload; })
      .addCase(fetchHolidays.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })

      .addCase(addHolidaysBulk.fulfilled, (s, a) => {
        s.list = [...s.list, ...a.payload].sort((x, y) => new Date(x.date) - new Date(y.date));
      })
      .addCase(editHoliday.fulfilled, (s, a) => {
        const idx = s.list.findIndex((h) => h._id === a.payload._id);
        if (idx !== -1) s.list[idx] = a.payload;
      })
      .addCase(removeHoliday.fulfilled, (s, a) => {
        s.list = s.list.filter((h) => h._id !== a.payload);
      });
  },
});

export default holidaySlice.reducer;