import axios, { Method } from 'axios';

const baseApiCall = async (
    url: string,
    method: Method,
    headers?: Record<string, string>,
    body?: Record<string, unknown>,
    params?: Record<string, unknown>
) => {
    try {
        const response = await axios({
            url: "https://api.escuelajs.co" + url,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                ...headers
            },
            data: body,
            params: params
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || error.message;
        }
        return 'An unexpected error occurred';
    }
};


// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
    const url = '/api/v1/products';
    const method = 'GET';

    return await baseApiCall(url, method, undefined, undefined, undefined);
};