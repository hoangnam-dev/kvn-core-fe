import { AppDispatch, RootState } from "../../redux";
import { updateLanguage, resetLanguage } from "./language.slice";

/**
 * Cập nhật ngôn ngữ hiện tại
 */
export const setLanguage = (lang: "vn" | "ja" | "en") => (dispatch: AppDispatch) => {
    dispatch(updateLanguage({ code: lang }));
};

/**
 * Lấy ngôn ngữ hiện tại
 */
export const getCurrentLanguage = () => (dispatch: AppDispatch, getState: () => RootState) => {
    return getState().language.current.code;
};

/**
 * Reset về ngôn ngữ mặc định
 */
export const clearLanguage = () => (dispatch: AppDispatch) => {
    dispatch(resetLanguage());
};
