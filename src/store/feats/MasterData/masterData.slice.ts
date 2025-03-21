import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MasterData } from "./masterData.model";

interface MasterDataState {
    data: MasterData[];
}

const initialState: MasterDataState = {
    data: [],
};

const masterDataSlice = createSlice({
    name: "masterData",
    initialState,
    reducers: {
        /**
         * Load toàn bộ danh sách Master Data
         */
        updateMasterData: (state, action: PayloadAction<MasterData[]>) => {
            state.data = action.payload;
        },

        /**
         * Reset Master Data về trạng thái ban đầu
         */
        resetMasterData: (state) => {
            state.data = [];
        },
    },
});

export const { updateMasterData, resetMasterData } = masterDataSlice.actions;
export default masterDataSlice.reducer;