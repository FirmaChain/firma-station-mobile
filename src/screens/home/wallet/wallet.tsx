import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import RefreshScrollView from "../../../components/parts/refreshScrollView";
import { BgColor } from "../../../constants/theme";
import AddressBox from "../../../organims/wallet/addressBox";
import BalanceBox from "../../../organims/wallet/balanceBox";
import ChainInfoBox from "../../../organims/wallet/chainInfoBox";
import HistoryBox from "../../../organims/wallet/historyBox";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import { useBalanceData, useOrganizedBalances } from "../../../hooks/wallet/useBalanceData";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";

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

    const { balance } = useBalanceData(address);
    const { organizedBalances, organizedReward } = useOrganizedBalances(address);
    const [chainInfo, setChainInfo]:Array<any> = useState([]);
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false);

    const available = useMemo(() => {
        let result = organizedBalances.find((item:any) => item.title === "Available");
        return result === undefined? 0 : result.data;
    }, [organizedBalances]);

    const refreshData = async() => {
        await getChainInfo().catch((error) => console.log(error));
        // await getBalance().catch((error) => console.log(error));
    }

    // const getBalance = async() => {
    //     await getBalanceFromAdr(address).then((res) => {
    //         setAvaliable(Number(res));
    //     }).catch((error) => {
    //         console.log('error : ' + error);
    //     })
    // }

    const getChainInfo = async() => {
        await fetch('https://api.coingecko.com/api/v3/coins/firmachain')
        .then((res) => res.json())
        .then((resJson) => {
            setChainInfo(resJson);
        })
    }

    const handleTransaction = () => {
        navigation.navigate(Screens.Transaction);
    }

    const handleSend = () => {
        navigation.navigate(Screens.Send, {walletName: walletName, available: available});
    }

    const handleDelegate = () => {
        navigation.navigate(Screens.Staking, {address: address, walletName: walletName});
    }

    useEffect(() => {
        getChainInfo();
    }, [])

    return (
        <View style={styles.container}>
            {/* <Text style={styles.wallet}>{walletName}</Text> */}
            <AddressBox address={address} />
            <RefreshScrollView refreshFunc={refreshData}>
                <ScrollView>
                    <View style={styles.content}>
                        <BalanceBox  balance={balance} staking={organizedBalances} reward={organizedReward} handleSend={handleSend} handleDelegate={handleDelegate}/>
                        <HistoryBox />
                        {/* <ChainInfoBox chainInfo={chainInfo} /> */}
                        {/* <ExplorerBox /> */}
                        <TransactionConfirmModal transactionHandler={handleTransaction} title="Withdraw" walletName={walletName} amount={organizedReward.data} open={openWithdrawModal} setOpenModal={setOpenWithdrawModal} />
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


export default WalletScreen;