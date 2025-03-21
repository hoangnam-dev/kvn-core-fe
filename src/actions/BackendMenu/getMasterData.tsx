/* eslint-disable */

import {baseApiCall} from "@/actions/_baseCallApi";
import {GenDataResBody} from "@/model/request/genData";

export default async () => {
    const url = '/GetData/getData';
    const method = 'POST';

    const body: GenDataResBody = {
        data: {
            cols: "*",
            moreExp: "",
            tableName: "backend_menus",
            tableId: 0
        },
        appVersion: "",
        reqTime: "",
        token: "",
    };

    return await baseApiCall(url, method, undefined, body as Record<string, unknown>, undefined);
};