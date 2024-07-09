import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CommonActions } from '@/redux/actions';
import {
    ButtonPointLightColor,
    DiableButtonPointcolor,
    DisableColor,
    Lato,
    PointColor,
    TextColor,
    TextLightGrayColor,
    TextPointDisableColor,
    TextStakingReward
} from '@/constants/theme';
import { convertAmount, convertNumber, resizeFontSize } from '@/util/common';
import { getEstimateGasFromAllDelegations, getFeesFromGas } from '@/util/firma';
import { FIRMACHAIN_DEFAULT_CONFIG } from '@/../config';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import SmallButton from '@/components/button/smallButton';
import AlertModal from '@/components/modal/alertModal';
import { CHAIN_SYMBOL } from '@/constants/common';
// import AnimatedNumber from "react-native-animated-number";

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
    const [withdrawAllGas, setWithdrawAllGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const handleTransaction = (password: string) => {
        if (alertDescription !== '') return handleModalOpen(true);
        transactionHandler(password, withdrawAllGas);
    };

    const rewardInteger = useMemo(() => {
        return convertNumber(stakingReward.split('.')[0]);
    }, [stakingReward]);

    const rewardDecimal = useMemo(() => {
        if (stakingReward.split('.').length > 1) {
            return convertNumber(stakingReward.split('.')[1]);
        }
        return 0;
    }, [stakingReward]);

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
        CommonActions.handleLoadingProgress(true);
        try {
            const result = await getEstimateGasFromAllDelegations(walletName);
            setWithdrawAllGas(result);
            setAlertDescription('');
        } catch (error) {
            console.log(error);
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            handleModalOpen(true);
            throw error;
        }
        CommonActions.handleLoadingProgress(false);
    };

    useEffect(() => {
        setRewardTextSize(resizeFontSize(reward, 10000, 28));
        setStakingReward(convertAmount({ value: reward, isUfct: false }));
    }, [reward]);

    return (
        <View style={styles.rewardBox}>
            <View style={styles.boxV}>
                <Text style={[styles.title, { color: TextStakingReward, marginBottom: 6 }]}>Staking Reward</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                    <Text style={[styles.desc, { fontSize: rewardTextSize }]}>
                        {stakingReward}
                        <Text style={[styles.title, { fontSize: 14, fontWeight: 'normal' }]}>{` ${_CHAIN_SYMBOL}`}</Text>
                    </Text>
                    {/* <AnimatedNumber 
                        style={[styles.desc, {fontSize: rewardTextSize, width: "auto", padding: 0}, Platform.OS === "android" && {height: rewardTextSize, textAlign: "right"}]} 
                        steps={rewardInteger>0?35:0} 
                        value={rewardInteger} 
                        formatter={(value) => {
                        return convertAmount(value, false, 0);
                    }}/>
                    <Text style={[styles.desc, {fontSize: rewardTextSize, width: "auto"}]}>.</Text>
                    <AnimatedNumber 
                        style={[styles.desc, {fontSize: rewardTextSize, width: "auto", padding: 0}, Platform.OS === "android" && {height: rewardTextSize, textAlign: "left"}]} 
                        steps={rewardDecimal>0?35:0}
                        value={rewardDecimal}/>
                    <Text style={[styles.title, {fontSize: 14, fontWeight: "normal", paddingBottom: 3}]}> FCT</Text> */}
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
    divider: {
        width: '100%',
        height: 1,
        marginBottom: 20,
        backgroundColor: DisableColor
    },
    boxV: {},
    boxH: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
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
