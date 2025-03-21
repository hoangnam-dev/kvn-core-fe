/* eslint-disable */

import {baseApiCall} from "@/actions/_baseCallApi";

export default async () => {
    const url = '/Account';
    const method = 'GET';

    return await baseApiCall(url, method, undefined, undefined, undefined);
};