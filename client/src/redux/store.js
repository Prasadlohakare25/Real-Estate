import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'//for storing the state of the user

const rootReducer = combineReducers({ user: userReducer })//store the user info

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}//converting the data into the file type log

const persistedReducer = persistReducer(persistConfig, rootReducer)//stores the actual data of the user
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

// module.exports = store;

export const persistor = persistStore(store);