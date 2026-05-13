import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDataFromApi } from '../../utils/api';
import { handleFetchError } from '../../utils/errorHandler';

export const fetchData = createAsyncThunk(
    'home/fetchHomeData',
    async () => {
        try {
            return await fetchDataFromApi(`https://fakestoreapi.com/products`);
        } catch (error) {
            throw new Error(handleFetchError(error));
        }
    }
);


const initialState = {
  data: [],
  isLoading: false,
  error: null
};

const HomeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(fetchData.pending, state => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        .addCase(fetchData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        
    }
});

export default HomeSlice.reducer;
