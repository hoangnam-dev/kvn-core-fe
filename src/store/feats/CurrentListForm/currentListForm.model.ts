import {ValueRecord} from "@/model/response/base.model";

export interface ListForm {
    [key: string]: ValueRecord<unknown>;
}