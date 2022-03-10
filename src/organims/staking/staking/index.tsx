import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { useStakingData, useValidatorData } from "@/hooks/staking/hooks";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { BgColor } from "@/constants/theme";
import { wait } from "@/util/common";
import { FIRMACHAIN_DEFAULT_CONFIG, TRANSACTION_TYPE } from "@/constants/common";
import { getEstimateGasFromAllDelegations } from "@/util/firma";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import RewardBox from "./rewardBox";
import BalanceBox from "./balanceBox";
import AlertModal from "@/components/modal/alertModal";
import StakingLists from "./stakingLists";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

const Staking = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const { wallet, staking } = useAppSelector(state => state);
    const isFocused = useIsFocused();

    const { validators, handleValidatorsPolling } = useValidatorData();
    const { stakingState, getStakingState, updateStakingState } = useStakingData();
    const { recentHistory, currentHistoryPolling, refetchCurrentHistory } = useHistoryData();

    const [isRefresh, setIsRefresh] = useState(false);
    const [withdrawAllGas, setWithdrawAllGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const validatorList = useMemo(() => {
        return validators;
    }, [validators]);

    const currentHistoryRefetch = async() => {
        if(refetchCurrentHistory)
            await refetchCurrentHistory();
    }

    const handleCurrentHistoryPolling = (polling:boolean) => {
        if(currentHistoryPolling) {
            currentHistoryRefetch();
            currentHistoryPolling(polling);
        }
    }

    const refreshStates = async() => {
        setIsRefresh(true);
        CommonActions.handleLoadingProgress(true);
        if(validatorList.length > 0){
            await handleValidatorsPolling();
        }
        await getStakingState();
        wait(1500).then(() => {
            CommonActions.handleLoadingProgress(false);
        });
        setIsRefresh(false);
    }

    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
    }

    const handleWithdrawAll = (password:string) => {
        if(alertDescription !== '') return handleModalOpen(true);
        const transactionState = {
            type: TRANSACTION_TYPE["WITHDRAW ALL"],
            password: password,
            address : wallet.address,
            gas: withdrawAllGas,
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const moveToValidator = (address:string) => {
        navigation.navigate(Screens.Validator, {
            validatorAddress: address,
        });
    }

    useEffect(() => {
        if(stakingState.stakingReward > 0) {
            updateStakingState(stakingState.stakingReward);
        }
    }, [stakingState.stakingReward])

    useEffect(() => {
        const getGasFromAllDelegations = async() => {
            if(stakingState.stakingReward > 0 && stakingState.available > FIRMACHAIN_DEFAULT_CONFIG.defaultFee){
                await getEstimateGasFromAllDelegations(wallet.name).then(value => {
                    setWithdrawAllGas(value);
                    setAlertDescription('');
                })
                .catch(error => {
                    console.log(error);
                    setAlertDescription(String(error));
                });
            }
        }

        if(isFocused)
            getGasFromAllDelegations();
    }, [stakingState, validators]);

    useEffect(() => {
        if(recentHistory !== undefined){
            refreshStates();
        }
    },[recentHistory])

    useFocusEffect(
        useCallback(() => {
            handleCurrentHistoryPolling(true);
            return () => {
                handleCurrentHistoryPolling(false);
            }
        }, [])
    )

    return (
        <View style={styles.container}>
            <RefreshScrollView
                refreshFunc={refreshStates}>
                <>
                <View style={styles.box}>
                    <RewardBox gas={withdrawAllGas} reward={staking.stakingReward} transactionHandler={handleWithdrawAll}/>
                    <BalanceBox stakingValues={stakingState}/>
                </View>
                <StakingLists isRefresh={isRefresh} validators={validatorList} navigateValidator={moveToValidator} />
                <AlertModal
                    visible={isAlertModalOpen}
                    handleOpen={handleModalOpen}
                    title={"Failed"}
                    desc={alertDescription}
                    confirmTitle={"OK"}
                    type={"ERROR"}/>
                </>
            </RefreshScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
        paddingTop: 32,
    },
    box: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 4,
    },
})

export default Staking;