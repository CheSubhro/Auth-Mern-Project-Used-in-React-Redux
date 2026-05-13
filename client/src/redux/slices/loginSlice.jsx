
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { handleFetchError } from '../../utils/errorHandler';
import { fetchDataFromApi } from '../../utils/api'

export const login = createAsyncThunk(
    'login/loginUser',
    async (userData, { rejectWithValue }) => {

        try {
            const response = await fetchDataFromApi('YOUR_LOGIN_API_ENDPOINT', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        
            return response;
            
        } catch (error) {
             return rejectWithValue(handleFetchError(error));
        }
    }
);

const initialState = {
    user: null,
    isLoading: false,
    error: null,
};

const loginSlice = createSlice({

    name: 'login',
    initialState,
    reducers: {},

    extraReducers: (builder) => {

        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    },
});

export default loginSlice.reducer;
