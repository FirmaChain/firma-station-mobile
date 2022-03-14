import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions, StakingActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { StakingState, useDelegationData, useValidatorDataFromAddress } from "@/hooks/staking/hooks";
import { getEstimateGasFromDelegation, getStakingFromvalidator } from "@/util/firma";
import { BgColor, BoxColor } from "@/constants/theme";
import { KeyValue, TRANSACTION_TYPE } from "@/constants/common";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import AlertModal from "@/components/modal/alertModal";
import { FIRMACHAIN_DEFAULT_CONFIG } from "@/../config";
import DescriptionBox from "./descriptionBox";
import DelegationBox from "./delegationBox";
import PercentageBox from "./percentageBox";
import AddressBox from "./addressBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Validator>;

interface Props {
    validatorAddress: string;
}

const Validator = ({validatorAddress}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation();

    const {wallet} = useAppSelector(state => state);
    const {validatorState, handleValidatorPolling} = useValidatorDataFromAddress(validatorAddress);
    const {delegationState, handleTotalDelegationPolling} = useDelegationData();

    const [stakingState, setStakingState] = useState<StakingState>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    const [withdrawGas, setWithdrawGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
    }

    const handleWithdraw = (password:string) => {
        if(alertDescription !== '') return handleModalOpen(true);

        const transactionState = {
            type: TRANSACTION_TYPE["WITHDRAW"],
            password: password,
            operatorAddress : validatorAddress,
            gas: withdrawGas,
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const moveToDelegate = (type:string) => {
        let delegateState:KeyValue = {
            type: type,
            operatorAddress: validatorAddress,
            // delegations: delegationState,
        }

        navigation.navigate(Screens.Delegate, {state: delegateState});
    }

    const handleDelegateState = async() => {
        const state = await getStakingFromvalidator(wallet.address, validatorAddress);

        setStakingState({
            available: state.available,
            delegated: state.delegated,
            undelegate: state.undelegate,
            stakingReward: state.stakingReward,
        });

        if(state.stakingReward > 0 && state.available > FIRMACHAIN_DEFAULT_CONFIG.defaultFee){
            try {
                let gas = await getEstimateGasFromDelegation(wallet.name, validatorAddress);
                setWithdrawGas(gas);
            } catch (error) {
                console.log(error);
                setAlertDescription(String(error));
            }
        }
    }

    const refreshStates = async() => {
        CommonActions.handleLoadingProgress(true);
        await handleDelegateState();
        await handleValidatorPolling();
        await handleTotalDelegationPolling();
        CommonActions.handleLoadingProgress(false);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        if(validatorState){
            StakingActions.updateValidatorState(validatorState);
        }
    }, [validatorState]);

    useEffect(() => {
        if(stakingState.stakingReward > 0){
            StakingActions.updateDelegateState({
                address: validatorAddress,
                reward: stakingState.stakingReward * 1000000,
            });
        }
    }, [stakingState.stakingReward]);

    useFocusEffect(
        useCallback(() => {
            refreshStates();
        },[])
    )

    return (
        <Container
            titleOn={false}
            bgColor={BoxColor}
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <RefreshScrollView
                        refreshFunc={refreshStates}
                        background={BoxColor}>
                            <View style={{backgroundColor: BoxColor}}>
                                {validatorState &&
                                <>
                                    <DescriptionBox validator={validatorState.description} />
                                    <DelegationBox stakingState={stakingState} delegations={delegationState.length} gas={withdrawGas} handleDelegate={moveToDelegate} transactionHandler={handleWithdraw}/>
                                    <View style={styles.infoBox}>
                                        <PercentageBox data={validatorState.percentageData} />
                                        <AddressBox title={"Operator address"} path={"validators"} address={validatorState.address.operatorAddress} />
                                        <AddressBox title={"Account address"} path={"accounts"} address={validatorState.address.accountAddress} />
                                    </View>
                                </>
                                }

                                <AlertModal
                                    visible={isAlertModalOpen}
                                    handleOpen={handleModalOpen}
                                    title={"Failed"}
                                    desc={alertDescription}
                                    confirmTitle={"OK"}
                                    type={"ERROR"}/>
                            </View>
                    </RefreshScrollView>
                </ViewContainer>
        </Container>
    )
}


const styles = StyleSheet.create({
    infoBox: {
        backgroundColor: BgColor,
        paddingTop: 30,
    },
});

export default Validator;