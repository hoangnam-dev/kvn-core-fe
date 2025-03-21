import {RootState} from "@/store/redux";

export const selectCurrentListForm = (state: RootState) => state.currentListForm.data;