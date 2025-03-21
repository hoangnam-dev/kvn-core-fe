import { ValueRecord } from "@/model/response/base.model";

export interface MasterData {
    table_name: string;
    table_id: number;
    [key: string]: ValueRecord<unknown> | string | number;
}
