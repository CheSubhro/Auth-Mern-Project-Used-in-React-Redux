import { configureStore  } from '@reduxjs/toolkit'
import itemsReducer  from '../redux/slices/itemsSlice'
import homeReducer  from './slices/HomeSlice'
import authReducer  from '../redux/slices/authSlice'
import aboutReducer from '../redux/slices/AboutSlice'

const store = configureStore({

    reducer: {
      items: itemsReducer,
      data: homeReducer,
      auth: authReducer,
      aboutdata: aboutReducer
    },
    devTools: process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

});

export default store
