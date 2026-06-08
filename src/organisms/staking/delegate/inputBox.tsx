import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    AUTO_ENTERED_AMOUNT_TEXT,
    CHAIN_SYMBOL,
    FEE_INSUFFICIENT_NOTICE,
    REDELEGATE_NOTICE_TEXT,
    UNDELEGATE_NOTICE_TEXT,
    WARNING_FOR_MAX_AMOUNT_TEST
} from '@/constants/common';
import {
    DisableColor,
    InputBgColor,
    InputPlaceholderColor,
    Lato,
    PointColor,
    PointLightColor,
    TextCatTitleColor,
    TextColor,
    TextGrayColor,
    WhiteColor
} from '@/constants/theme';
import { convertNumber, convertToFctNumber, convertToFctNumberForInput } from '@/util/common';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IStakeInfo, IStakingGrantState } from '@/hooks/staking/hooks';
import { useBalanceData } from '@/hooks/wallet/hooks';
import { DownArrow, StarIcon } from '@/components/icon/icon';
import InputSetVerticalForAmount from '@/components/input/inputSetVerticalForAmount';
import BalanceInfo from '@/components/parts/balanceInfo';
import WarnContainer from '@/components/parts/containers/warnContainer';

import ValidatorSelectModal from './validatorSelectModal';
import RedelegateRestakeStepBox from './redelegateRestakeStepBox';

interface IProps {
    type: string;
    operatorAddress: string;
    delegationState: Array<IStakeInfo>;
    undelegateCount: number;
    resetRedelegateValues: boolean;
    resetInputValues: boolean;
    redelegateStep?: 'amount' | 'restake';
    setRedelegateStep?: (step: 'amount' | 'restake') => void;
    stakingGrantState: IStakingGrantState;
    sourceRestake?: boolean;
    destinationRestake?: boolean;
    setSourceRestake?: (value: boolean) => void;
    setDestinationRestake?: (value: boolean) => void;
    handleStandardAvailable: (balance: number) => void;
    handleDelegateState: (type: string, value: string | number | boolean) => void;
}

