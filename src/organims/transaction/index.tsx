import React, { useEffect, useState } from "react";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { BgColor } from "@/constants/theme";
import { getWallet } from "@/util/wallet";
import { TRANSACTION_TYPE } from "@/constants/common";
import { delegate, redelegate, sendFCT, undelegate, withdrawAllRewards, withdrawRewards } from "@/util/firma";
import ViewContainer from "@/components/parts/containers/viewContainer";
import ProgressTransaction from "./progressTransaction";
import TransactionResult from "./transactionResult";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Transaction>;

interface Props {
    state: any;
}

export interface ResultState {
    code: number;
    result: string;
}

const Transaction = ({state}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation();
    const {wallet} = useAppSelector(state => state);

    const [mnemonic, setMnemonic] = useState('');
    const [transactionResult, setTransactionResult] = useState<ResultState>({
        code: 0,
        result: "",
    });

    useEffect(() => {
        const getMnemonic = async() => {
            await getWallet(wallet.name, state.password).then(res => {if(res) setMnemonic(res)});
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

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <ViewContainer
            full={true}
            bgColor={BgColor}>
                {transactionResult.result !== ""?
                <TransactionResult result={transactionResult} handleBack={handleBack}/> 
                :
                <ProgressTransaction />
                }
        </ViewContainer>
    )
}

export default Transaction;