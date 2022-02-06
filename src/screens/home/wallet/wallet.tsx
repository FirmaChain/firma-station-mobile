import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BgColor } from "@/constants/theme";
import AddressBox from "@/organims/wallet/addressBox";
import BalanceBox from "@/organims/wallet/balanceBox";
import HistoryBox from "@/organims/wallet/historyBox";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import { StakingValues } from "@/hooks/staking/hooks";
import { useNavigation } from "@react-navigation/native";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

interface Props {
    state: any;
}

const WalletScreen: React.FunctionComponent<Props> = (props) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const {state} = props;
    const {address, 
            walletName,
            balance,
            historyList,
            stakingState,} = state;

    const recentHistory = useMemo(() => {
        if(historyList) return historyList.list[0];
        return [];
    }, [historyList]);

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

    const handleTransaction = () => {
        const transactionState = {
            state: {
                type: "withdrawall",
                address: address
            }
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const handleSend = () => {
        navigation.navigate(Screens.Send, {walletName: walletName, available: balance});
    }

    const handleDelegate = () => {
        navigation.navigate(Screens.Staking);
    }

    const handleHistory = () => {
        navigation.navigate(Screens.Hisory, {historyData: historyList});
    }

    return (
        <View style={styles.container}>
            <AddressBox address={address} />
            <ScrollView>
                <View style={styles.content}>
                    <BalanceBox balance={balance} stakingValues={stakingValues} handleSend={handleSend} handleDelegate={handleDelegate}/>
                    <HistoryBox handleHistory={handleHistory} recentHistory={recentHistory}/>
                    <TransactionConfirmModal transactionHandler={handleTransaction} title="Withdraw" walletName={walletName} amount={stakingValues.stakingReward} open={openWithdrawModal} setOpenModal={setOpenWithdrawModal} />
                </View>
            </ScrollView>
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