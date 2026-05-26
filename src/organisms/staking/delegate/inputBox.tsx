import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CheckLine from '@/assets/icons/material/checkLine.svg';
import {
    AUTO_ENTERED_AMOUNT_TEXT,
    CHAIN_SYMBOL,
    FEE_INSUFFICIENT_NOTICE,
    REDELEGATE_NOTICE_TEXT,
    REDELEGATE_RESTAKE_NOTICE_TEXT,
    UNDELEGATE_NOTICE_TEXT,
    WARNING_FOR_MAX_AMOUNT_TEST
} from '@/constants/common';
import {
    BoxColor,
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

interface IProps {
    type: string;
    operatorAddress: string;
    delegationState: Array<IStakeInfo>;
    stakingGrantState: IStakingGrantState;
    undelegateCount: number;
    resetRedelegateValues: boolean;
    resetInputValues: boolean;
    handleStandardAvailable: (balance: number) => void;
    handleDelegateState: (type: string, value: string | number) => void;
}

const InputBox = ({
    type,
    operatorAddress,
    delegationState,
    stakingGrantState,
    undelegateCount,
    resetRedelegateValues,
    resetInputValues,
    handleStandardAvailable,
    handleDelegateState
}: IProps) => {
    const { balance, getBalance } = useBalanceData();
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [openSelectModal, setOpenSelectModal] = useState(false);

    const [selectOperatorAddressSrc, setSelectOperatorAddressSrc] = useState('');
    const [selectValidatorMoniker, setSelectValidatorMoniker] = useState('');
    const [selectDelegationAmount, setSelectDelegationAmount] = useState(0);

    const [maxActive, setMaxActive] = useState(false);
    const [safetyActive, setSafetyActive] = useState(true);
    const [amount, setAmount] = useState(0);
    const [limitAvailable, setLimitAvailable] = useState(0);
    const [isMaxAmount, setIsMaxAmount] = useState(false);
    const [keepSourceRestake, setKeepSourceRestake] = useState(false);
    const [addTargetRestake, setAddTargetRestake] = useState(false);

    const redelegationList = useMemo(() => {
        return delegationState;
    }, [delegationState]);

    const reward = useMemo(() => {
        if (type === 'Delegate') {
            const state = delegationState.find((value) => value.validatorAddress === operatorAddress);
            if (state !== undefined) {
                return convertNumber(state.reward);
            } else {
                return 0;
            }
        }
        return 0;
    }, [delegationState, balance]);

    const available = useMemo(() => {
        return type === 'Delegate' ? convertNumber(balance) : convertNumber(selectDelegationAmount);
    }, [delegationState, selectDelegationAmount, balance]);

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

    const hasRestakeUpdate = useMemo(() => {
        if (type !== 'Redelegate') {
            return false;
        }

        const isRestakeTarget = (address: string) => {
            if (address === '') return false;
            return stakingGrantState.list.some((item: any) => item.validatorAddress === address && item.isActive);
        };

        const currentKeepSourceRestake = isRestakeTarget(selectOperatorAddressSrc);
        const currentAddTargetRestake = isRestakeTarget(operatorAddress);

        return keepSourceRestake !== currentKeepSourceRestake || addTargetRestake !== currentAddTargetRestake;
    }, [type, keepSourceRestake, addTargetRestake, selectOperatorAddressSrc, operatorAddress, stakingGrantState]);

    const handleSelectModal = (open: boolean) => {
        setOpenSelectModal(open);
    };

    const handleMaxActive = (active: boolean) => {
        setMaxActive(active);
    };

    const handleAmount = (amount: number) => {
        handleDelegateState('amount', amount);
        setAmount(amount);
    };

    const handleSelectValidator = (address: string) => {
        handleDelegateState('operatorAddressSrc', address);
        setSelectOperatorAddressSrc(address);
        const selectedValidator = redelegationList.find((item: any) => item.validatorAddress === address);
        setSelectValidatorMoniker(selectedValidator === undefined ? '' : selectedValidator.moniker);
        setSelectDelegationAmount(selectedValidator === undefined ? 0 : selectedValidator.amount);
    };

    useEffect(() => {
        const isRestakeTarget = (address: string) => {
            if (address === '') return false;
            return stakingGrantState.list.some((item: any) => item.validatorAddress === address && item.isActive);
        };

        if (type !== 'Redelegate') {
            setKeepSourceRestake(false);
            setAddTargetRestake(false);
            return;
        }

        setKeepSourceRestake(isRestakeTarget(selectOperatorAddressSrc));
        setAddTargetRestake(isRestakeTarget(operatorAddress));
    }, [type, selectOperatorAddressSrc, operatorAddress, stakingGrantState]);

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
    }, [type, safetyActive, available, reward]);

    useEffect(() => {
        if (type === 'Delegate' && available > 0) {
            if (available <= 100000) setSafetyActive(false);
        }
    }, [available]);

    useEffect(() => {
        setIsMaxAmount(safetyActive === false && amount >= convertNumber(convertToFctNumberForInput(limitAvailable)));
    }, [amount, limitAvailable, safetyActive]);

    useEffect(() => {
        if (type === 'Undelegate') {
            const amount = delegationState.find((item: any) => item.validatorAddress === operatorAddress)?.amount;
            setSelectDelegationAmount(amount === undefined ? 0 : amount);
        }
    }, [type, delegationState]);

    useFocusEffect(
        useCallback(() => {
            if (type === 'Delegate') {
                getBalance();
            }
        }, [])
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
                {type === 'Redelegate' && (
                    <View style={styles.restakeBox}>
                        <TouchableOpacity style={styles.restakeOption} onPress={() => setKeepSourceRestake(!keepSourceRestake)}>
                            <View style={[styles.checkbox, keepSourceRestake && styles.checkboxActive]}>
                                {keepSourceRestake && <CheckLine width={16} height={16} color={WhiteColor} />}
                            </View>
                            <Text style={styles.checkLabel}>Keep the current validator on restake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.restakeOption} onPress={() => setAddTargetRestake(!addTargetRestake)}>
                            <View style={[styles.checkbox, addTargetRestake && styles.checkboxActive]}>
                                {addTargetRestake && <CheckLine width={16} height={16} color={WhiteColor} />}
                            </View>
                            <Text style={styles.checkLabel}>Add the new validator to restake</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {(type === 'Undelegate' || type === 'Redelegate') && (
                    <>
                        {noticeText.map((value, index) => {
                            return (
                                <View key={index} style={{ paddingVertical: 5 }}>
                                    <WarnContainer text={value} />
                                </View>
                            );
                        })}
                        {hasRestakeUpdate && type === 'Redelegate' && (
                            <View style={{ paddingVertical: 5 }}>
                                <WarnContainer text={REDELEGATE_RESTAKE_NOTICE_TEXT} />
                            </View>
                        )}
                    </>
                )}
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
                            <Text style={[styles.selectTitle, selectOperatorAddressSrc === '' && { color: InputPlaceholderColor }]}>
                                {selectOperatorAddressSrc === '' ? 'Select...' : selectValidatorMoniker}
                            </Text>
                            <DownArrow size={10} color={InputPlaceholderColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                {selectOperatorAddressSrc !== '' && delegate()}
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
                list={redelegationList}
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
    },
    restakeBox: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 4,
        backgroundColor: BoxColor,
        marginVertical: 5,
        gap: 12
    },
    restakeOption: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: TextGrayColor,
        backgroundColor: WhiteColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    checkboxActive: {
        borderColor: PointColor,
        backgroundColor: PointColor
    },
    checkboxMark: {
        fontFamily: Lato,
        fontSize: 12,
        color: WhiteColor,
        lineHeight: 14
    },
    checkLabel: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextColor
    }
});

export default InputBox;
