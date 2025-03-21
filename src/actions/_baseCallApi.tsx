import axios, { Method } from 'axios';

const getAuthToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('auth-token='));
    return tokenCookie ? tokenCookie.split('=')[1] : '';
};

export const baseApiCall = async (
    url: string,
    method: Method,
    headers?: Record<string, string>,
    body?: Record<string, unknown>,
    params?: Record<string, unknown>
) => {
    try {
        const authToken = getAuthToken();

        const response = await axios({
            url: process.env.NEXT_PUBLIC_API_URL + url,
            method: method,
            timeout: 60000,
            headers: {
                'Authorization': authToken ? `Bearer ${authToken}` : '',
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