const InputBox = ({
    type,
    operatorAddress,
    delegationState,
    undelegateCount,
    resetRedelegateValues,
    resetInputValues,
    redelegateStep = 'amount',
    setRedelegateStep,
    stakingGrantState,
    sourceRestake = false,
    destinationRestake = false,
    setSourceRestake,
    setDestinationRestake,
    handleStandardAvailable,
    handleDelegateState
}: IProps) => {
    const { balance, getBalance } = useBalanceData();
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [openSelectModal, setOpenSelectModal] = useState(false);

    const [selectOperatorAddressSrc, setSelectOperatorAddressSrc] = useState('');
    const [selectDelegationAmount, setSelectDelegationAmount] = useState(0);

    const [maxActive, setMaxActive] = useState(false);
    const [safetyActive, setSafetyActive] = useState(true);
    const [amount, setAmount] = useState(0);
    const [limitAvailable, setLimitAvailable] = useState(0);
    const [isMaxAmount, setIsMaxAmount] = useState(false);

    const sourceValidator = useMemo(() => {
        if (selectOperatorAddressSrc === '') return undefined;
        return delegationState.find((item) => item.validatorAddress === selectOperatorAddressSrc);
    }, [delegationState, selectOperatorAddressSrc]);

    const reward = useMemo(() => {
        if (type !== 'Delegate') return 0;

        const state = delegationState.find((value) => value.validatorAddress === operatorAddress);
        return state === undefined ? 0 : convertNumber(state.reward);
    }, [delegationState, type, operatorAddress]);

    const available = useMemo(() => {
        return type === 'Delegate' ? convertNumber(balance) : convertNumber(selectDelegationAmount);
    }, [type, selectDelegationAmount, balance]);

    const noticeText = useMemo(() => {
        switch (type) {
            case 'Redelegate':
                return REDELEGATE_NOTICE_TEXT;
            case 'Undelegate':
                return UNDELEGATE_NOTICE_TEXT;
            default:
                return [];
        }
    }, [type]);

    const handleSelectModal = useCallback((open: boolean) => {
        setOpenSelectModal(open);
    }, []);

    const handleMaxActive = (active: boolean) => {
        setMaxActive(active);
    };

    const handleAmount = (nextAmount: number) => {
        handleDelegateState('amount', nextAmount);
        setAmount(nextAmount);
    };

    const handleSelectValidator = (address: string) => {
        handleDelegateState('operatorAddressSrc', address);
        handleDelegateState('amount', 0);
        setSelectOperatorAddressSrc(address);
        setAmount(0);
        setSelectDelegationAmount(() => {
            const selectedValidator = delegationState.find((item) => item.validatorAddress === address);
            return selectedValidator === undefined ? 0 : selectedValidator.amount;
        });
        setRedelegateStep?.('amount');
    };

    useEffect(() => {
        if (resetRedelegateValues) {
            setSelectOperatorAddressSrc('');
            setSelectDelegationAmount(0);
            setAmount(0);
        }
    }, [resetRedelegateValues]);

    useEffect(() => {
        switch (type) {
            case 'Delegate':
                if (safetyActive) {
                    if (available > 100000) {
                        handleStandardAvailable(convertNumber(convertToFctNumber(available - 100000)));
                        setLimitAvailable(available + reward - 100000);
                    }
                } else {
                    if (available > 20000) {
                        handleStandardAvailable(convertNumber(convertToFctNumber(available - 20000)));
                        setLimitAvailable(available + reward - 20000);
                    } else {
                        setLimitAvailable(0);
                        setSafetyActive(false);
                    }
                }
                return;
            default:
                setLimitAvailable(0);
                return;
        }
    }, [type, safetyActive, available, reward, handleStandardAvailable]);

    useEffect(() => {
        if (type === 'Delegate' && available > 0) {
            if (available <= 100000) setSafetyActive(false);
        }
    }, [type, available]);

    useEffect(() => {
        setIsMaxAmount(safetyActive === false && amount >= convertNumber(convertToFctNumberForInput(limitAvailable)));
    }, [amount, limitAvailable, safetyActive]);

    useEffect(() => {
        if (type === 'Undelegate') {
            const nextAmount = delegationState.find((item) => item.validatorAddress === operatorAddress)?.amount;
            setSelectDelegationAmount(nextAmount === undefined ? 0 : nextAmount);
        }
    }, [type, delegationState, operatorAddress]);

    useFocusEffect(
        useCallback(() => {
            if (type === 'Delegate') {
                getBalance();
            }
        }, [type, getBalance])
    );

    const ClassifyByType = () => {
        switch (type) {
            case 'Delegate':
                return delegate();
            case 'Undelegate':
                return delegate();
            case 'Redelegate':
                return redelegate();
        }
    };

    const delegate = () => {
        return (
            <View style={styles.conatainer}>
                <InputSetVerticalForAmount
                    key={type === 'Redelegate' ? selectOperatorAddressSrc : type}
                    title="Amount"
                    placeholder={`0 ${_CHAIN_SYMBOL}`}
                    accent={type === 'Delegate' ? safetyActive : maxActive}
                    limitValue={type === 'Delegate' ? limitAvailable : convertNumber(selectDelegationAmount)}
                    resetValues={resetInputValues}
                    enableMaxAmount={true}
                    handleMaxActive={handleMaxActive}
                    onChangeEvent={(value: number) => handleAmount(value)}
                />

                {type === 'Delegate' && (
                    <>
                        <View style={styles.radioBox}>
                            <Text style={[styles.title, { paddingRight: 5 }]}>Safety</Text>
                            <TouchableOpacity disabled={available <= 100000} onPress={() => setSafetyActive(!safetyActive)}>
                                <View
                                    style={[
                                        styles.radioWrapper,
                                        safetyActive
                                            ? { backgroundColor: PointColor, alignItems: 'flex-end' }
                                            : { backgroundColor: DisableColor }
                                    ]}
                                >
                                    <View style={styles.radio} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {available > 0 && available <= 20000 && (
                            <View style={{ marginBottom: 10 }}>
                                <WarnContainer text={FEE_INSUFFICIENT_NOTICE} />
                            </View>
                        )}
                        {safetyActive && available >= 100000 && (
                            <View style={{ marginBottom: 10 }}>
                                <WarnContainer text={AUTO_ENTERED_AMOUNT_TEXT} question={true} />
                            </View>
                        )}
                        {isMaxAmount && (
                            <View>
                                <WarnContainer text={WARNING_FOR_MAX_AMOUNT_TEST} />
                            </View>
                        )}
                    </>
                )}

                {type === 'Undelegate' && (
                    <View style={styles.undelegationCountBox}>
                        <View style={{ paddingHorizontal: 5 }}>
                            <StarIcon size={8} color={TextGrayColor} />
                        </View>
                        <Text style={styles.undelegateCount}>
                            {`Current undelegations : `}
                            <Text style={{ color: PointLightColor }}>{undelegateCount}</Text>
                            {`/7`}
                        </Text>
                    </View>
                )}

                {(type === 'Undelegate' || type === 'Redelegate') &&
                    noticeText.map((value, index) => {
                        return (
                            <View key={index} style={{ paddingVertical: 5 }}>
                                <WarnContainer text={value} />
                            </View>
                        );
                    })}
            </View>
        );
    };

    const redelegate = () => {
        return (
            <View>
                <View style={[styles.conatainer, { marginBottom: 13 }]}>
                    <View style={styles.selectBox}>
                        <Text style={styles.title}>Source Validator</Text>
                        <TouchableOpacity style={styles.select} onPress={() => handleSelectModal(true)}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="middle"
                                style={[styles.selectTitle, selectOperatorAddressSrc === '' && { color: InputPlaceholderColor }]}
                            >
                                {selectOperatorAddressSrc === '' ? 'Select...' : (sourceValidator?.moniker ?? '')}
                            </Text>
                            <DownArrow size={10} color={InputPlaceholderColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                {selectOperatorAddressSrc !== '' &&
                    (redelegateStep === 'amount' ? (
                        delegate()
                    ) : (
                        <RedelegateRestakeStepBox
                            sourceAddress={selectOperatorAddressSrc}
                            destinationAddress={operatorAddress}
                            delegationState={delegationState}
                            stakingGrantState={stakingGrantState}
                            amount={amount}
                            sourceRestake={sourceRestake}
                            destinationRestake={destinationRestake}
                            setSourceRestake={(value) => setSourceRestake?.(value)}
                            setDestinationRestake={(value) => setDestinationRestake?.(value)}
                        />
                    ))}
            </View>
        );
    };

    return (
        <ScrollView>
            <View style={{ paddingHorizontal: 20 }}>
                <BalanceInfo showSubBalance={type === 'Delegate'} available={available} subAvailable={reward} />
            </View>
            {ClassifyByType()}
            <ValidatorSelectModal
                myAddress={operatorAddress}
                list={delegationState}
                open={openSelectModal}
                setOpenModal={handleSelectModal}
                setValue={handleSelectValidator}
                resetValues={resetRedelegateValues}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    conatainer: {
        paddingHorizontal: 20
    },
    selectBox: {
        width: '100%'
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        marginBottom: 5
    },
    select: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: InputBgColor,
        marginBottom: 5
    },
    selectTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextColor
    },
    radioBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    radioWrapper: {
        width: 45,
        borderRadius: 20,
        justifyContent: 'center',
        padding: 3
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor
    },
    undelegationCountBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 20,
        marginTop: -8
    },
    undelegateCount: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextGrayColor
    }
});

export default InputBox;
