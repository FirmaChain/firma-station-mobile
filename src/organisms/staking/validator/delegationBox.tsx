import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { degree, LayoutAnim, easeInAndOutCustomAnim, TurnToOpposite, TurnToOriginal } from '@/util/animation';
import { getEstimateGasFromDelegation, getFeesFromGas, getFirmaConfig } from '@/util/firma';
import { convertAmount, convertNumber, resizeFontSize } from '@/util/common';
import { ARROW_ACCORDION } from '@/constants/images';
import { BgColor, BoxColor, DividerColor, Lato, TextColor, TextDisableColor } from '@/constants/theme';
import { IStakingState } from '@/hooks/staking/hooks';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import SmallButton from '@/components/button/smallButton';
import AlertModal from '@/components/modal/alertModal';
import { CHAIN_SYMBOL } from '@/constants/common';
import { CommonActions } from '@/redux/actions';

interface IProps {
    walletName: string;
    validatorAddress: string;
    stakingState: IStakingState | null;
    delegations: number;
    handleDelegate: Function;
    transactionHandler: (password: string, gas: number) => void;
}

const DelegationBox = ({ walletName, validatorAddress, stakingState, delegations, handleDelegate, transactionHandler }: IProps) => {
    const arrowDeg = useRef(new Animated.Value(0)).current;
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [openModal, setOpenModal] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);
    const [accordionHeight, setAccordionHeight] = useState(0);

    const [withdrawGas, setWithdrawGas] = useState(getFirmaConfig().defaultGas);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const [availableButtonActive, setAvailableButtonActive] = useState(false);
    const [rewardButtonActive, setRewardButtonActive] = useState(false);
    const [redelegateButtonActive, setRedelegateButtonActive] = useState(false);
    const [undelegateButtonActive, setUndelegateButtonActive] = useState(false);

    const StakingStateExist = useMemo(() => {
        return stakingState !== null;
    }, [stakingState]);

    const Available = useMemo(() => {
        if (stakingState === null) return 0;
        return convertAmount({ value: stakingState.available, isUfct: false });
    }, [stakingState]);

    const Delegate = useMemo(() => {
        if (stakingState === null) return 0;
        return convertAmount({ value: stakingState.delegated, isUfct: false });
    }, [stakingState]);

    const Reward = useMemo(() => {
        if (stakingState === null) return 0;
        return stakingState.stakingReward;
    }, [stakingState]);

    const onPressEvent = (type: string) => {
        handleDelegate(type);
    };

    const handleWithdraw = async (open: boolean) => {
        try {
            if (open) {
                await getGasFromDelegation();
            }
            setOpenModal(open);
        } catch (error) {
            console.log(error);
        }
    };

    const getGasFromDelegation = async () => {
        try {
            CommonActions.handleLoadingProgress(true);
            let gas = await getEstimateGasFromDelegation(walletName, validatorAddress);
            CommonActions.handleLoadingProgress(false);
            setWithdrawGas(gas);
            setAlertDescription('');
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            handleModalOpen(true);
            throw error;
        }
    };

    const handleTransaction = (password: string) => {
        if (alertDescription !== '') return handleModalOpen(true);
        transactionHandler(password, withdrawGas);
    };

    const handleModalOpen = (open: boolean) => {
        setIsAlertModalOpen(open);
    };

    const handleOpenAccordion = () => {
        setOpenAccordion(!openAccordion);
    };

    useEffect(() => {
        LayoutAnim();
        easeInAndOutCustomAnim(150);
        if (openAccordion) {
            setAccordionHeight(65);
            TurnToOpposite(Animated, arrowDeg);
        } else {
            setAccordionHeight(0);
            TurnToOriginal(Animated, arrowDeg);
        }
    }, [openAccordion]);

    useEffect(() => {
        if (stakingState) {
            setAvailableButtonActive(stakingState.available > 0);
            setRewardButtonActive(stakingState.stakingReward > 0);
            setRedelegateButtonActive(delegations > 0);
            setUndelegateButtonActive(stakingState.delegated > 0);
        }
    }, [stakingState, delegations]);

    return (
        <View style={styles.container}>
            <View style={[styles.delegationBox, { paddingBottom: 24 }]}>
                <View style={styles.boxH}>
                    <View style={styles.boxV}>
                        <Text style={styles.title}>Available</Text>
                        <Text
                            style={[
                                styles.balance,
                                {
                                    fontSize: resizeFontSize(convertNumber(Available), 100000, 20),
                                    color: StakingStateExist ? TextColor : TextDisableColor
                                }
                            ]}
                        >
                            {Available}
                            <Text style={[styles.title, { fontSize: 14, fontWeight: 'normal' }]}>{` ${_CHAIN_SYMBOL}`}</Text>
                        </Text>
                    </View>
                    <SmallButton
                        title={'Delegate'}
                        size={122}
                        active={availableButtonActive}
                        onPressEvent={() => onPressEvent('Delegate')}
                    />
                </View>
                <View style={styles.divider} />
                <View style={styles.boxH}>
                    <View style={styles.boxV}>
                        <Text style={styles.title}>Staking Reward</Text>
                        <Text
                            style={[
                                styles.balance,
                                {
                                    fontSize: resizeFontSize(convertNumber(convertAmount({ value: Reward, isUfct: false })), 100000, 20),
                                    color: StakingStateExist ? TextColor : TextDisableColor
                                }
                            ]}
                        >
                            {convertAmount({ value: Reward, isUfct: false })}
                            <Text style={[styles.title, { fontSize: 14, fontWeight: 'normal' }]}>{` ${_CHAIN_SYMBOL}`}</Text>
                        </Text>
                    </View>
                    <SmallButton title={'Withdraw'} size={122} active={rewardButtonActive} onPressEvent={() => handleWithdraw(true)} />
                </View>
            </View>
            <View style={[styles.delegationBox, { marginTop: 12, paddingTop: 22, paddingBottom: 12 }]}>
                <View style={styles.boxH}>
                    <Text style={styles.title}>My Delegations</Text>
                    <Text
                        style={[
                            styles.balance,
                            {
                                fontSize: resizeFontSize(convertNumber(Delegate), 100000, 20),
                                color: StakingStateExist ? TextColor : TextDisableColor
                            }
                        ]}
                    >
                        {Delegate}
                        <Text style={[styles.title, { fontSize: 14, fontWeight: 'normal' }]}>{` ${_CHAIN_SYMBOL}`}</Text>
                    </Text>
                </View>
                <View style={{ width: '100%', height: accordionHeight }}>
                    <View style={[styles.boxH, { justifyContent: 'center', paddingTop: 22 }]}>
                        <SmallButton
                            title={'Redelegate'}
                            size={142}
                            height={accordionHeight}
                            active={redelegateButtonActive}
                            onPressEvent={() => onPressEvent('Redelegate')}
                        />
                        <View style={{ width: 15 }} />
                        <SmallButton
                            title={'Undelegate'}
                            size={142}
                            height={accordionHeight}
                            active={undelegateButtonActive}
                            onPressEvent={() => onPressEvent('Undelegate')}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.boxArrow} onPress={() => handleOpenAccordion()}>
                    <Animated.Image style={[styles.icon_arrow, { transform: [{ rotate: degree(arrowDeg) }] }]} source={ARROW_ACCORDION} />
                </TouchableOpacity>
            </View>
            {isAlertModalOpen && (
                <AlertModal
                    visible={isAlertModalOpen}
                    handleOpen={handleModalOpen}
                    title={'Failed'}
                    desc={alertDescription}
                    confirmTitle={'OK'}
                    type={'ERROR'}
                />
            )}
            <TransactionConfirmModal
                transactionHandler={handleTransaction}
                title={'Withdraw'}
                amount={Reward}
                fee={getFeesFromGas(withdrawGas)}
                open={openModal}
                setOpenModal={handleWithdraw}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 24,
        paddingBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: BoxColor
    },
    delegationBox: {
        borderRadius: 8,
        backgroundColor: BgColor,
        paddingHorizontal: 20,
        paddingVertical: 22,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    boxH: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    boxV: {
        alignItems: 'flex-start'
    },
    boxArrow: {
        width: '100%',
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: '600',
        color: TextDisableColor,
        paddingBottom: 6
    },
    balance: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: '600',
        color: TextColor
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: DividerColor,
        marginVertical: 20
    },
    icon_arrow: {
        width: 24,
        height: 24
    }
});

export default DelegationBox;
