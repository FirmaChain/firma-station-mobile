import React, { useCallback, useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { useBalanceData } from '@/hooks/wallet/hooks';
import { BgColor, BoxColor, PointColor, TextColor, TextGrayColor } from '@/constants/theme';
import { TRANSACTION_TYPE, WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
import { addressCheck, getEstimateGasSendIBC, getEstimateGasSendToken, getFeesFromGas } from '@/util/firma';
import { convertNumber } from '@/util/common';
import { FIRMACHAIN_DEFAULT_CONFIG, IbcChainState } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import Button from '@/components/button/button';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import AlertModal from '@/components/modal/alertModal';
import SendInputBox from './sendInputBox';
import BalanceInfo from '@/components/parts/balanceInfo';
import { IBCTokenState } from '@/context/ibcTokenContext';
import { ScreenWidth } from '@/util/getScreenSize';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Send>;

interface ISendInfo {
    address: string;
    amount: number;
    memo: string;
    chain: IbcChainState | null
}

interface IProps {
    tokenData: IBCTokenState;
}

export type SendType = 'SEND_TOKEN' | 'SEND_IBC'

const SendIBC = ({ tokenData }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const screenWidth = ScreenWidth();

    const { wallet } = useAppSelector((state) => state);
    const { balance, getBalance } = useBalanceData();

    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
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
    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: activeType === 'SEND_TOKEN' ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [activeType]);

    const interpolatedBackground = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [PointColor, PointColor],
    });

    const interpolatedPosition = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, screenWidth / 2 - 25],
    });


    const handleSendInfo = (type: string, value: string | number | IbcChainState | null) => {
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
        if (activeType === 'SEND_TOKEN') {
            const transactionState = {
                type: TRANSACTION_TYPE['SEND_TOKEN'],
                password: password,
                targetAddress: sendInfoState.address,
                amount: sendInfoState.amount,
                tokenId: tokenData.denom,
                decimal: tokenData.decimal,
                gas: gas,
                memo: sendInfoState.memo
            };
            setInputResetValues(true);
            navigation.navigate(Screens.Transaction, { state: transactionState });
        } else {
            const transactionState = {
                type: TRANSACTION_TYPE['SEND_IBC'],
                password: password,
                targetAddress: sendInfoState.address,
                amount: sendInfoState.amount,
                tokenId: tokenData.denom,
                decimal: tokenData.decimal,
                denom: tokenData.denom,
                channel: sendInfoState.chain?.channel,
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
                if (activeType === 'SEND_TOKEN') {
                    let gas = await getEstimateGasSendToken(wallet.name, sendInfoState.address, tokenData.denom, sendInfoState.amount, tokenData.decimal);
                    setGas(gas);
                } else {
                    if (sendInfoState.chain === null) return;
                    let gas = await getEstimateGasSendIBC(wallet.name, 'transfer', sendInfoState.chain.channel, tokenData.denom, sendInfoState.address, sendInfoState.amount, tokenData.decimal);
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

    useFocusEffect(
        useCallback(() => {
            getBalance();
        }, [])
    );

    return (
        <Container title="Send" backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <View style={{ flex: 6 }}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                            <BalanceInfo available={convertNumber(tokenData.amount)} symbol={tokenData.displayName} showSubBalance={true} subTitle={'FCT Balance'} subAvailable={balance} />
                            <View style={styles.tabContainer}>
                                <Animated.View
                                    style={[
                                        styles.selectTabBackground,
                                        {
                                            backgroundColor: interpolatedBackground,
                                            transform: [
                                                {
                                                    translateX: interpolatedPosition,
                                                },
                                            ],
                                        },
                                    ]}
                                />
                                <TouchableOpacity
                                    style={[styles.tab, activeType === 'SEND_TOKEN' && styles.activeTab]}
                                    onPress={() => setActiveType('SEND_TOKEN')}
                                >
                                    <Text style={[styles.tabText, activeType === 'SEND_TOKEN' && styles.activeTabText]}>{'Send'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tab, activeType === 'SEND_IBC' && styles.activeTab]}
                                    onPress={() => setActiveType('SEND_IBC')}
                                >
                                    <Text style={[styles.tabText, activeType === 'SEND_IBC' && styles.activeTabText]}>{'IBC Send'}</Text>
                                </TouchableOpacity>
                            </View>
                            <SendInputBox
                                handleSendInfo={handleSendInfo}
                                type={activeType}
                                denom={tokenData.denom}
                                available={convertNumber(tokenData.amount)}
                                symbol={tokenData.displayName}
                                dstAddress={''}
                                reset={resetInputValues}
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
                        title={activeType === 'SEND_TOKEN' ? 'Send' : 'Send IBC'}
                        symbol={tokenData.displayName.toUpperCase()}
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
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BoxColor,
        borderRadius: 5,
        padding: 5,
        marginBottom: 20,
    },
    selectTabBackground: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        left: 5,
        borderRadius: 5,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    activeTab: {
    },
    tabText: {
        textAlign: 'center',
        color: TextGrayColor,
    },
    activeTabText: {
        color: TextColor,
        fontWeight: 'bold'
    },
});

export default SendIBC;
