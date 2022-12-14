import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import reducers from './reducers';

const middlewares: any[] = [thunk];

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['storage']
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [...middlewares]
});

const persistor = persistStore(store);
export { store, persistor };
