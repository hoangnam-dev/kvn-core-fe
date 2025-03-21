/* eslint-disable */

import {baseApiCall} from "@/actions/_baseCallApi";

export default async (body: any) => {
    const url = '/GetData/getData';     
    const method = 'POST';

    return await baseApiCall(url, method, undefined, body, undefined);
};