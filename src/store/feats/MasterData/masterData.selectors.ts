import { RootState } from "../../redux";

export const selectTableName = (state: RootState) => state.masterData.data;
export const selectTableId = (state: RootState) => state.masterData.data;
