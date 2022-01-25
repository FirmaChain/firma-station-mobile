import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "../../../components/parts/containers/conatainer";
import { BgColor, BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor, WhiteColor } from "../../../constants/theme";
import AddressBox from "../../../organims/staking/validator/addressBox";
import PercentageBox from "../../../organims/staking/validator/percentageBox";
import ViewContainer from "../../../components/parts/containers/viewContainer";
import { convertAmount, convertCurrent, convertPercentage, convertToFctNumber } from "../../../util/common";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import DelegationBox from "../../../organims/staking/validator/delegationBox";
import { getStakingFromvalidator } from "@/util/firma";
import { Person } from "@/components/icon/icon";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Validator>;

export type ValidatorParams = {
    validator: any;
    address: string;
    walletName: string;
}

interface ValidatorScreenProps {
    route: {params: ValidatorParams};
    navigation: ScreenNavgationProps;
}

const ValidatorScreen: React.FunctionComponent<ValidatorScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {validator, address, walletName} = params;

    const moniker = validator.validatorMoniker;
    const description = validator.validatorDetail;
    const website = validator.validatorWebsite;

    const operatorAddress = validator.validatorAddress;
    const accountAddress = validator.selfDelegateAddress;

    const [stakingState, setStakingState] = useState<any>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    const APR = convertPercentage(validator.APR);
    const APY = convertPercentage(validator.APY);

    const percentageData = [
        {
            row: [
                {
                    title: "Voting Power",
                    data: validator.votingPowerPercent,
                    amount: validator.votingPower,
                },
                {
                    title: "Self-Delegation",
                    data: validator.selfPercent,
                    amount: convertToFctNumber(validator.self),
                },
            ]
        },
        {
            row: [
                {
                    title: "Commission",
                    data: validator.commission,
                },
                {
                    title: "Uptime",
                    data: validator.condition,
                },
            ]
        }
    ]

    // const delegations = validator.delegations;

    const handleDelegate = (type:string) => {
        navigation.navigate(Screens.Delegate, {type:type});
    }

    const handleTransaction = () => {
        navigation.navigate(Screens.Transaction);
    }

    const handleUrl = (url:string) => {
        Linking.openURL(url);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        async function handleDelegateState(){
            const state = await getStakingFromvalidator(address, operatorAddress);
            setStakingState({
                available: convertAmount(state.available, false),
                delegated: convertAmount(state.delegated, false),
                undelegate: convertAmount(state.undelegate, false),
                stakingReward: convertAmount(state.stakingReward, false),
            });
        }

        handleDelegateState();
    }, [validator]);
    

    return (
        <Container
            titleOn={false}
            bgColor={BoxColor}
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <ScrollView style={{backgroundColor: BoxColor}}>
                        <View style={[styles.boxH, {backgroundColor: BoxColor, paddingHorizontal: 20,}]}>
                            {validator.validatorAvatar?
                            <Image style={styles.avatar} source={{uri: validator.validatorAvatar}}/>
                            :
                            <View style={styles.avatar}>
                                <Person size={68} color={WhiteColor}/>
                            </View>
                            }
                            <View style={[styles.boxV, {flex: 1}]}>
                                <Text style={styles.moniker}>{moniker}</Text>
                                <Text style={styles.desc}>{description}</Text>
                                {website &&
                                <TouchableOpacity onPress={()=>handleUrl(website)}>
                                    <Text style={styles.url}>{website}</Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>

                        <DelegationBox stakingState={stakingState} handleDelegate={handleDelegate} transactionHandler={handleTransaction}/>
                        <View style={styles.infoBox}>
                            <PercentageBox APR={APR} APY={APY} dataArr={percentageData} />
                            <AddressBox title={"Operator address"} path={"validators"} address={operatorAddress} />
                            <AddressBox title={"Account address"} path={"accounts"} address={accountAddress} />
                        </View>
                    </ScrollView>
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

export default React.memo(ValidatorScreen);