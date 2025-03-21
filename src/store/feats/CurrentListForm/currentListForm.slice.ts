import {ListForm} from "@/store/feats/CurrentListForm/currentListForm.model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface CurrentListFormState {
    data: ListForm | null;
}

const initialState: CurrentListFormState = {
    data: null,
};

const currentListFormSlice = createSlice({
    name: "currentListForm",
    initialState,
    reducers: {
        /**
         * Cập nhật dữ liệu của currentListForm
         */
        updateCurrentListForm: (state, action: PayloadAction<ListForm>) => {
            state.data = action.payload;
        },

        /**
         * Xóa dữ liệu currentListForm về null
         */
        resetCurrentListForm: (state) => {
            state.data = null;
        },
    },
});

export const { updateCurrentListForm, resetCurrentListForm } = currentListFormSlice.actions;
export default currentListFormSlice.reducer;