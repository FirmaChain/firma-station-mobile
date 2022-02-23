import React, { useCallback, useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import Container from "@/components/parts/containers/conatainer";
import WalletInfo from "@/organims/wallet/send/walletInfo";
import SendInputBox from "@/organims/wallet/send/sendInputBox";
import Button from "@/components/button/button";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import { CONTEXT_ACTIONS_TYPE, FIRMACHAIN_DEFAULT_CONFIG, TRANSACTION_TYPE, WRONG_TARGET_ADDRESS_WARN_TEXT } from "@/constants/common";
import { AppContext } from "@/util/context";
import { addressCheck, getEstimateGasSend, getFeesFromGas } from "@/util/firma";
import { useBalanceData } from "@/hooks/wallet/hooks";
import { useFocusEffect } from "@react-navigation/native";
import AlertModal from "@/components/modal/alertModal";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Send>;

interface Props {
    navigation: ScreenNavgationProps;
}

const SendScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation} = props;

    const {wallet, dispatchEvent} = useContext(AppContext);
    const {balance, getBalance} = useBalanceData(wallet.address);

    const [targetAddress, setTargetAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [memo, setMemo] = useState(null);
    const [resetInputValues, setInputResetValues] = useState(false);

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const [openTransactionModal, setOpenTransactionModal] = useState(false);

    const handleTransaction = (password:string) => {
        handleTransactionModal(false);

        const transactionState = {
            type: TRANSACTION_TYPE["SEND"],
            password: password,
            targetAddress : targetAddress,
            amount: amount,
            gas: gas,
            memo: memo,
        }
        setInputResetValues(true);
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const handleTransactionModal = (open:boolean) => {
        setOpenTransactionModal(open);
    }
    
    const handleBack = () => {
        navigation.goBack();
    }

    const handleSend = async() => {
        if(targetAddress === '' || amount <= 0) return;
        const isValidAddress = addressCheck(targetAddress);
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
        try {
            if(isValidAddress){
                let gas = await getEstimateGasSend(wallet.name, targetAddress, amount);
                setGas(gas);
            } else {
                setAlertDescription(WRONG_TARGET_ADDRESS_WARN_TEXT);
                setIsAlertModalOpen(true);
                dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
                return;
            }
        } catch (error){
            console.log(error);
            setAlertDescription(String(error));
            setIsAlertModalOpen(true);
        }
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
        handleTransactionModal(true);
    }

    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
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
                        <SendInputBox address={setTargetAddress} amount={setAmount} memo={setMemo} available={balance} reset={resetInputValues}/>
                    </ScrollView>
                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                        <Button
                            title="Send"
                            active={wallet.address !== '' && amount > 0}
                            onPressEvent={handleSend}/>
                    </View>

                    <TransactionConfirmModal 
                            transactionHandler={handleTransaction} 
                            title={"Send"} 
                            fee={getFeesFromGas(gas)}
                            amount={amount} 
                            open={openTransactionModal} 
                            setOpenModal={handleTransactionModal} />

                    <AlertModal
                            visible={isAlertModalOpen}
                            handleOpen={handleModalOpen}
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

export default SendScreen;