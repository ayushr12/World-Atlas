import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseURL = 'https://restcountries.com/v2';
const initialState = {
  countries: [],
  isLoading: true,
  error: '',
};

export const fetchCountries = createAsyncThunk(
  'fetch/fetchCountries',
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${baseURL}/all`);
    try {
      if (!response.ok) {
        const errorObj = await response.json();
        return rejectWithValue(errorObj.message || 'Something went wrong!');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = '';
        state.countries = payload;
      })
      .addCase(fetchCountries.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchCountries.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const countriesSelector = (state) => state.countries;
export default countriesSlice.reducer;
