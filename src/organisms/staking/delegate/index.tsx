import React, { useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { useDelegationData } from '@/hooks/staking/hooks';
import { getEstimateGasDelegate, getEstimateGasRedelegate, getEstimateGasUndelegate, getFeesFromGas, getFirmaConfig } from '@/util/firma';
import { convertNumber } from '@/util/common';
import { DATA_RELOAD_INTERVAL, MAXIMUM_UNDELEGATE_NOTICE_TEXT, TRANSACTION_TYPE } from '@/constants/common';
import { GUIDE_URI } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import Button from '@/components/button/button';
import AlertModal from '@/components/modal/alertModal';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import InputBox from './inputBox';
import { useInterval } from '@/hooks/common/hooks';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Delegate>;

interface IProps {
    type: string;
    operatorAddress: string;
}

interface IDelegateState {
    type: string;
    operatorAddressDst: string;
    operatorAddressSrc: string;
    amount: number;
    gas: number;
}

interface IAlertState {
    title: string;
    desc: string;
    button: string;
    type: 'ERROR' | 'CONFIRM';
}

const Delegate = ({ type, operatorAddress }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { wallet, common } = useAppSelector((state) => state);
    const { delegationState, undelegationState, handleDelegationState, handleUndelegationState } = useDelegationData();

    const [resetInputValues, setInputResetValues] = useState(false);
    const [resetRedelegateValues, setResetRedelegateValues] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isSignModalOpen, setIsSignModalOpen] = useState(false);
    const [alertState, setAlertState] = useState<IAlertState | null>(null);

    const [status, setStatus] = useState(0);
    const [standardAvailable, setStandardAvailable] = useState(0);
    const [delegateState, setDelegateState] = useState<IDelegateState>({
        type: TRANSACTION_TYPE[type.toUpperCase()],
        operatorAddressDst: operatorAddress,
        operatorAddressSrc: '',
        amount: 0,
        gas: getFirmaConfig().defaultGas
    });

    const handleModalOpen = (open: boolean) => {
        setIsAlertModalOpen(open);
        if (open === false) setAlertState(null);
    };

    const handleSignModal = (open: boolean) => {
        setIsSignModalOpen(open);
        if (open === false) setStatus(status - 1);
    };

    const handleStandardAvailable = (balance: number) => {
        setStandardAvailable(balance);
    };

    const handleDelegateState = (type: string, value: string | number) => {
        setDelegateState((prevState) => ({
            ...prevState,
            [type]: value
        }));
    };

    const UndelegateCount = useMemo(() => {
        let count = 0;
        undelegationState.find((val) => {
            if (val.validatorAddress === operatorAddress) count++;
        });

        return count;
    }, [undelegationState, operatorAddress]);

    const ActivateButton = useMemo(() => {
        const enteredAmount = convertNumber(delegateState.amount) > 0;
        if (type === 'Undelegate') {
            const enableUndelegate = UndelegateCount < 7;
            if (enableUndelegate === false) {
                setAlertState({
                    title: 'Notice',
                    desc: MAXIMUM_UNDELEGATE_NOTICE_TEXT,
                    button: 'OK',
                    type: 'CONFIRM'
                });
                handleModalOpen(true);
            }
            return enableUndelegate && enteredAmount;
        }

        return enteredAmount;
    }, [type, delegateState, UndelegateCount]);

    const handleNext = async () => {
        if (status > 0) return;
        CommonActions.handleLoadingProgress(true);

        let gas = getFirmaConfig().defaultGas;
        try {
            switch (type) {
                case 'Delegate':
                    let amount = standardAvailable > delegateState.amount ? delegateState.amount : standardAvailable;
                    gas = await getEstimateGasDelegate(wallet.name, delegateState.operatorAddressDst, amount);
                    break;
                case 'Undelegate':
                    gas = await getEstimateGasUndelegate(wallet.name, delegateState.operatorAddressDst, delegateState.amount);
                    break;
                case 'Redelegate':
                    gas = await getEstimateGasRedelegate(
                        wallet.name,
                        delegateState.operatorAddressSrc,
                        delegateState.operatorAddressDst,
                        delegateState.amount
                    );
                    break;
            }
            handleDelegateState('gas', gas);
            setAlertState(null);
            setStatus(1);
        } catch (error) {
            console.log(error);
            CommonActions.handleLoadingProgress(false);
            setAlertState({
                title: 'Failed',
                desc: String(error),
                button: 'OK',
                type: 'ERROR'
            });
            handleModalOpen(true);
            return;
        }
        CommonActions.handleLoadingProgress(false);
    };

    const handleTransaction = (password: string) => {
        setStatus(0);
        setInputResetValues(true);
        setResetRedelegateValues(true);

        const transactionState = {
            ...delegateState,
            password: password
        };

        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const refreshStates = async () => {
        try {
            await handleDelegationState();
            await handleUndelegationState();
            setResetRedelegateValues(false);
            setInputResetValues(false);
            CommonActions.handleDataLoadStatus(0);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    };

    const handleMoveToWeb = () => {
        let key = type.toLowerCase();
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[key]});
        Linking.openURL(GUIDE_URI[key]);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        setIsSignModalOpen(status > 0);
    }, [status]);

    useInterval(
        () => {
            refreshStates();
        },
        common.dataLoadStatus > 0 ? DATA_RELOAD_INTERVAL : null,
        true
    );

    useEffect(() => {
        if (isFocused) {
            refreshStates();
        }
    }, [isFocused]);

    return (
        <Container title={type} handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer>
                <>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 6 }}>
                            <ScrollView keyboardShouldPersistTaps={'handled'}>
                                <InputBox
                                    type={type}
                                    operatorAddress={delegateState.operatorAddressDst}
                                    delegationState={delegationState}
                                    undelegateCount={UndelegateCount}
                                    handleStandardAvailable={handleStandardAvailable}
                                    handleDelegateState={handleDelegateState}
                                    resetRedelegateValues={resetRedelegateValues}
                                    resetInputValues={resetInputValues}
                                />
                                <TransactionConfirmModal
                                    transactionHandler={handleTransaction}
                                    title={type}
                                    amount={delegateState.amount}
                                    fee={getFeesFromGas(delegateState.gas)}
                                    open={isSignModalOpen}
                                    setOpenModal={handleSignModal}
                                />
                            </ScrollView>
                        </View>
                        <View style={[styles.buttonBox, { flex: 1 }]}>
                            <Button title={'Next'} active={ActivateButton} onPressEvent={handleNext} />
                        </View>
                    </View>

                    {alertState !== null && (
                        <AlertModal
                            visible={isAlertModalOpen}
                            handleOpen={handleModalOpen}
                            title={alertState.title}
                            desc={alertState.desc}
                            confirmTitle={alertState.button}
                            type={alertState.type}
                        />
                    )}
                </>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    }
});

export default Delegate;
