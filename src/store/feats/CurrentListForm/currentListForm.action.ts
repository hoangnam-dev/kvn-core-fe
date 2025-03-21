import {ListForm} from "@/store/feats/CurrentListForm/currentListForm.model";
import {AppDispatch} from "@/store/redux";
import {resetCurrentListForm, updateCurrentListForm} from "@/store/feats/CurrentListForm/currentListForm.slice";

export const setCurrentListForm = (data: ListForm) => (dispatch: AppDispatch) => {
    dispatch(updateCurrentListForm(data));
};

export const clearCurrentListForm = () => (dispatch: AppDispatch) => {
    dispatch(resetCurrentListForm());
};