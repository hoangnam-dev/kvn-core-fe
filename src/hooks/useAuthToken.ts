import { useState, useEffect } from "react";
import {UserAccount} from "@/model/entity/user.model";

const parseJwt = (token: string): UserAccount | null => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

const useAuthToken = () => {
    const [user, setUser] = useState<UserAccount | null>(null);

    useEffect(() => {
        const cookies = document.cookie.split("; ");
        const authToken = cookies.find((cookie) => cookie.startsWith("auth-token="))?.split("=")[1];

        if (authToken) {
            const parsedUser = parseJwt(authToken);
            if (parsedUser) {
                const userWithDefaults: UserAccount = {
                    sub: parsedUser.sub || "N/A",
                    AccountID: parsedUser.AccountID || "N/A",
                    AccountName: parsedUser.AccountName || "N/A",
                    AccountNumber: parsedUser.AccountNumber || "N/A",
                    Email: parsedUser.Email || "N/A",
                    exp: parsedUser.exp || 0,
                    iss: parsedUser.iss || "N/A",
                    aud: parsedUser.aud || "N/A",
                };
                setUser(userWithDefaults);
            }
        }
    }, []);

    return user;
};

export default useAuthToken;
