import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions, StakingActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { StakingState, useDelegationData, useValidatorDataFromAddress } from "@/hooks/staking/hooks";
import { getStakingFromvalidator } from "@/util/firma";
import { BgColor, BoxColor } from "@/constants/theme";
import { KeyValue, TRANSACTION_TYPE } from "@/constants/common";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import DescriptionBox from "./descriptionBox";
import DelegationBox from "./delegationBox";
import PercentageBox from "./percentageBox";
import AddressBox from "./addressBox";
import { GUIDE_URI } from "@/../config";

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

    const handleWithdraw = (password:string, gas:number) => {
        const transactionState = {
            type: TRANSACTION_TYPE["WITHDRAW"],
            password: password,
            operatorAddress : validatorAddress,
            gas: gas,
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const moveToDelegate = (type:string) => {
        let delegateState:KeyValue = {
            type: type,
            operatorAddress: validatorAddress,
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
    }

    const refreshStates = async() => {
        CommonActions.handleLoadingProgress(true);
        await handleDelegateState();
        await handleValidatorPolling();
        await handleTotalDelegationPolling();
        CommonActions.handleLoadingProgress(false);
    }

    const handleMoveToWeb = () => {
        navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["withdraw"]});
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
                                    <DelegationBox 
                                        walletName={wallet.name}
                                        validatorAddress={validatorAddress}
                                        stakingState={stakingState} 
                                        delegations={delegationState.length}
                                        handleGuide={handleMoveToWeb} 
                                        handleDelegate={moveToDelegate} 
                                        transactionHandler={handleWithdraw}/>
                                    <View style={styles.infoBox}>
                                        <PercentageBox data={validatorState.percentageData} />
                                        <AddressBox title={"Operator address"} path={"validators"} address={validatorState.address.operatorAddress} />
                                        <AddressBox title={"Account address"} path={"accounts"} address={validatorState.address.accountAddress} />
                                    </View>
                                </>
                                }
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