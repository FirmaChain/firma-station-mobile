import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { BgColor } from "@/constants/theme";
import AddressBox from "@/organims/wallet/addressBox";
import BalanceBox from "@/organims/wallet/balanceBox";
import HistoryBox from "@/organims/wallet/historyBox";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "@/util/context";
import RefreshScrollView from "@/components/parts/refreshScrollView";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

interface Props {
    state: any;
}

const WalletScreen: React.FunctionComponent<Props> = (props) => {
    const {state} = props;
    const navigation: ScreenNavgationProps = useNavigation();

    const {wallet} = useContext(AppContext);

    const handleSend = () => {
        navigation.navigate(Screens.Send);
    }

    const handleStaking = () => {
        navigation.navigate(Screens.Staking);
    }

    const handleHistory = () => {
        navigation.navigate(Screens.History);
    }

    const refreshStates = () => {
        state.refreshForWallet();
    }

    return (
        <View style={styles.container}>
            <AddressBox address={wallet.address} />
            <RefreshScrollView
                refreshFunc={refreshStates}>
                <View style={styles.content}>
                    <BalanceBox stakingValues={state.stakingState} handleSend={handleSend} handleStaking={handleStaking}/>
                    <HistoryBox handleHistory={handleHistory} recentHistory={state.recentHistory}/>
                </View>
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