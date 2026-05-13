import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDataFromApi } from '../../utils/api';
import { handleFetchError } from '../../utils/errorHandler';

export const fetchAboutData = createAsyncThunk(
    'About/fetchAboutData',
    async () => {
        try {
            return await fetchDataFromApi(`https://dummyjson.com/products`);
        } catch (error) {
            throw new Error(handleFetchError(error));
        }
    }
);

const initialState = {
    aboutData: [],
    isLoading: false,
    error: null
};

const AboutSlice = createSlice({
    name: 'About',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(fetchAboutData.pending, state => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchAboutData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.aboutData = action.payload.products;
        })
        .addCase(fetchAboutData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    }
});

export default AboutSlice.reducer;
