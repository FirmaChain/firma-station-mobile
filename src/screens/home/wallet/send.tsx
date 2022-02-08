import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import Container from "@/components/parts/containers/conatainer";
import WalletInfo from "@/organims/wallet/send/walletInfo";
import SendInputBox from "@/organims/wallet/send/sendInputBox";
import Button from "@/components/button/button";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import { TRANSACTION_TYPE } from "@/constants/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Send>;

export type SendParams = {
    walletName: string;
    address: string;
}

interface Props {
    route: {params: SendParams};
    navigation: ScreenNavgationProps;
}

const SendScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {walletName, address} = params;

    const [targetAddress, setTargetAddress] = useState('');
    const [amount, setAmount] = useState(0);   
    const [memo, setMemo] = useState(null);

    const [openTransactionModal, setOpenTransactionModal] = useState(false);

    const handleTransaction = (password:string) => {
        handleTransactionModal(false);

        const transactionState = {
            type: TRANSACTION_TYPE["SEND"],
            walletName: walletName,
            password: password,
            targetAddress : targetAddress,
            amount: amount,
            memo: memo,
        }
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
        handleTransactionModal(true);
    }

    return (
        <Container
            title="Send"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <View>
                        <WalletInfo walletName={walletName} address={address} />
                        <SendInputBox address={setTargetAddress} amount={setAmount} memo={setMemo} />
                    </View>
                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                        <Button
                            title="Send"
                            active={address !== '' && amount > 0}
                            onPressEvent={handleSend}/>
                    </View>
                    {openTransactionModal && 
                        <TransactionConfirmModal 
                            transactionHandler={handleTransaction} 
                            title={"Send"} 
                            walletName={walletName} 
                            amount={amount} 
                            open={openTransactionModal} 
                            setOpenModal={handleTransactionModal} />
                    }
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