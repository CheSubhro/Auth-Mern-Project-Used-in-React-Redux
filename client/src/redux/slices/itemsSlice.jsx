import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
};

const itemsSlice = createSlice({

    name: 'items',
    initialState,

    reducers:{

        addItem( state, action) {
            state.items.push(action.payload)
        },
        updateItem( state, action) {
            const { id, updatedItem } = action.payload;
            const index = state.items.findIndex(item => item.id === id);

            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...updatedItem };
            }
        },
        removeItem( state, action) {
            state.items = state.items.filter(item => item.id !== action.payload);
        }
    }
})

export const { addItem, removeItem, updateItem } = itemsSlice.actions;

export default itemsSlice.reducer;