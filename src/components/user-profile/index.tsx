'use client'

import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import GetInfo from "../../actions/Account";
import {useEffect, useState} from "react";
import {AccountResponse} from "@/model/response/account.model";

export default function MainProfile() {
    const [accountInfo, setAccountInfo] = useState<AccountResponse>();

    useEffect(() => {
        GetInfo()
            .then((acc: AccountResponse) => {
                setAccountInfo(acc);
            })
            .catch();
    }, []);
    return (
        <div className="space-y-6">
            <UserMetaCard acc={accountInfo} />
            <UserInfoCard acc={accountInfo}/>
            <UserAddressCard/>
        </div>
    )
}