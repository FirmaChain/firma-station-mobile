import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Screens, StackParamList } from "../../navigators/appRoutes";
import { BgColor, Lato, PointLightColor, TextColor, TextGrayColor, TextWarnColor } from "../../constants/theme";
import ViewContainer from "../../components/parts/containers/viewContainer";
import Progress from "@/components/parts/progress";
import { TRANSACTION_TYPE } from "@/constants/common";
import { delegate, sendFCT } from "@/util/firma";
import Button from "@/components/button/button";
import { FailCircle, SuccessCircle } from "@/components/icon/icon";
import { getWallet } from "@/util/wallet";

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
        Linking.openURL('https://explorer-devnet.firmachain.org/transactions/' + hash);
    }

    useEffect(() => {
        const getMnemonic = async() => {
            await getWallet(state.walletName, state.password).then(res => {if(res)setMnemonic(res)});
        }
        getMnemonic();
    }, []);

    useEffect(() => {
        if(mnemonic === '') return;
        const transaction = async() => {
            switch (state.type) {
                case TRANSACTION_TYPE["SEND"]:
                    await sendFCT(mnemonic, state.targetAddress, state.amount, state.memo)
                    .then(res => {
                        setTransactionResult({
                            code: res.code,
                            result: res.transactionHash})
                        console.log("RESULT : ", res);})
                    .catch(error => {
                        console.log("ERROR : ", error.toString());
                        setTransactionResult({
                            code: -1,
                            result: error.toString()})
                    })
                    break;
                case TRANSACTION_TYPE["DELEGATE"]:
                    await delegate(mnemonic, state.operatorAddress, state.amount)
                    .then(res => {
                        setTransactionResult({
                            code: res.code,
                            result: res.transactionHash})
                        console.log("RESULT : ", res);})
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
                <Progress />
                }
        </ViewContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: BgColor,
        paddingBottom: Platform.OS === "ios"? 50 : 30,
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