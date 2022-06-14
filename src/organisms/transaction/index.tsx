import React, { useEffect, useState } from "react";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { getMnemonic } from "@/util/wallet";
import { delegate, redelegate, sendFCT, undelegate, voting, withdrawAllRewards, withdrawRewards } from "@/util/firma";
import { BgColor } from "@/constants/theme";
import { TRANSACTION_TYPE } from "@/constants/common";
import ViewContainer from "@/components/parts/containers/viewContainer";
import ProgressTransaction from "./progressTransaction";
import TransactionResult from "./transactionResult";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Transaction>;

interface Props {
    state: any;
}

export interface ResultState {
    code: number;
    result: any;
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
        const getMnemonicFromChain = async() => {
            let result = await getMnemonic(wallet.name, state.password);
            if(result){
                setMnemonic(result);
            }
        }
        getMnemonicFromChain();
    }, []);

    useEffect(() => {
        if(mnemonic === '') return;
        const transaction = async() => {
            try {
                switch (state.type) {
                    case TRANSACTION_TYPE["SEND"]:
                        const sendResult = await sendFCT(mnemonic, state.targetAddress, state.amount, state.gas, state.memo);
                        setTransactionResult({
                            code: sendResult.code,
                            result: sendResult.transactionHash});
                        break;
                    case TRANSACTION_TYPE["DELEGATE"]:
                        const delegateResult = await delegate(mnemonic, state.operatorAddressDst, state.amount, state.gas);
                        setTransactionResult({
                            code: delegateResult.code,
                            result: delegateResult.transactionHash});
                        break;
                    case TRANSACTION_TYPE["REDELEGATE"]:
                        const redelegateResult = await redelegate(mnemonic, state.operatorAddressSrc, state.operatorAddressDst, state.amount, state.gas);
                        setTransactionResult({
                            code: redelegateResult.code,
                            result: redelegateResult.transactionHash});
                        break;
                    case TRANSACTION_TYPE["UNDELEGATE"]:
                        const undelegateResult = await undelegate(mnemonic, state.operatorAddressDst, state.amount, state.gas);
                        setTransactionResult({
                            code: undelegateResult.code,
                            result: undelegateResult.transactionHash});
                        break;
                    case TRANSACTION_TYPE["WITHDRAW"]:
                        const withdrawResult = await withdrawRewards(mnemonic, state.operatorAddress, state.gas);
                        setTransactionResult({
                            code: withdrawResult.code,
                            result: withdrawResult.transactionHash});
                        break;
                    case TRANSACTION_TYPE["WITHDRAW_ALL"]:
                        const withdrawAllResult = await withdrawAllRewards(mnemonic, state.gas);
                        setTransactionResult({
                            code: withdrawAllResult.code,
                            result: withdrawAllResult.transactionHash});
                        break;
                    case TRANSACTION_TYPE["VOTING"]:
                        const votingResult = await voting(mnemonic, state.proposalId, state.votingOpt, state.gas);
                        setTransactionResult({
                            code: votingResult.code,
                            result: votingResult.transactionHash});
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.log("ERROR : ", error); 
                setTransactionResult({code: -1, result: error})
            }
        }
        transaction();
    }, [mnemonic])

    const handleMoveToWeb = (uri:string) => {
        navigation.navigate(Screens.WebScreen, {uri: uri});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <ViewContainer
            full={true}
            bgColor={BgColor}>
                {transactionResult.result !== ""?
                <TransactionResult result={transactionResult} handleExplorer={handleMoveToWeb} handleBack={handleBack}/> 
                :
                <ProgressTransaction />
                }
        </ViewContainer>
    )
}

export default Transaction;