import React, { useMemo, useState } from 'react';
import CheckLine from '@/assets/icons/material/checkLine.svg';
import { CHAIN_SYMBOL } from '@/constants/common';
import { BoxColor, Lato, PointColor, TextCatTitleColor, TextColor, TextGrayColor, WhiteColor } from '@/constants/theme';
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

const SOURCE_COLOR = '#ff8a8a';
const DESTINATION_COLOR = '#2BA891';
const OPTION_CARD_COLOR = '#3d3b48';
const SECONDARY_BUTTON_COLOR = '#383745';
const WARNING_BOX_COLOR = '#ffc54216';
const INFO_TEXT =
    'Check an option to update your Restake validator list along with this redelegation. A single transaction with two messages (Redelegation + Restake update) will be broadcast.';

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

    const renderCheckbox = (checked: boolean, disabled: boolean, onPress: () => void) => {
        return (
            <TouchableOpacity
                disabled={disabled}
                onPress={onPress}
                style={[styles.checkbox, checked && styles.checkboxActive, disabled && styles.checkboxDisabled]}
            >
                {checked && <CheckLine color={TextColor} />}
            </TouchableOpacity>
        );
    };

    const renderValidator = (
        validator: Pick<IValidatorState, 'validatorAvatar' | 'validatorMoniker'> | undefined,
        fallbackLabel: string
    ) => {
        return (
            <View style={styles.validatorIdentity}>
                <ValidatorProfile uri={validator?.validatorAvatar ?? ''} size={40} />
                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.validatorName}>
                    {validator?.validatorMoniker ?? fallbackLabel}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.topInfoBox}>
                {renderTopRow('Source Validator', sourceDelegation?.moniker ?? sourceAddress)}
                {renderTopRow('Destination Validator', destinationValidator?.validatorMoniker ?? destinationAddress)}
            </View>

            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Update Restake Options</Text>
                <TouchableOpacity onPress={() => setShowInfo((prev) => !prev)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <QuestionCircle size={16} color={TextGrayColor} />
                </TouchableOpacity>
            </View>
            {showInfo && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{INFO_TEXT}</Text>
                </View>
            )}

            <View style={styles.validatorCard}>
                <View style={styles.validatorHeader}>
                    {renderCheckbox(currentSourceRestake && sourceRestake, currentSourceRestake === false, () =>
                        setSourceRestake(!sourceRestake)
                    )}
                    {renderValidator(
                        sourceDelegation
                            ? {
                                  validatorAvatar: sourceDelegation.avatarURL,
                                  validatorMoniker: sourceDelegation.moniker
                              }
                            : undefined,
                        sourceAddress
                    )}
                </View>

                <Text style={styles.hintText}>
                    <Text style={[styles.roleLabel, { color: SOURCE_COLOR }]}>Source</Text> {sourceHint}
                </Text>

                {renderInfoRow('Redelegate amount', `-${amountText} ${_CHAIN_SYMBOL}`, SOURCE_COLOR)}
                {renderInfoRow(
                    'Remaining balance',
                    `${convertAmount({ value: sourceRemainingAmount, isUfct: false, point: 6 })} ${_CHAIN_SYMBOL}`
                )}
            </View>

            <View style={styles.validatorCard}>
                <View style={styles.validatorHeader}>
                    {renderCheckbox(destinationRestake, false, () => setDestinationRestake(!destinationRestake))}
                    {renderValidator(destinationValidator, destinationAddress)}
                </View>

                <Text style={styles.hintText}>
                    <Text style={[styles.roleLabel, { color: DESTINATION_COLOR }]}>Destination</Text> {destinationHint}
                </Text>

                {renderInfoRow('Amount to receive', `+${amountText} ${_CHAIN_SYMBOL}`, DESTINATION_COLOR)}
                {renderInfoRow(
                    'Total delegation after redelegation',
                    `${convertAmount({ value: destinationTotalAmount, isUfct: false, point: 6 })} ${_CHAIN_SYMBOL}`
                )}
            </View>

            <View style={styles.warningBox}>
                <WarnContainer
                    bgColor={WARNING_BOX_COLOR}
                    paddingVertical={12}
                    paddingHorizontal={12}
                    text="A single transaction with two messages (Redelegation + Restake update) will be broadcast."
                />
            </View>
            <View style={styles.warningBox}>
                <WarnContainer
                    bgColor={WARNING_BOX_COLOR}
                    paddingVertical={12}
                    paddingHorizontal={12}
                    text="If no changes are made, clicking 'Skip' will only broadcast the redelegation."
                />
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
        backgroundColor: SECONDARY_BUTTON_COLOR,
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
        backgroundColor: OPTION_CARD_COLOR,
        marginBottom: 12,
        gap: 10
    },
    validatorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
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
    validatorName: {
        flex: 1,
        minWidth: 0,
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
        alignItems: 'center',
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
    },
    warningBox: {
        marginBottom: 8
    }
});

export default RedelegateRestakeStepBox;
