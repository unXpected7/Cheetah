import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import {configureStore} from '@reduxjs/toolkit';
import { Auth, IAuth } from "./Auth";

//create root interface
interface IRootState {
  Auth: IAuth;
}

//create redux store
const rootReducer = combineReducers({
  Auth,
});

//persist redux store
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklists: ["Global"], //add a reducer you dont want to save on the local storage, state will be reset when the app restart
};

//create redux and apply middleware
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    middleware: [],
})

//create redux persistor
const persistor = persistStore(store);

//export redux
export { store, persistor, IRootState };