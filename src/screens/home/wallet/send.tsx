import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import Container from "../../../components/parts/containers/conatainer";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import WalletInfo from "../../../organims/wallet/send/walletInfo";
import SendInputBox from "../../../organims/wallet/send/sendInputBox";
import Button from "../../../components/button/button";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";
import ViewContainer from "../../../components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Send>;

export type SendParams = {
    walletName: string;
    available: number;
}

interface Props {
    route: {params: SendParams};
    navigation: ScreenNavgationProps;
}

const SendScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {walletName, available} = params;

    console.log("available : ",available);
    

    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [memo, setMemo] = useState('');

    const [openTransactionModal, setOpenTransactionModal] = useState(false);

    const handleTransaction = () => {
        handleTransactionModal(false);
        navigation.navigate(Screens.Transaction);
    }

    const handleTransactionModal = (open:boolean) => {
        setOpenTransactionModal(open);
    }
    
    const handleBack = () => {
        navigation.goBack();
    }

    const handleSend = async() => {
        if(address === '' || amount <= 0) return;
        // let result = await sendToken(
        //     "owner pottery smile evolve pig base lady dismiss badge purchase divide royal medal buffalo miss carbon kiwi gate draft mouse yard reunion thank wage", 
        //     "firma1sftckrgmrf5skqhj5jpvzv6222p2lzgcdgk4hs", 
        //     amount);
        // console.log(result);
        
        handleTransactionModal(true);
    }

    return (
        <Container
            title="Send"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <View>
                        <WalletInfo walletName={walletName} available={available} />
                        <SendInputBox address={setAddress} amount={setAmount} memo={setMemo} />
                    </View>
                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                        <Button
                            title="Send"
                            active={address !== '' && amount > 0}
                            onPressEvent={handleSend}/>
                    </View>
                    <TransactionConfirmModal transactionHandler={handleTransaction} title={"Send"} walletName={walletName} amount={amount} open={openTransactionModal} setOpenModal={handleTransactionModal} />
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