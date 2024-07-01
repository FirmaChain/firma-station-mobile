import React, { useCallback, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { BgColor } from '@/constants/theme';
import { TRANSACTION_TYPE, WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
import { addressCheck, getCW20Balance, getEstimateGasSendCW20, getFeesFromGas } from '@/util/firma';
import { convertNumber } from '@/util/common';
import { FIRMACHAIN_DEFAULT_CONFIG, GUIDE_URI } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import Button from '@/components/button/button';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import AlertModal from '@/components/modal/alertModal';
import BalanceInfo from '@/components/parts/balanceInfo';
import SendInputBox from './sendInputBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SendCW20>;

interface ISendInfo {
    address: string;
    amount: string;
}

interface IProps {
    contract: string;
    symbol: string;
}

const SendCW20 = ({ contract, symbol }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { wallet } = useAppSelector((state) => state);

    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [sendInfoState, setSendInfoState] = useState<ISendInfo>({
        address: '',
        amount: '0',
    });
    const [resetInputValues, setInputResetValues] = useState(false);

    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');
    const [balance, setBalance] = useState<number>(0);

    const getBalance = async () => {
        try {
            let result = await getCW20Balance(contract, wallet.address);
            setBalance(result);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSendInfo = (type: string, value: string | number) => {
        let val: any = value;
        if (type === 'memo' && val === '') val = null;
        setSendInfoState((prevState) => ({
            ...prevState,
            [type]: val
        }));
    };

    const handleAlertModalOpen = (open: boolean) => {
        setOpenAlertModal(open);
    };

    const handleTransactionModal = (open: boolean) => {
        setOpenTransactionModal(open);
    };

    const handleTransaction = (password: string) => {
        handleTransactionModal(false);

        const transactionState = {
            type: TRANSACTION_TYPE['SEND_CW20'],
            password: password,
            contractAddress: contract,
            targetAddress: sendInfoState.address,
            amount: sendInfoState.amount,
            gas: gas,
        };
        setInputResetValues(true);
        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const handleSend = async () => {
        if (sendInfoState.address === '' || convertNumber(sendInfoState.amount) <= 0) return;
        const isValidAddress = addressCheck(sendInfoState.address);
        CommonActions.handleLoadingProgress(true);
        try {
            if (isValidAddress) {
                let gas = await getEstimateGasSendCW20(wallet.name, contract, sendInfoState.address, sendInfoState.amount);
                setGas(gas);
            } else {
                setAlertDescription(WRONG_TARGET_ADDRESS_WARN_TEXT);
                setOpenAlertModal(true);
                CommonActions.handleLoadingProgress(false);
                return;
            }
        } catch (error) {
            console.log(error);
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            setOpenAlertModal(true);
            return;
        }
        CommonActions.handleLoadingProgress(false);
        handleTransactionModal(true);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["send"]});
        Linking.openURL(GUIDE_URI['send']);
    };

    useFocusEffect(
        useCallback(() => {
            getBalance();
        }, [])
    );

    return (
        <Container title="Send CW20" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <View style={{ flex: 6 }}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                            <BalanceInfo available={balance} symbol={symbol.toUpperCase()} />
                            <SendInputBox
                                handleSendInfo={handleSendInfo}
                                available={balance}
                                dstAddress={wallet.dstAddress}
                                reset={resetInputValues}
                                symbol={symbol}
                            />
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Button
                            title="Send"
                            active={sendInfoState.address !== '' && convertNumber(sendInfoState.amount) > 0}
                            onPressEvent={() => handleSend()}
                        />
                    </View>

                    <TransactionConfirmModal
                        transactionHandler={handleTransaction}
                        title={'Send CW20'}
                        symbol={symbol}
                        fee={getFeesFromGas(gas)}
                        amount={convertNumber(sendInfoState.amount)}
                        open={openTransactionModal}
                        setOpenModal={handleTransactionModal}
                    />
                    {openAlertModal && (
                        <AlertModal
                            visible={openAlertModal}
                            handleOpen={handleAlertModalOpen}
                            title={'Failed'}
                            desc={alertDescription}
                            confirmTitle={'OK'}
                            type={'ERROR'}
                        />
                    )}
                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    }
});

export default SendCW20;
