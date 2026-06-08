import React, { ReactNode, useMemo, useState } from 'react';
import CheckLine from '@/assets/icons/material/checkLine.svg';
import { CHAIN_SYMBOL, REDELEGATE_RESTAKE_TOOLTIP, REDELEGATE_RESTAKE_WARN, RESTAKE_VALIDATOR_TYPE } from '@/constants/common';
import { BoxColor, Lato, NoColor, PointColor, TextCatTitleColor, TextColor, TextGrayColor, WhiteColor, YesColor } from '@/constants/theme';
import { convertAmount, convertToFctNumber } from '@/util/common';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IStakeInfo, IStakingGrantState, IValidatorState, useValidatorData } from '@/hooks/staking/hooks';
import { QuestionCircle } from '@/components/icon/icon';
import WarnContainer from '@/components/parts/containers/warnContainer';
import ValidatorProfile from '@/components/parts/validatorProfile';

interface IProps {
    sourceAddress: string;
    destinationAddress: string;
    delegationState: Array<IStakeInfo>;
    stakingGrantState: IStakingGrantState;
    amount: number;
    sourceRestake: boolean;
    destinationRestake: boolean;
    setSourceRestake: (value: boolean) => void;
    setDestinationRestake: (value: boolean) => void;
}

const RedelegateRestakeStepBox = ({
    sourceAddress,
    destinationAddress,
    delegationState,
    stakingGrantState,
    amount,
    sourceRestake,
    destinationRestake,
    setSourceRestake,
    setDestinationRestake
}: IProps) => {
    const { validators } = useValidatorData();
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();
    const [showInfo, setShowInfo] = useState(false);

    const sourceDelegation = useMemo(() => {
        if (sourceAddress === '') return undefined;
        return delegationState.find((item) => item.validatorAddress === sourceAddress);
    }, [delegationState, sourceAddress]);

    const destinationValidator = useMemo(() => {
        if (destinationAddress === '') return undefined;
        return validators.find((item) => item.validatorAddress === destinationAddress);
    }, [validators, destinationAddress]);

    const sourceDelegationAmount = useMemo(() => {
        return delegationState.find((item) => item.validatorAddress === sourceAddress)?.amount ?? 0;
    }, [delegationState, sourceAddress]);

    const destinationDelegationAmount = useMemo(() => {
        return delegationState.find((item) => item.validatorAddress === destinationAddress)?.amount ?? 0;
    }, [delegationState, destinationAddress]);

    const sourceDelegationAmountFct = useMemo(() => convertToFctNumber(sourceDelegationAmount), [sourceDelegationAmount]);
    const destinationDelegationAmountFct = useMemo(() => convertToFctNumber(destinationDelegationAmount), [destinationDelegationAmount]);

    const sourceRemainingAmount = useMemo(() => Math.max(sourceDelegationAmountFct - amount, 0), [sourceDelegationAmountFct, amount]);
    const destinationTotalAmount = useMemo(() => destinationDelegationAmountFct + amount, [destinationDelegationAmountFct, amount]);

    const currentSourceRestake = useMemo(() => {
        if (sourceAddress === '') return false;
        return stakingGrantState.list.some((item) => item.validatorAddress === sourceAddress && item.isActive);
    }, [stakingGrantState, sourceAddress]);

    const currentDestinationRestake = useMemo(() => {
        if (destinationAddress === '') return false;
        return stakingGrantState.list.some((item) => item.validatorAddress === destinationAddress && item.isActive);
    }, [stakingGrantState, destinationAddress]);

    const sourceHint = useMemo(() => {
        if (currentSourceRestake && sourceRestake) return 'in Restake list';
        if (currentSourceRestake && sourceRestake === false) return 'will be removed from Restake list';
        if (currentSourceRestake === false && sourceRestake) return 'will be added to Restake list';
        return 'not in Restake list';
    }, [currentSourceRestake, sourceRestake]);

    const destinationHint = useMemo(() => {
        if (currentDestinationRestake && destinationRestake) return 'already in Restake list';
        if (currentDestinationRestake && destinationRestake === false) return 'will be removed from Restake list';
        if (currentDestinationRestake === false && destinationRestake) return 'will be added to Restake list';
        return 'not in Restake list';
    }, [currentDestinationRestake, destinationRestake]);

    const amountText = useMemo(() => convertAmount({ value: amount, isUfct: false, point: 6 }), [amount]);

    const renderTopRow = (label: string, value: string) => {
        return (
            <View style={styles.topInfoRow}>
                <Text style={styles.topInfoLabel}>{label}</Text>
                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.topInfoValue}>
                    {value}
                </Text>
            </View>
        );
    };

    const renderInfoRow = (label: string, value: string, valueColor = TextColor) => {
        return (
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoValue, { color: valueColor }]} numberOfLines={1} ellipsizeMode="tail">
                    {value}
                </Text>
            </View>
        );
    };

    const renderCheckbox = (checked: boolean, disabled: boolean) => {
        return (
            <View style={[styles.checkbox, checked && styles.checkboxActive, disabled && styles.checkboxDisabled]}>
                {checked && <CheckLine color={TextColor} />}
            </View>
        );
    };

    const renderValidator = (
        startAdornment: ReactNode,
        validator: Pick<IValidatorState, 'validatorAvatar' | 'validatorMoniker'> | undefined,
        fallbackLabel: string,
        endAdornment: ReactNode
    ) => {
        return (
            <View style={styles.validatorIdentity}>
                <ValidatorProfile uri={validator?.validatorAvatar ?? ''} size={40} />
                <View style={styles.validatorTextBox}>
                    {startAdornment}
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.validatorName}>
                        {validator?.validatorMoniker ?? fallbackLabel}
                    </Text>
                    {endAdornment}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.topInfoBox}>
                {renderTopRow(RESTAKE_VALIDATOR_TYPE.SOURCE, sourceDelegation?.moniker ?? sourceAddress)}
                {renderTopRow(RESTAKE_VALIDATOR_TYPE.DESTINATION, destinationValidator?.validatorMoniker ?? destinationAddress)}
            </View>

            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Update Restake Options</Text>
                <TouchableOpacity onPress={() => setShowInfo((prev) => !prev)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <QuestionCircle size={16} color={TextGrayColor} />
                </TouchableOpacity>
            </View>
            {showInfo && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{REDELEGATE_RESTAKE_TOOLTIP}</Text>
                </View>
            )}

            <View style={styles.validatorCard}>
                <TouchableOpacity style={styles.validatorHeader} onPress={() => setSourceRestake(!sourceRestake)}>
                    {renderCheckbox(sourceRestake, false)}
                    {renderValidator(
                        <Text style={[styles.roleLabel, { color: NoColor }]}>Source</Text>,
                        sourceDelegation
                            ? {
                                  validatorAvatar: sourceDelegation.avatarURL,
                                  validatorMoniker: sourceDelegation.moniker
                              }
                            : undefined,
                        sourceAddress,
                        <Text style={styles.hintText}>{sourceHint}</Text>
                    )}
                </TouchableOpacity>
                {renderInfoRow('Redelegate amount', `-${amountText} ${_CHAIN_SYMBOL}`, NoColor)}
                {renderInfoRow(
                    'Remaining balance',
                    `${convertAmount({ value: sourceRemainingAmount, isUfct: false, point: 6 })} ${_CHAIN_SYMBOL}`
                )}
            </View>

            <View style={styles.validatorCard}>
                <TouchableOpacity style={styles.validatorHeader} onPress={() => setDestinationRestake(!destinationRestake)}>
                    {renderCheckbox(destinationRestake, false)}
                    {renderValidator(
                        <Text style={[styles.roleLabel, { color: YesColor }]}>Destination</Text>,
                        destinationValidator,
                        destinationAddress,
                        <Text style={styles.hintText}>{destinationHint}</Text>
                    )}
                </TouchableOpacity>
                {renderInfoRow('Amount to receive', `+${amountText} ${_CHAIN_SYMBOL}`, YesColor)}
                {renderInfoRow(
                    'Total delegation\nafter redelegation',
                    `${convertAmount({ value: destinationTotalAmount, isUfct: false, point: 6 })} ${_CHAIN_SYMBOL}`
                )}
            </View>

            <View style={{ gap: 12 }}>
                {REDELEGATE_RESTAKE_WARN.map((text, idx) => (
                    <WarnContainer paddingVertical={12} paddingHorizontal={12} text={text} key={idx} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    topInfoBox: {
        marginBottom: 30,
        padding: 14,
        borderRadius: 4,
        backgroundColor: BoxColor,
        gap: 10
    },
    topInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
    },
    topInfoLabel: {
        fontFamily: Lato,
        fontSize: 13,
        color: TextGrayColor
    },
    topInfoValue: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: WhiteColor,
        fontWeight: '600',
        textAlign: 'right'
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10
    },
    sectionTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        fontWeight: '600'
    },
    infoBox: {
        padding: 12,
        borderRadius: 4,
        backgroundColor: BoxColor,
        marginBottom: 12
    },
    infoText: {
        fontFamily: Lato,
        fontSize: 13,
        lineHeight: 18,
        color: TextGrayColor
    },
    validatorCard: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 4,
        backgroundColor: BoxColor,
        marginBottom: 12
    },
    validatorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: TextGrayColor,
        backgroundColor: WhiteColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkboxActive: {
        borderColor: PointColor,
        backgroundColor: PointColor
    },
    checkboxDisabled: {
        opacity: 0.45
    },
    validatorIdentity: {
        flex: 1,
        minWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    validatorTextBox: {
        flex: 1,
        minWidth: 0
    },
    validatorName: {
        fontFamily: Lato,
        fontSize: 15,
        color: TextColor,
        fontWeight: '700'
    },
    roleLabel: {
        fontFamily: Lato,
        fontSize: 13,
        fontWeight: '700'
    },
    hintText: {
        fontFamily: Lato,
        fontSize: 13,
        color: TextGrayColor,
        fontStyle: 'italic'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 3,
        gap: 12
    },
    infoLabel: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 13,
        color: TextGrayColor
    },
    infoValue: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'right'
    }
});

export default RedelegateRestakeStepBox;
