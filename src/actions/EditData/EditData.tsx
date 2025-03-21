/* eslint-disable */

import {baseApiCall} from "@/actions/_baseCallApi";

export default async (body: any) => {
    const url = '/api/GetData';
    const method = 'PUT';

    try {
        const response = await baseApiCall(url, method, undefined, body, undefined);

        if(response === true){
            return [true];
        } else {
            return new Error("Some thing wrong")
        }
    } catch (error) {
        throw error;
    }
};