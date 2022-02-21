import React, { useCallback, useContext, useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "@/components/parts/containers/conatainer";
import { BgColor, BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor, WhiteColor } from "@/constants/theme";
import AddressBox from "@/organims/staking/validator/addressBox";
import PercentageBox from "@/organims/staking/validator/percentageBox";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { convertPercentage, convertToFctNumber } from "@/util/common";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import DelegationBox from "@/organims/staking/validator/delegationBox";
import { getEstimateGasFromDelegation, getStakingFromvalidator as getStakingFromValidator } from "@/util/firma";
import { Person } from "@/components/icon/icon";
import { StakeInfo, useDelegationData, useValidatorDataFromAddress } from "@/hooks/staking/hooks";
import { CONTEXT_ACTIONS_TYPE, FIRMACHAIN_DEFAULT_CONFIG, KeyValue, TRANSACTION_TYPE } from "@/constants/common";
import { AppContext } from "@/util/context";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import { useFocusEffect } from "@react-navigation/native";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Validator>;

export type ValidatorParams = {
    validatorAddress: string;
}

interface ValidatorScreenProps {
    route: {params: ValidatorParams};
    navigation: ScreenNavgationProps;
}

const ValidatorScreen: React.FunctionComponent<ValidatorScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {validatorAddress} = params;

    const {wallet, dispatchEvent} = useContext(AppContext);
    const {validatorState, handleValidatorPolling} = useValidatorDataFromAddress(validatorAddress);
    const {delegationState, handleDelegationState} = useDelegationData(wallet.address);

    const [stakingState, setStakingState] = useState<any>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    const [withdrawGas, setWithdrawGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);

    const [validator, setValidator]:Array<any> = useState(null);

    const handleDelegate = (type:string) => {
        let delegateState:KeyValue = {
            type: type,
            operatorAddress: validatorAddress,
            delegations: delegationState,
        }

        navigation.navigate(Screens.Delegate, {state: delegateState});
    }

    const handleWithdraw = (password:string) => {
        const transactionState = {
            type: TRANSACTION_TYPE["WITHDRAW"],
            password: password,
            operatorAddress : validatorAddress,
            gas: withdrawGas,
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const handleUrl = (url:string) => {
        Linking.openURL(url);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    const handleDelegateState = async() => {
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
        const state = await getStakingFromValidator(wallet.address, validatorAddress);

        setStakingState({
            available: state.available,
            delegated: state.delegated,
            undelegate: state.undelegate,
            stakingReward: state.stakingReward,
        });

        if(state.stakingReward > 0){
            try {
                let gas = await getEstimateGasFromDelegation(wallet.name, validatorAddress);
                setWithdrawGas(gas);
            } catch (error) {
                console.log(error);
            }
        }
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
    }

    const refreshStates = () => {
        handleValidatorPolling();
        handleDelegateState();
        handleDelegationState();
    }

    useFocusEffect(
        useCallback(() => {
            refreshStates();
        }, [])
    )

    useEffect(() => {
        if(validatorState !== undefined){
            setValidator({
                avatar: validatorState.validatorAvatar,
                moniker: validatorState.validatorMoniker,
                description: validatorState.validatorDetail,
                website: validatorState.validatorWebsite,

                operatorAddress: validatorState.validatorAddress,
                accountAddress: validatorState.selfDelegateAddress,

                APR: convertPercentage(validatorState.APR),
                APY: convertPercentage(validatorState.APY),
                percentageData: [
                    {row: [{
                        title: "Voting Power",
                        data: validatorState.votingPowerPercent,
                        amount: validatorState.votingPower,
                    },{
                        title: "Self-Delegation",
                        data: validatorState.selfPercent,
                        amount: convertToFctNumber(validatorState.self),
                    }]},
                    {row: [{
                        title: "Commission",
                        data: validatorState.commission,
                    },{
                        title: "Uptime",
                        data: validatorState.condition,
                    }]}
                ]
            })
        }
    }, [validatorState])
    
    return (
        <Container
            titleOn={false}
            bgColor={BoxColor}
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <>
                    {validator && 
                        <RefreshScrollView
                            refreshFunc={refreshStates}
                            background={BoxColor}>
                                <View style={{backgroundColor: BoxColor}}>
                                    <View style={[styles.boxH, {backgroundColor: BoxColor, paddingHorizontal: 20,}]}>
                                        {validator.avatar?
                                        <Image style={styles.avatar} source={{uri: validator.avatar}}/>
                                        :
                                        <View style={styles.avatar}>
                                            <Person size={68} color={WhiteColor}/>
                                        </View>
                                        }
                                        <View style={[styles.boxV, {flex: 1}]}>
                                            <Text style={styles.moniker}>{validator.moniker}</Text>
                                            <Text style={styles.desc}>{validator.description}</Text>
                                            {validator.website &&
                                            <TouchableOpacity onPress={()=>handleUrl(validator.website)}>
                                                <Text style={styles.url}>{validator.website}</Text>
                                            </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                    <DelegationBox stakingState={stakingState} delegations={delegationState.length} gas={withdrawGas} handleDelegate={handleDelegate} transactionHandler={handleWithdraw}/>
                                    <View style={styles.infoBox}>
                                        <PercentageBox APR={validator.APR} APY={validator.APY} dataArr={validator.percentageData} />
                                        <AddressBox title={"Operator address"} path={"validators"} address={validator.operatorAddress} />
                                        <AddressBox title={"Account address"} path={"accounts"} address={validator.accountAddress} />
                                    </View>
                                </View>
                        </RefreshScrollView>
                    }
                    </>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    boxH: {
        flexDirection: "row",
    },
    boxV: {
        alignItems: "flex-start",
    },
    infoBox: {
        backgroundColor: BgColor,
        paddingTop: 30,
    },
    avatar: {
        width: 68,
        height: 68,
        borderRadius: 50,
        overflow: "hidden",
        marginRight: 10,
    },
    moniker: {
        width: "100%",
        fontSize: 24,
        fontFamily: Lato,
        fontWeight: "bold",
        color: TextColor,
        paddingBottom: 8,
    },
    desc: {
        width: "auto",
        color: TextDarkGrayColor,
        fontSize: 16,
        paddingBottom: 12,
    },
    content: {
        width: "100%",
        color: "#1e1e1e",
        fontSize: 14,
        paddingBottom: 5,
    },
    url: {
        width: "100%",
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: DisableColor,
        borderRadius: 4,
        overflow: "hidden",
        color: TextCatTitleColor,
        fontSize: 14,
    },
})

export default ValidatorScreen;