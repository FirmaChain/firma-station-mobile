import React, { useContext, useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";

import ViewContainer from "@/components/parts/containers/viewContainer";
import ProgressTransaction from "@/components/parts/progressTransaction";
import Button from "@/components/button/button";
import { FailCircle, SuccessCircle } from "@/components/icon/icon";

import { BgColor, Lato, PointLightColor, TextColor, TextGrayColor, TextWarnColor } from "@/constants/theme";
import { EXPLORER, TRANSACTION_TYPE } from "@/constants/common";

import { delegate, redelegate, sendFCT, undelegate, withdrawAllRewards, withdrawRewards } from "@/util/firma";
import { getWallet } from "@/util/wallet";
import { AppContext } from "@/util/context";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Transaction>;

export type TransactionParams = {
    state: any;
}

interface TransactionScreenProps {
    route: {params: TransactionParams};
    navigation: ScreenNavgationProps;
}

const TransactionScreen: React.FunctionComponent<TransactionScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {state} = params;

    const {wallet} = useContext(AppContext);

    const [transactionResult, setTransactionResult]:any = useState(null);
    const [mnemonic, setMnemonic] = useState('');
    
    const handleBack = () => {
        navigation.goBack();
    }

    const convertTransactionCodeToText = (code:number) => {
        if(code === 0) return "Transaction Success";
        return "Transaction Failed";
    }

    const openExplorer = (hash:string) => {
        if(transactionResult.code === -1) return;
        Linking.openURL(EXPLORER + '/transactions/' + hash);
    }

    useEffect(() => {
        const getMnemonic = async() => {
            await getWallet(wallet.name, state.password).then(res => {if(res)setMnemonic(res)});
        }
        getMnemonic();
    }, []);

    useEffect(() => {
        if(mnemonic === '') return;
        const transaction = async() => {
            switch (state.type) {
                case TRANSACTION_TYPE["SEND"]:
                    await sendFCT(mnemonic, state.targetAddress, state.amount, state.gas, state.memo)
                    .then(res => {
                        setTransactionResult({
                            code: res.code,
                            result: res.transactionHash})})
                    .catch(error => {
                        console.log("ERROR : ", error.toString());
                        setTransactionResult({
                            code: -1,
                            result: error.toString()})
                    })
                    break;
                case TRANSACTION_TYPE["DELEGATE"]:
                    await delegate(mnemonic, state.operatorAddressDst, state.amount, state.gas)
                    .then(res => {
                        setTransactionResult({
                            code: res.code,
                            result: res.transactionHash})})
                    .catch(error => {
                        console.log("ERROR : ", error.toString());
                        setTransactionResult({
                            code: -1,
                            result: error.toString()})
                    })
                    break;
                case TRANSACTION_TYPE["REDELEGATE"]:
                    await redelegate(mnemonic, state.operatorAddressSrc, state.operatorAddressDst, state.amount, state.gas)
                    .then(res => {
                        setTransactionResult({
                            code: res.code,
                            result: res.transactionHash})})
                    .catch(error => {
                        console.log("ERROR : ", error.toString());
                        setTransactionResult({
                            code: -1,
                            result: error.toString()})
                    })
                    break;
                case TRANSACTION_TYPE["UNDELEGATE"]:
                    await undelegate(mnemonic, state.operatorAddressDst, state.amount, state.gas)
                    .then(res => {
                        setTransactionResult({
                            code: res.code,
                            result: res.transactionHash})})
                    .catch(error => {
                        console.log("ERROR : ", error.toString());
                        setTransactionResult({
                            code: -1,
                            result: error.toString()})
                    })
                    break;
                case TRANSACTION_TYPE["WITHDRAW"]:
                    await withdrawRewards(mnemonic, state.operatorAddress, state.gas)
                    .then(res => {
                        setTransactionResult({
                            code: res.code,
                            result: res.transactionHash})})
                    .catch(error => {
                        console.log("ERROR : ", error.toString());
                        setTransactionResult({
                            code: -1,
                            result: error.toString()})
                    })
                    break;
                case TRANSACTION_TYPE["WITHDRAW ALL"]:
                    await withdrawAllRewards(mnemonic, state.gas)
                    .then(res => {
                        setTransactionResult({
                            code: res.code,
                            result: res.transactionHash})})
                    .catch(error => {
                        console.log("ERROR : ", error.toString());
                        setTransactionResult({
                            code: -1,
                            result: error.toString()})
                    })
                    break;
                default:
                    break;
            }
        }
        transaction();
    }, [mnemonic])
    
    return (
        <ViewContainer 
            full={true}
            bgColor={BgColor}>
                {transactionResult?
                <View style={styles.container}>
                    <View style={[styles.resultBox, {flex: 1, justifyContent: "center", alignItems: "center"}]}>
                        {transactionResult.code === 0? 
                        <SuccessCircle size={45} color={PointLightColor}/>        
                        :
                        <FailCircle size={45} color={TextWarnColor}/>
                        }
                        <Text style={[styles.result, {color: transactionResult.code === 0? PointLightColor:TextWarnColor}]}>{convertTransactionCodeToText(transactionResult.code)}</Text>
                        <View style={styles.resultWrapper}>
                            {transactionResult.code !== -1 && <Text style={[styles.hash, {color: TextGrayColor}]}>HASH: </Text>}
                            <TouchableOpacity onPress={()=>openExplorer(transactionResult.result)}>
                                <Text numberOfLines={transactionResult.code === -1?10:1} ellipsizeMode={"middle"} style={[styles.hash, {paddingHorizontal: 5}]}>{transactionResult.result}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.resultBox, {justifyContent: "flex-end"}]}>
                    <Button
                        title={"OK"}
                        active={true}
                        onPressEvent={handleBack}/>
                    </View>
                </View>
                :
                <ProgressTransaction/>
                }
        </ViewContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: BgColor,
        paddingBottom: Platform.select({android: 30, ios: 50}),
        paddingHorizontal: 20,
    },
    resultBox: {
        width: "100%",
    },
    resultWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    result: {
        fontFamily: Lato,
        fontSize: 22,
        fontWeight: "600",
        textAlign: "center",
        color: PointLightColor,
        paddingTop: 10,
        paddingBottom: 20,
    },
    hash: {
        fontFamily: Lato,
        fontSize: 14,
        textAlign: "center",
        color: TextColor,
        paddingBottom: 20,
    }
})

export default TransactionScreen;