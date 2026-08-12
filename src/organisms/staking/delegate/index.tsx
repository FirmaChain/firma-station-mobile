import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { MAXIMUM_UNDELEGATE_NOTICE_TEXT, TRANSACTION_TYPE } from '@/constants/common';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { convertNumber } from '@/util/common';
import {
    buildUpdatedRestakeValidatorAddressList,
    getEstimateGasDelegate,
    getEstimateGasRedelegate,
    getEstimateGasUndelegate,
    getFeesFromGas,
    getFirmaConfig
} from '@/util/firma';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import type { RefreshLifecycle } from '@/hooks/common/useRefreshPolling';
import { useScreenRefreshPolling } from '@/hooks/common/useScreenRefreshPolling';
import { useDelegationData } from '@/hooks/staking/hooks';
import Button from '@/components/button/button';
import AlertModal from '@/components/modal/alertModal';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';

import InputBox from './inputBox';

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
    sourceRestake?: boolean;
    destinationRestake?: boolean;
}

interface IAlertState {
    title: string;
    desc: string;
    button: string;
    type: 'ERROR' | 'CONFIRM';
}

interface IRedelegateTransactionPlan {
    gas: number;
    hasRestakeListChanged: boolean;
    validatorAddressList?: string[];
}

const Delegate = ({ type, operatorAddress }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { name: walletName } = useAppSelector((state) => state.wallet);

    const {
        delegationState,
        undelegationState,
        stakingGrantState,
        handleDelegationState,
        handleStakingGrantActivationState,
        handleTotalDelegationPolling
    } = useDelegationData();

    const [redelegateStep, setRedelegateStep] = useState<'amount' | 'restake'>('amount');
    const [resetInputValues, setInputResetValues] = useState(false);
    const [resetRedelegateValues, setResetRedelegateValues] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isSignModalOpen, setIsSignModalOpen] = useState(false);
    const [alertState, setAlertState] = useState<IAlertState | null>(null);
    const [redelegateTransactionPlan, setRedelegateTransactionPlan] = useState<IRedelegateTransactionPlan | null>(null);

    const [status, setStatus] = useState(0);
    const [standardAvailable, setStandardAvailable] = useState(0);
    const [delegateState, setDelegateState] = useState<IDelegateState>({
        type: TRANSACTION_TYPE[type.toUpperCase()],
        operatorAddressDst: operatorAddress,
        operatorAddressSrc: '',
        amount: 0,
        gas: getFirmaConfig().defaultGas,
        sourceRestake: false,
        destinationRestake: false
    });

    const handleModalOpen = (open: boolean) => {
        setIsAlertModalOpen(open);
        if (open === false) setAlertState(null);
    };

    const handleSignModal = (open: boolean) => {
        setIsSignModalOpen(open);
        if (open === false) {
            setStatus(status - 1);
            setRedelegateTransactionPlan(null);
        }
    };

    const handleStandardAvailable = (balance: number) => {
        setStandardAvailable(balance);
    };

    const handleDelegateState = (key: string, value: string | number | boolean) => {
        setDelegateState((prevState) => ({
            ...prevState,
            [key]: value
        }));
    };

    const UndelegateCount = useMemo(() => {
        let count = 0;
        undelegationState.find((val) => {
            if (val.validatorAddress === operatorAddress) count++;
        });

        return count;
    }, [undelegationState, operatorAddress]);

    const hasCurrentSourceRestake = useMemo(() => {
        if (type !== 'Redelegate' || delegateState.operatorAddressSrc === '') return false;
        return stakingGrantState.list.some((item) => item.validatorAddress === delegateState.operatorAddressSrc && item.isActive);
    }, [type, delegateState.operatorAddressSrc, stakingGrantState]);

    const hasCurrentDestinationRestake = useMemo(() => {
        if (type !== 'Redelegate' || delegateState.operatorAddressDst === '') return false;
        return stakingGrantState.list.some((item) => item.validatorAddress === delegateState.operatorAddressDst && item.isActive);
    }, [type, delegateState.operatorAddressDst, stakingGrantState]);

    const currentRestakeValidatorAddressList = useMemo(() => {
        return stakingGrantState.list.filter((item) => item.isActive).map((item) => item.validatorAddress);
    }, [stakingGrantState.list]);

    const updatedRestakeValidatorAddressList = useMemo(() => {
        if (type !== 'Redelegate') return [];

        return buildUpdatedRestakeValidatorAddressList(
            currentRestakeValidatorAddressList,
            delegateState.operatorAddressSrc,
            delegateState.operatorAddressDst,
            Boolean(delegateState.sourceRestake),
            Boolean(delegateState.destinationRestake)
        );
    }, [
        type,
        currentRestakeValidatorAddressList,
        delegateState.operatorAddressSrc,
        delegateState.operatorAddressDst,
        delegateState.sourceRestake,
        delegateState.destinationRestake
    ]);

    const hasRestakeListChanged = useMemo(() => {
        if (type !== 'Redelegate') return false;

        if (currentRestakeValidatorAddressList.length !== updatedRestakeValidatorAddressList.length) return true;

        return currentRestakeValidatorAddressList.some(
            (validatorAddress) => updatedRestakeValidatorAddressList.includes(validatorAddress) === false
        );
    }, [type, currentRestakeValidatorAddressList, updatedRestakeValidatorAddressList]);

    const shouldShowRedelegateRestakeStep = type === 'Redelegate' && currentRestakeValidatorAddressList.length > 0;

    const primaryButtonTitle = type === 'Redelegate' && redelegateStep === 'restake' ? (hasRestakeListChanged ? 'Next' : 'Skip') : 'Next';
    const hasRedelegateRestakeConfirm =
        type === 'Redelegate' && (redelegateTransactionPlan?.hasRestakeListChanged ?? hasRestakeListChanged);

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
    }, [type, delegateState.amount, UndelegateCount]);

    const handleNext = async () => {
        if (status > 0) return;

        if (type === 'Redelegate' && redelegateStep === 'amount' && shouldShowRedelegateRestakeStep) {
            setRedelegateStep('restake');
            return;
        }

        const loadingRequestId = CommonActions.beginLoadingProgress();

        let gas = getFirmaConfig().defaultGas;
        let nextRedelegateTransactionPlan: IRedelegateTransactionPlan | null = null;
        try {
            switch (type) {
                case 'Delegate': {
                    const amount = standardAvailable > delegateState.amount ? delegateState.amount : standardAvailable;
                    gas = await getEstimateGasDelegate(walletName, delegateState.operatorAddressDst, amount);
                    break;
                }
                case 'Undelegate':
                    gas = await getEstimateGasUndelegate(walletName, delegateState.operatorAddressDst, delegateState.amount);
                    break;
                case 'Redelegate': {
                    const validatorAddressList = hasRestakeListChanged ? [...updatedRestakeValidatorAddressList] : undefined;
                    gas = await getEstimateGasRedelegate(
                        walletName,
                        delegateState.operatorAddressSrc,
                        delegateState.operatorAddressDst,
                        delegateState.amount,
                        validatorAddressList
                    );
                    nextRedelegateTransactionPlan = {
                        gas,
                        hasRestakeListChanged,
                        validatorAddressList
                    };
                    break;
                }
            }
            handleDelegateState('gas', gas);
            setRedelegateTransactionPlan(nextRedelegateTransactionPlan);
            setAlertState(null);
            setStatus(1);
        } catch (error) {
            console.error(error);
            CommonActions.endLoadingProgress(loadingRequestId);
            setAlertState({
                title: 'Failed',
                desc: String(error),
                button: 'OK',
                type: 'ERROR'
            });
            handleModalOpen(true);
            return;
        }
        CommonActions.endLoadingProgress(loadingRequestId);
    };

    const handleTransaction = (password: string) => {
        setStatus(0);
        setRedelegateStep('amount');
        setInputResetValues(true);
        setResetRedelegateValues(true);

        const transactionState = {
            ...delegateState,
            gas: redelegateTransactionPlan?.gas ?? delegateState.gas,
            password: password,
            validatorAddressList: redelegateTransactionPlan?.validatorAddressList
        };

        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const refreshStates = useCallback(
        async (lifecycle: RefreshLifecycle) => {
            const [currentDelegationList] = await Promise.all([
                handleDelegationState(lifecycle),
                handleStakingGrantActivationState(lifecycle)
            ]);
            if (!lifecycle.isValid() || currentDelegationList === undefined) return;
            await handleTotalDelegationPolling(lifecycle, currentDelegationList);
        },
        [handleDelegationState, handleStakingGrantActivationState, handleTotalDelegationPolling]
    );

    useScreenRefreshPolling({
        refresh: refreshStates,
        commit: (_value, lifecycle) => {
            if (!lifecycle.isValid()) return;
            setResetRedelegateValues(false);
            setInputResetValues(false);
        }
    });

    const handleMoveToWeb = () => {
        const key = type.toLowerCase();
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[key]});
        Linking.openURL(GUIDE_URI[key]);
    };

    const handleRedelegateRestakeBack = () => {
        handleDelegateState('amount', 0);
        setRedelegateTransactionPlan(null);
        setRedelegateStep('amount');
    };

    const handleBack = () => {
        if (type === 'Redelegate' && redelegateStep === 'restake') {
            handleRedelegateRestakeBack();
            return;
        }
        navigation.goBack();
    };

    useEffect(() => {
        setIsSignModalOpen(status > 0);
    }, [status]);

    useEffect(() => {
        if (type !== 'Redelegate') {
            setRedelegateStep('amount');
        }
    }, [type]);

    useEffect(() => {
        if (type === 'Redelegate' && redelegateStep === 'amount') {
            handleDelegateState('sourceRestake', hasCurrentSourceRestake);
            handleDelegateState('destinationRestake', hasCurrentDestinationRestake);
        }
    }, [type, redelegateStep, hasCurrentSourceRestake, hasCurrentDestinationRestake]);

    return (
        <Container title={type} handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer>
                <>
                    <View style={styles.inlineStyle1}>
                        <View style={styles.inlineStyle2}>
                            <ScrollView keyboardShouldPersistTaps={'handled'}>
                                <InputBox
                                    type={type}
                                    operatorAddress={delegateState.operatorAddressDst}
                                    delegationState={delegationState}
                                    undelegateCount={UndelegateCount}
                                    resetRedelegateValues={resetRedelegateValues}
                                    resetInputValues={resetInputValues}
                                    redelegateStep={redelegateStep}
                                    setRedelegateStep={setRedelegateStep}
                                    stakingGrantState={stakingGrantState}
                                    sourceRestake={Boolean(delegateState.sourceRestake)}
                                    destinationRestake={Boolean(delegateState.destinationRestake)}
                                    setSourceRestake={(value) => handleDelegateState('sourceRestake', value)}
                                    setDestinationRestake={(value) => handleDelegateState('destinationRestake', value)}
                                    handleStandardAvailable={handleStandardAvailable}
                                    handleDelegateState={handleDelegateState}
                                />
                                <TransactionConfirmModal
                                    transactionHandler={handleTransaction}
                                    title={hasRedelegateRestakeConfirm ? 'Redelegate + Restake' : type}
                                    amount={delegateState.amount}
                                    fee={getFeesFromGas(redelegateTransactionPlan?.gas ?? delegateState.gas)}
                                    extraData={
                                        hasRedelegateRestakeConfirm
                                            ? {
                                                  messages: '2 messages in 1 transaction'
                                              }
                                            : null
                                    }
                                    open={isSignModalOpen}
                                    setOpenModal={handleSignModal}
                                />
                            </ScrollView>
                        </View>
                        <View style={[styles.buttonBox, styles.inlineStyle3]}>
                            {type === 'Redelegate' && redelegateStep === 'restake' ? (
                                <View style={styles.redelegateButtonRow}>
                                    <View style={styles.redelegateButtonItem}>
                                        <Button
                                            title={'Back'}
                                            active={true}
                                            border={true}
                                            borderColor={'#383745'}
                                            onPressEvent={handleRedelegateRestakeBack}
                                        />
                                    </View>
                                    <View style={styles.redelegateButtonItem}>
                                        <Button title={primaryButtonTitle} active={ActivateButton} onPressEvent={handleNext} />
                                    </View>
                                </View>
                            ) : (
                                <Button title={primaryButtonTitle} active={ActivateButton} onPressEvent={handleNext} />
                            )}
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
    inlineStyle1: { flex: 1 },
    inlineStyle2: { flex: 6 },
    inlineStyle3: { flex: 1 },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    redelegateButtonRow: {
        flexDirection: 'row',
        gap: 10
    },
    redelegateButtonItem: {
        flex: 1
    }
});

export default Delegate;
