import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { nodesReducer } from './Nodes/nodesSlice';

const nodesPersistConfig = {
  key: 'global',
  storage,
  whitelist: ['nodes', 'edges'],
};

export const store = configureStore({
  reducer: {
    global: persistReducer(nodesPersistConfig, nodesReducer),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
