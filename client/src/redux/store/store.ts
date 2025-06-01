import { combineReducers } from "redux";
import {persistReducer} from 'redux-persist'
import authReducer from "../features/authSlice"
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
const typedStorage = storage as unknown as import("redux-persist").Storage;
export default typedStorage;
const persistConfig={
    key:"root",
    storage,
    whitelist:['auth'],
}

const rootReducer= combineReducers({
    auth:authReducer,
})

const presistReducer=persistReducer(persistConfig,rootReducer)
 export const store=configureStore({
    reducer:presistReducer,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        })
 })

 export const presistor= persistStore(store)
 export type  RootState=ReturnType<typeof store.getState>;
 export type AppDispatch =typeof store.dispatch;

