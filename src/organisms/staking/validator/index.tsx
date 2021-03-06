import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions, StakingActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { IStakingState, useDelegationData, useValidatorDataFromAddress } from "@/hooks/staking/hooks";
import { getStakingFromvalidator } from "@/util/firma";
import { BgColor, BoxColor, FailedColor, Lato } from "@/constants/theme";
import { IKeyValue, TRANSACTION_TYPE, TYPE_COLORS } from "@/constants/common";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import DescriptionBox from "./descriptionBox";
import DelegationBox from "./delegationBox";
import PercentageBox from "./percentageBox";
import AddressBox from "./addressBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Validator>;

interface IProps {
    validatorAddress: string;
}

const Validator = ({validatorAddress}:IProps) => {
    const navigation:ScreenNavgationProps = useNavigation();

    const {wallet, common} = useAppSelector(state => state);
    const {validatorState, handleValidatorPolling} = useValidatorDataFromAddress(validatorAddress);
    const {delegationState, handleTotalDelegationPolling} = useDelegationData();

    const [stakingState, setStakingState] = useState<IStakingState>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    const delegationLength = useMemo(() => {
        return delegationState.length;
    }, [delegationState])
    
    const AlertText = useMemo(() => {
        if(validatorState){
            if(validatorState.tombstoned === true) return "TOMBSTONED";
            if(validatorState.status === 0) return "UNKNOWN";
            if(validatorState.status === 1) return "UNBONDED";
            if(validatorState.status === 2 && validatorState.jailed === false) return "UNBONDING";
            if(validatorState.status === 2 && validatorState.jailed === true) return "JAILED";
        }
        return "";
    }, [validatorState])

    const AlertColor = useMemo(() => {
        switch (AlertText) {
            case "UNKNOWN":
            case "UNBONDED":
                return TYPE_COLORS["zero"];
            case "UNBONDING":
                return TYPE_COLORS["three"];
            case "JAILED":
                return TYPE_COLORS["two"];
            case "TOMBSTONED":
                return FailedColor;
        }
    }, [AlertText])

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
        let delegateState:IKeyValue = {
            type: type,
            operatorAddress: validatorAddress,
        }

        navigation.navigate(Screens.Delegate, {state: delegateState});
    }

    const handleDelegateState = async() => {
        try {
            const state = await getStakingFromvalidator(wallet.address, validatorAddress);
    
            setStakingState({
                available: state.available,
                delegated: state.delegated,
                undelegate: state.undelegate,
                stakingReward: state.stakingReward,
            });
        } catch (error) {
            throw error;
        }
    }

    const refreshStates = async() => {
        try {
            CommonActions.handleLoadingProgress(true);
            await handleDelegateState();
            await handleValidatorPolling();
            await handleTotalDelegationPolling();
            CommonActions.handleLoadingProgress(false);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    }

    useEffect(() => {
        let count = 0;
        let intervalId = setInterval(() => {
            if(common.dataLoadStatus > 0 && common.dataLoadStatus < 2){
                count = count + 1;
            } else {
                clearInterval(intervalId);
            }
            if(count >= 6){
                count = 0;
                refreshStates();
            }
        }, 1000)

        return () => clearInterval(intervalId);
    }, [common.dataLoadStatus])

    const handleMoveToWeb = (uri:string) => {
        navigation.navigate(Screens.WebScreen, {uri: uri});
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
        if(stakingState){
            if(stakingState.stakingReward > 0){
                StakingActions.updateDelegateState({
                    address: validatorAddress,
                    reward: stakingState.stakingReward * 1000000,
                });
            }
        }
    }, [stakingState]);

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
                                    <View style={styles.jailedBox}>
                                        <Text 
                                            style={[styles.jailedText, 
                                            {display: AlertText !== ""? "flex":"none", backgroundColor: AlertColor}]}>
                                                {AlertText}
                                        </Text>
                                    </View>
                                    <DescriptionBox validator={validatorState.description} />
                                    <DelegationBox 
                                        walletName={wallet.name}
                                        validatorAddress={validatorAddress}
                                        stakingState={stakingState} 
                                        delegations={delegationLength}
                                        handleDelegate={moveToDelegate} 
                                        transactionHandler={handleWithdraw}/>
                                    <View style={styles.infoBox}>
                                        <PercentageBox data={validatorState.percentageData} />
                                        <AddressBox 
                                            title={"Operator address"} 
                                            path={"validators"} 
                                            address={validatorState.address.operatorAddress} 
                                            handleExplorer={handleMoveToWeb}/>
                                        <AddressBox 
                                            title={"Account address"} 
                                            path={"accounts"} 
                                            address={validatorState.address.accountAddress} 
                                            handleExplorer={handleMoveToWeb}/>
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
    jailedBox: {
        paddingHorizontal: 20,
        marginTop: -10,
        paddingTop: 10,
        backgroundColor: BoxColor,
        alignItems: "center",
        justifyContent: "center",
    },
    jailedText: {
        borderRadius: 8,
        overflow: "hidden",
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontFamily: Lato,
        fontSize: 16,
        textAlign: "center",
        color: BoxColor,
    }
});

export default Validator;