import { configureStore } from "@reduxjs/toolkit";
import masterDataReducer from "./feats/MasterData/masterData.slice";
import languageReducer from "./feats/Language/language.slice";
import currentListFormReducer from "./feats/CurrentListForm/currentListForm.slice"
import {thunk} from "redux-thunk";

export const store = configureStore({
    reducer: {
        masterData: masterDataReducer,
        language: languageReducer,
        currentListForm: currentListFormReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
