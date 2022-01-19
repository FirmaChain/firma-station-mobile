import { useState } from "react"

interface UserState {
    wallet: string;
    address: string;
}

export const useUserData = () => {
    const [userData, setUserData] = useState<UserState>();

    setInterval(() => {
        setUserData({
            wallet: '',
            address: '',
        });
    }, 1000);

    return { userData }
}