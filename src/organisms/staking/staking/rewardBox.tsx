import React, { useEffect, useState } from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import {
    ButtonPointLightColor,
    DiableButtonPointcolor,
    Lato,
    PointColor,
    TextColor,
    TextLightGrayColor,
    TextPointDisableColor,
    TextStakingReward
} from '@/constants/theme';
import { Screens } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { convertAmount, resizeFontSize } from '@/util/common';
import { getEstimateGasFromAllDelegations, getFeesFromGas, getFirmaConfig } from '@/util/firma';
import { StyleSheet, Text, View } from 'react-native';

import SmallButton from '@/components/button/smallButton';
import AlertModal from '@/components/modal/alertModal';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';

interface IProps {
    walletName: string;
    reward: any;
    transactionHandler: (password: string, gas: number) => void;
}

const RewardBox = ({ walletName, reward, transactionHandler }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [openModal, setOpenModal] = useState(false);
    const [rewardTextSize, setRewardTextSize] = useState(28);

    const [stakingReward, setStakingReward] = useState('0.0');
    const [withdrawAllGas, setWithdrawAllGas] = useState(getFirmaConfig().defaultGas);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const handleTransaction = (password: string) => {
        if (alertDescription !== '') return handleModalOpen(true);
        transactionHandler(password, withdrawAllGas);
    };

    const handleModalOpen = (open: boolean) => {
        setIsAlertModalOpen(open);
    };

    const handleWithdraw = async (open: boolean) => {
        try {
            if (open) {
                await getGasFromAllDelegations();
            }
            setOpenModal(open);
        } catch (error) {
            console.log(error);
        }
    };

    const getGasFromAllDelegations = async () => {
        const loadingRequestId = CommonActions.beginLoadingProgress();
        try {
            const result = await getEstimateGasFromAllDelegations(walletName);
            setWithdrawAllGas(result);
            setAlertDescription('');
        } catch (error) {
            console.log(error);
            CommonActions.endLoadingProgress(loadingRequestId);
            setAlertDescription(String(error));
            handleModalOpen(true);
            throw error;
        }
        CommonActions.endLoadingProgress(loadingRequestId);
    };

    useEffect(() => {
        setRewardTextSize(resizeFontSize(reward, 10000, 28));
        setStakingReward(convertAmount({ value: reward, isUfct: false }));
    }, [reward]);

    //? Temp: set current route to modal for bottom view bg
    // Todo: remove this after find solution for bottom view bg
    useEffect(() => {
        if (openModal) {
            CommonActions.handleCurrentRoute('modal');
        } else {
            CommonActions.handleCurrentRoute(Screens.Staking);
        }
    }, [openModal]);

    return (
        <View style={styles.rewardBox}>
            <View style={styles.boxV}>
                <Text style={[styles.title, { color: TextStakingReward, marginBottom: 6 }]}>Staking Reward</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                    <Text style={[styles.desc, { fontSize: rewardTextSize }]}>
                        {stakingReward}
                        <Text style={[styles.title, { fontSize: 14, fontWeight: 'normal' }]}>{` ${_CHAIN_SYMBOL}`}</Text>
                    </Text>
                </View>
            </View>
            <SmallButton
                title={'Withdraw All'}
                size={125}
                active={reward > 0}
                color={ButtonPointLightColor}
                disableColor={DiableButtonPointcolor}
                disableTextColor={TextPointDisableColor}
                onPressEvent={() => handleWithdraw(true)}
            />
            <TransactionConfirmModal
                transactionHandler={handleTransaction}
                title={'Withdraw All'}
                amount={reward}
                fee={getFeesFromGas(withdrawAllGas)}
                open={openModal}
                setOpenModal={handleWithdraw}
            />
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
        </View>
    );
};

const styles = StyleSheet.create({
    rewardBox: {
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 22,
        marginBottom: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: PointColor
    },
    boxV: {},
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: '600',
        color: TextLightGrayColor
    },
    desc: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: '600',
        color: TextColor
    }
});

export default RewardBox;
