import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Language } from "./language.model";

interface LanguageState {
    current: Language;
}

const initialState: LanguageState = {
    current: { code: "vn" }, // Mặc định là tiếng Việt
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        /**
         * Cập nhật ngôn ngữ hiện tại
         */
        updateLanguage: (state, action: PayloadAction<Language>) => {
            state.current = action.payload;
        },

        /**
         * Reset ngôn ngữ về mặc định
         */
        resetLanguage: (state) => {
            state.current = { code: "vn" };
        },
    },
});

export const { updateLanguage, resetLanguage } = languageSlice.actions;
export default languageSlice.reducer;
