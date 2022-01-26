import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import SmallButton from "@/components/button/smallButton";
import { BgColor, BoxColor, DisableColor, DividerColor, Lato, TextColor, TextDisableColor } from "@/constants/theme";
import { ARROW_ACCORDION } from "@/constants/images";
import { resizeFontSize } from "@/util/common";
import { CloseAccordion, degree, OpenAccordion, TurnToOpposite, TurnToOriginal } from "@/util/animation";
import { StakingValues } from "@/hooks/staking/hooks";

interface Props {
    stakingState: StakingValues;
    handleDelegate: Function;
    transactionHandler: Function;
}

const DelegationBox = ({stakingState, handleDelegate, transactionHandler}:Props) => {
    const arrowDeg = useRef(new Animated.Value(0)).current;

    const [openModal, setOpenModal] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);
    const [rewardTextSize, setRewardTextSize] = useState(20);
    const [accordionHeight, setAccordionHeight] = useState(0);

    const onPressEvent = (type:string) => {
        handleDelegate(type);
    }

    const handleWithdraw = (open:boolean) => {
        setOpenModal(open);
    }

    const handleOpenAccordion = () => {
        setOpenAccordion(!openAccordion);
    }

    useEffect(() => {
        if(openAccordion){
            OpenAccordion(setAccordionHeight, 65);
            TurnToOpposite(arrowDeg);
        } else {
            CloseAccordion(setAccordionHeight);
            TurnToOriginal(arrowDeg);
        }
    }, [openAccordion]);
    

    useEffect(() => {
        setRewardTextSize(resizeFontSize(0, 100000, 20));
    }, [])

    return (
        <View style={styles.container}>
            <View style={[styles.delegationBox, {paddingBottom: 24}]}>
                <View style={styles.boxH}>
                    <View style={styles.boxV}>
                        <Text style={styles.title}>Available</Text>
                        <Text style={[styles.balance, {fontSize: rewardTextSize}]}>{stakingState.available}
                            <Text style={[styles.title, {fontSize: 14, fontWeight: "normal"}]}>  FCT</Text>
                        </Text>
                    </View>
                    <SmallButton
                        title={"Delegate"}
                        size={122}
                        onPressEvent={() => onPressEvent('Delegate')}/>
                </View>
                <View style={styles.divider}/>
                <View style={styles.boxH}>
                    <View style={styles.boxV}>
                        <Text style={styles.title}>Staking Reward</Text>
                        <Text style={[styles.balance, {fontSize: rewardTextSize}]}>{stakingState.stakingReward}
                            <Text style={[styles.title, {fontSize: 14, fontWeight: "normal"}]}>  FCT</Text>
                        </Text>
                    </View>
                    <SmallButton
                        title={"Withdraw"}
                        size={122}
                        color={DisableColor}
                        onPressEvent={() => handleWithdraw(true)}/>
                </View>
            </View>

            <View style={[styles.delegationBox, {marginTop: 12, paddingTop: 22, paddingBottom: 12}]}>
                <View style={styles.boxH}>
                    <Text style={styles.title}>My Delegations</Text>
                    <Text style={[styles.balance, {fontSize: rewardTextSize}]}>{stakingState.delegated}
                        <Text style={[styles.title, {fontSize: 14, fontWeight: "normal"}]}>  FCT</Text>
                    </Text>
                </View>
                <View style={[styles.boxH, {justifyContent: "space-evenly", height: accordionHeight}, accordionHeight > 0 && {paddingTop: 22}]}>
                    <SmallButton
                        title={"Redelegate"}
                        size={142}
                        height={accordionHeight}
                        color={DisableColor}
                        onPressEvent={() => onPressEvent('Redelegate')}/>
                    <SmallButton
                        title={"Undelegate"}
                        size={142}
                        height={accordionHeight}
                        onPressEvent={() => onPressEvent('Undelegate')}/>
                </View>
                <TouchableOpacity style={styles.boxArrow} onPress={() => handleOpenAccordion()}>
                    <Animated.Image style={[styles.icon_arrow, {transform: [{rotate: degree(arrowDeg)}]}]} source={ARROW_ACCORDION} />
                </TouchableOpacity>
            </View>
            <TransactionConfirmModal transactionHandler={transactionHandler} title={"Withdraw"} walletName={""} amount={100} open={openModal} setOpenModal={handleWithdraw} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 24,
        paddingBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: BoxColor,
    },
    delegationBox: {
        borderRadius: 8,
        backgroundColor: BgColor,
        paddingHorizontal: 20,
        paddingVertical: 22,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    boxH: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    boxV: {
        alignItems: "flex-start",
    },
    boxArrow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: "600",
        color: TextDisableColor,
        paddingBottom: 6, 
    },
    balance: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "600",
        color: TextColor,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: DividerColor,
        marginVertical: 20,
    },
    icon_arrow: {
        width: 24,
        height: 24,
    }
})

export default DelegationBox;