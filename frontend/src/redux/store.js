import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apiSlice";
import userReducer from "./user/userSlice";
// For Persisting
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
// ####################################### Store
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(
      {
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }
    ).concat(authApi.middleware),
});

export const persistor = persistStore(store);