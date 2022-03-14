import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { useBalanceData } from "@/hooks/wallet/hooks";
import { BgColor } from "@/constants/theme";
import { TRANSACTION_TYPE, WRONG_TARGET_ADDRESS_WARN_TEXT } from "@/constants/common";
import { addressCheck, getEstimateGasSend, getFeesFromGas } from "@/util/firma";
import { convertNumber } from "@/util/common";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import Button from "@/components/button/button";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import AlertModal from "@/components/modal/alertModal";
import { FIRMACHAIN_DEFAULT_CONFIG } from "@/../config";
import SendInputBox from "./sendInputBox";
import WalletInfo from "./walletInfo";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Send>;

interface SendInfo {
    address: string;
    amount: number;
    memo: string;
}

const Send = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const {wallet} = useAppSelector(state => state);
    const {balance, getBalance} = useBalanceData();

    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [sendInfoState, setSendInfoState] = useState<SendInfo>({
        address: '',
        amount: 0,
        memo: '',
    });
    const [resetInputValues, setInputResetValues] = useState(false);

    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const handleSendInfo = (type:string, value:string|number) => {
        let val:any = value;
        if(type === "memo" && val === "") val = null;
        setSendInfoState((prevState) => ({
            ...prevState,
            [type] : val,
        }))
    }

    const handleAlertModalOpen = (open:boolean) => {
        setOpenAlertModal(open);
    }

    const handleTransactionModal = (open:boolean) => {
        setOpenTransactionModal(open);
    }

    const handleTransaction = (password:string) => {
        handleTransactionModal(false);

        const transactionState = {
            type: TRANSACTION_TYPE["SEND"],
            password: password,
            targetAddress : sendInfoState.address,
            amount: sendInfoState.amount,
            gas: gas,
            memo: sendInfoState.memo,
        }
        setInputResetValues(true);
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const handleSend = async() => {
        if(sendInfoState.address === '' || sendInfoState.amount <= 0) return;
        const isValidAddress = addressCheck(sendInfoState.address);
        CommonActions.handleLoadingProgress(true);
        try {
            if(isValidAddress){
                let gas = await getEstimateGasSend(wallet.name, sendInfoState.address, sendInfoState.amount);
                setGas(gas);
            } else {
                setAlertDescription(WRONG_TARGET_ADDRESS_WARN_TEXT);
                setOpenAlertModal(true);
                CommonActions.handleLoadingProgress(false);
                return;
            }
        } catch (error){
            console.log(error);
            setAlertDescription(String(error));
            setOpenAlertModal(true);
        }
        CommonActions.handleLoadingProgress(false);
        handleTransactionModal(true);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            getBalance();            
        }, [])
    )

    return (
        <Container
            title="Send"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <ScrollView>
                        <WalletInfo available={balance} />
                        <SendInputBox handleSendInfo={handleSendInfo} available={balance} reset={resetInputValues}/>
                    </ScrollView>
                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                        <Button
                            title="Send"
                            active={sendInfoState.address !== '' && convertNumber(sendInfoState.amount) > 0}
                            onPressEvent={handleSend}/>
                    </View>

                    <TransactionConfirmModal
                            transactionHandler={handleTransaction} 
                            title={"Send"} 
                            fee={getFeesFromGas(gas)}
                            amount={sendInfoState.amount} 
                            open={openTransactionModal} 
                            setOpenModal={handleTransactionModal} />

                    <AlertModal
                            visible={openAlertModal}
                            handleOpen={handleAlertModalOpen}
                            title={"Failed"}
                            desc={alertDescription}
                            confirmTitle={"OK"}
                            type={"ERROR"}/>
                </View>
            </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"space-between",
        paddingHorizontal: 20,
    },
})

export default Send;