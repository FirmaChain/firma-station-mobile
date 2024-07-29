import React, { useCallback, useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { useBalanceData } from '@/hooks/wallet/hooks';
import { BgColor } from '@/constants/theme';
import { TRANSACTION_TYPE, WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
import { addressCheck, getEstimateGasSend, getEstimateGasSendIBC, getFeesFromGas, getFirmaConfig } from '@/util/firma';
import { convertNumber } from '@/util/common';
import { GUIDE_URI, IBCChainState } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import Button from '@/components/button/button';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import AlertModal from '@/components/modal/alertModal';
import SendInputBox from './sendInputBox';
import BalanceInfo from '@/components/parts/balanceInfo';
import SendTypeSelector, { SendType } from '../common/senTypeSelector';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Send>;

interface ISendInfo {
    address: string;
    amount: number;
    memo: string;
    chain: IBCChainState | null
}

const Send = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { wallet } = useAppSelector((state) => state);
    const { balance, getBalance } = useBalanceData();

    const denom = getFirmaConfig().denom;

    const [gas, setGas] = useState(getFirmaConfig().defaultGas);
    const [sendInfoState, setSendInfoState] = useState<ISendInfo>({
        address: '',
        amount: 0,
        memo: '',
        chain: null
    });
    const [resetInputValues, setInputResetValues] = useState(false);

    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');
    const [activeType, setActiveType] = useState<SendType>('SEND_TOKEN');

    const handleSendInfo = (type: string, value: string | number | IBCChainState | null) => {
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
        if (activeType === 'SEND_IBC') {
            const transactionState = {
                type: TRANSACTION_TYPE['SEND_IBC'],
                password: password,
                targetAddress: sendInfoState.address,
                amount: sendInfoState.amount,
                decimal: 6,
                denom: denom,
                channel: sendInfoState.chain?.channel,
                gas: gas,
                memo: sendInfoState.memo
            };
            setInputResetValues(true);
            navigation.navigate(Screens.Transaction, { state: transactionState });
        } else {
            const transactionState = {
                type: TRANSACTION_TYPE['SEND'],
                password: password,
                targetAddress: sendInfoState.address,
                amount: sendInfoState.amount,
                gas: gas,
                memo: sendInfoState.memo
            };
            setInputResetValues(true);
            navigation.navigate(Screens.Transaction, { state: transactionState });
        }
    };

    const handleSend = async () => {
        if (sendInfoState.address === '' || sendInfoState.amount <= 0) return;
        const isValidAddress = addressCheck(sendInfoState.address);
        CommonActions.handleLoadingProgress(true);
        try {
            if (isValidAddress) {
                if (activeType === 'SEND_IBC') {
                    if (sendInfoState.chain === null) return;
                    let gas = await getEstimateGasSendIBC(wallet.name, 'transfer', sendInfoState.chain.channel, denom, sendInfoState.address, sendInfoState.amount, 6);
                    setGas(gas);
                } else {
                    let gas = await getEstimateGasSend(wallet.name, sendInfoState.address, sendInfoState.amount);
                    setGas(gas);
                }
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

    const activeToSend = useMemo(() => {
        if (activeType === 'SEND_TOKEN') return Boolean(sendInfoState.address !== '' && convertNumber(sendInfoState.amount) > 0);
        if (activeType === 'SEND_IBC') return Boolean(sendInfoState.chain !== null && sendInfoState.address !== '' && convertNumber(sendInfoState.amount) > 0);
        return false
    }, [sendInfoState, activeType])

    useFocusEffect(
        useCallback(() => {
            getBalance();
        }, [])
    );

    return (
        <Container title="Send" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <View style={{ flex: 6 }}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                            <BalanceInfo available={balance} />
                            <SendTypeSelector type={activeType} handleType={setActiveType} />
                            <SendInputBox
                                handleSendInfo={handleSendInfo}
                                type={activeType}
                                available={balance}
                                dstAddress={wallet.dstAddress}
                                reset={resetInputValues}
                            />
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Button
                            title="Send"
                            active={activeToSend}
                            onPressEvent={() => handleSend()}
                        />
                    </View>
                    <TransactionConfirmModal
                        transactionHandler={handleTransaction}
                        title={'Send'}
                        fee={getFeesFromGas(gas)}
                        amount={sendInfoState.amount}
                        memo={sendInfoState.memo === '' ? ' ' : sendInfoState.memo}
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

export default Send;
