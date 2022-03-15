import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['common']
};

const enhancedReducer = persistReducer(persistConfig, reducers);

export default createStore(enhancedReducer, {}, applyMiddleware(thunk));