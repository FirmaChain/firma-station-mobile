import React, { useEffect, useState } from "react";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { getChain } from "@/util/secureKeyChain";
import { BgColor } from "@/constants/theme";
import { WALLET_LIST } from "@/constants/common";
import SplashScreen from "react-native-splash-screen";
import Welcome from "@/organims/welcome";

const WelcomeScreen = () => {
    const [walletExist, setWalletExist] = useState(false);
    
    const isWalletExist = async() => {
        await getChain(WALLET_LIST).then(res => {
            if(res === false) return setWalletExist(false);
            return setWalletExist(true);
        }).catch(error => {
            console.log('error : ' + error);
        })
    }

    useEffect(() => {
        SplashScreen.hide();
        isWalletExist();
        return () => {
            setWalletExist(false);
        }
    }, [])

    return (
        <ViewContainer bgColor={BgColor}>
            <Welcome walletExist={walletExist} />
        </ViewContainer>
    )
}

export default React.memo(WelcomeScreen);