import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import RefreshScrollView from "../../../components/parts/refreshScrollView";
import { BgColor } from "../../../constants/theme";
import AddressBox from "../../../organims/wallet/addressBox";
import BalanceBox from "../../../organims/wallet/balanceBox";
import HistoryBox from "../../../organims/wallet/historyBox";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";
import { StakingValues, useStakingData } from "@/hooks/staking/hooks";
import { useBalanceData } from "@/hooks/wallet/hooks";
import { convertNumber } from "@/util/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

export type WalletParams = {
    address: string;
    walletName: string;
}

interface Props {
    route: {params: WalletParams};
    navigation: ScreenNavgationProps;
}

const WalletScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation, route} = props;
    const {params} = route;

    const {address, walletName} = params;
    
    const {balance} = useBalanceData(address);
    const {stakingState, setRefresh} = useStakingData(address);

    const [stakingValues, setStakingValues] = useState<StakingValues>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    useEffect(() => {
        setStakingValues({
            available: stakingState.available,
            delegated: stakingState.delegated,
            undelegate: stakingState.undelegate,
            stakingReward: stakingState.stakingReward,
        });
    }, [stakingState]);
    

    const [openWithdrawModal, setOpenWithdrawModal] = useState(false);

    const refreshData = async() => {
        setRefresh(true);
        // await getBalance().catch((error) => console.log(error));
    }

    const handleTransaction = () => {
        navigation.navigate(Screens.Transaction);
    }

    const handleSend = () => {
        navigation.navigate(Screens.Send, {walletName: walletName, available: balance});
    }

    const handleDelegate = () => {
        navigation.navigate(Screens.Staking, {address: address, walletName: walletName});
    }

    return (
        <View style={styles.container}>
            <AddressBox address={address} />
            <RefreshScrollView refreshFunc={refreshData}>
                <ScrollView>
                    <View style={styles.content}>
                        <BalanceBox balance={balance} stakingValues={stakingValues} handleSend={handleSend} handleDelegate={handleDelegate}/>
                        <HistoryBox />
                        <TransactionConfirmModal transactionHandler={handleTransaction} title="Withdraw" walletName={walletName} amount={stakingValues.stakingReward} open={openWithdrawModal} setOpenModal={setOpenWithdrawModal} />
                    </View>
                </ScrollView>
            </RefreshScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
    },
    wallet:{
        paddingBottom: 10,
        paddingHorizontal: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#aaa',
    },
    content: {
    }
})


export default React.memo(WalletScreen);