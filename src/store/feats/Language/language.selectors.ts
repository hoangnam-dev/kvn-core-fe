import { RootState } from "../../redux";

export const selectCurrentLanguage = (state: RootState) => state.language.current.code;
