import React, { useContext, useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import Container from "@/components/parts/containers/conatainer";
import WalletInfo from "@/organims/wallet/send/walletInfo";
import SendInputBox from "@/organims/wallet/send/sendInputBox";
import Button from "@/components/button/button";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import { CONTEXT_ACTIONS_TYPE, FIRMACHAIN_DEFAULT_CONFIG, TRANSACTION_TYPE } from "@/constants/common";
import { AppContext } from "@/util/context";
import { getEstimateGasSend, getFeesFromGas } from "@/util/firma";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Send>;

interface Props {
    navigation: ScreenNavgationProps;
}

const SendScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation} = props;

    const {wallet, dispatchEvent} = useContext(AppContext);

    const [targetAddress, setTargetAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [memo, setMemo] = useState(null);
    const [resetInputValues, setInputResetValues] = useState(false);

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
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
        try {
            let gas = await getEstimateGasSend(wallet.name, targetAddress, amount);
            setGas(gas);
        } catch (error){
            console.log(error);
        }
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
        handleTransactionModal(true);
    }

    return (
        <Container
            title="Send"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <Pressable onPress={() => Keyboard.dismiss()}>
                        <WalletInfo address={wallet.address} />
                        <SendInputBox address={setTargetAddress} amount={setAmount} memo={setMemo} reset={resetInputValues}/>
                    </Pressable>
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