import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "../../../components/parts/containers/conatainer";
import { TextColor } from "../../../constants/theme";
import AddressBox from "../../../organims/staking/validator/addressBox";
import PercentageBox from "../../../organims/staking/validator/percentageBox";
import ViewContainer from "../../../components/parts/containers/viewContainer";
import { convertToFctNumber } from "../../../util/common";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import RewardBox from "../../../organims/staking/parts/rewardBox";
import DelegationBox from "../../../organims/staking/parts/delegationBox";

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

    const aprApy = {APR:(validator.APR * 100).toFixed(2),
                    APY:(validator.APY * 100).toFixed(2)}
    const percentageData = [
        {
            row: [
                {
                    title: "Voting power",
                    data: validator.votingPowerPercent,
                    amount: validator.votingPower,
                },
                {
                    title: "Self-delegation",
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

    return (
        <Container
            titleOn={false}
            backEvent={handleBack}>
                <ViewContainer>
                    <ScrollView>
                        <View style={[styles.boxH, {alignItems: "center", paddingVertical: 10, paddingHorizontal: 20}]}>
                            <Image style={styles.avatar} source={{uri: validator.validatorAvatar}} />
                            <View style={[styles.boxV, {flex: 1}]}>
                                <Text style={styles.moniker}>{moniker}</Text>
                                <Text style={styles.desc}>{description}</Text>
                                <TouchableOpacity onPress={()=>handleUrl(website)}>
                                    <Text style={styles.url}>{website}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <DelegationBox handleDelegate={handleDelegate}/>
                        <RewardBox reward={0} fromVD={true} transactionHandler={handleTransaction}/>

                        <PercentageBox aprApy={aprApy} dataArr={percentageData} />
                        <AddressBox title={"Operator address"} address={operatorAddress} />
                        <AddressBox title={"Account address"} address={accountAddress} />
                        {/* <DelegationsBox delegations={delegations} /> */}
                    </ScrollView>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    box: {
    },
    boxH: {
        flexDirection: "row",
    },
    boxV: {
        alignItems: "flex-start",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        overflow: "hidden",
        marginRight: 10,
    },
    moniker: {
        width: "100%",
        fontSize: 18,
        fontWeight: "bold",
        color: TextColor,
        paddingBottom: 10,
    },
    desc: {
        width: "auto",
        color: "#aaa",
        fontSize: 12,
        paddingBottom: 5,
    },
    content: {
        width: "100%",
        color: "#1e1e1e",
        fontSize: 14,
        paddingBottom: 5,
    },
    url: {
        width: "100%",
        color: TextColor,
        fontSize: 12,
    },
})

export default ValidatorScreen;