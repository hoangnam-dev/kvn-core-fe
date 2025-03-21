import { AppDispatch, RootState } from "../../redux";
import { updateMasterData, resetMasterData } from "./masterData.slice";

/**
 * Load toàn bộ danh sách Master Data
 */
export const setMasterData =
    (data: { table_id: number; table_name: string }[]) => (dispatch: AppDispatch) => {
        dispatch(updateMasterData(data));
    };

/**
 * Lấy Master ID từ Master Name
 */
export const getMasterIdByName =
    (name: string) => (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState();
        const master = state.masterData.data.find((item) => item.table_name === name);
        return master ? master.table_id : null;
    };

/**
 * Reset Master Data
 */
export const clearMasterData = () => (dispatch: AppDispatch) => {
    dispatch(resetMasterData());
};

export const getAllMasterData = () => (dispatch: AppDispatch, getState: () => RootState) => {
    return getState().masterData.data;
}
