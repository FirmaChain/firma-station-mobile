import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CommonActions } from "@/redux/actions";
import { FirmaUtil } from "@firmachain/firma-js";
import { degree, TurnToOpposite, TurnToOriginal } from "@/util/animation";
import { getEstimateGasFromDelegation, getFeesFromGas } from "@/util/firma";
import { convertAmount, convertNumber, resizeFontSize } from "@/util/common";
import { StakingState } from "@/hooks/staking/hooks";
import { ARROW_ACCORDION } from "@/constants/images";
import { BgColor, BoxColor, DividerColor, Lato, TextColor, TextDisableColor } from "@/constants/theme";
import { FIRMACHAIN_DEFAULT_CONFIG } from "@/../config";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import SmallButton from "@/components/button/smallButton";
import AlertModal from "@/components/modal/alertModal";

interface Props {
    walletName: string;
    validatorAddress: string;
    stakingState: StakingState;
    delegations: number;
    handleDelegate: Function;
    transactionHandler: (password:string, gas:number) => void;
}

const DelegationBox = ({walletName, validatorAddress, stakingState, delegations, handleDelegate, transactionHandler}:Props) => {
    const arrowDeg = useRef(new Animated.Value(0)).current;

    const [openModal, setOpenModal] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);
    const [rewardTextSize, setRewardTextSize] = useState(20);
    const [accordionHeight, setAccordionHeight] = useState(0);

    const [withdrawGas, setWithdrawGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const onPressEvent = (type:string) => {
        handleDelegate(type);
    }

    const handleWithdraw = async(open:boolean) => {
        if(open){
            await getGasFromDelegation();
        }
        setOpenModal(open);
    }

    const getGasFromDelegation = async() => {
        CommonActions.handleLoadingProgress(true);
        if(stakingState.stakingReward > 0 && stakingState.available > FIRMACHAIN_DEFAULT_CONFIG.defaultFee){
            try {
                let gas = await getEstimateGasFromDelegation(walletName, validatorAddress);
                setWithdrawGas(gas);
            } catch (error) {
                console.log(error);
                CommonActions.handleLoadingProgress(false);
                setAlertDescription(String(error));
                return;
            }
        }
        CommonActions.handleLoadingProgress(false);
    }

    const handleTransaction = (password:string) => {
        if(alertDescription !== '') return handleModalOpen(true);
        transactionHandler(password, withdrawGas);
    }

    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
    }

    const handleOpenAccordion = () => {
        setOpenAccordion(!openAccordion);
    }

    useEffect(() => {
        if(openAccordion){
            setAccordionHeight(65);
            TurnToOpposite(Animated, arrowDeg);
        } else {
            setAccordionHeight(0);
            TurnToOriginal(Animated, arrowDeg);
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
                        <Text style={[styles.balance, {fontSize: rewardTextSize}]}>{convertAmount(stakingState.available, false)}
                            <Text style={[styles.title, {fontSize: 14, fontWeight: "normal"}]}>  FCT</Text>
                        </Text>
                    </View>
                    <SmallButton
                        title={"Delegate"}
                        size={122}
                        active={stakingState.available > 0}
                        onPressEvent={() => onPressEvent('Delegate')}/>
                </View>
                <View style={styles.divider}/>
                <View style={styles.boxH}>
                    <View style={styles.boxV}>
                        <Text style={styles.title}>Staking Reward</Text>
                        <Text style={[styles.balance, {fontSize: rewardTextSize}]}>{convertAmount(stakingState.stakingReward, false)}
                            <Text style={[styles.title, {fontSize: 14, fontWeight: "normal"}]}>  FCT</Text>
                        </Text>
                    </View>
                    <SmallButton
                        title={"Withdraw"}
                        size={122}
                        active={stakingState.stakingReward > 0}
                        onPressEvent={() => setOpenModal(true)}/>
                </View>
            </View>

            <View style={[styles.delegationBox, {marginTop: 12, paddingTop: 22, paddingBottom: 12}]}>
                <View style={styles.boxH}>
                    <Text style={styles.title}>My Delegations</Text>
                    <Text style={[styles.balance, {fontSize: rewardTextSize}]}>{convertAmount(stakingState.delegated, false)}
                        <Text style={[styles.title, {fontSize: 14, fontWeight: "normal"}]}>  FCT</Text>
                    </Text>
                </View>
                <View style={[styles.boxH, {justifyContent: "center", height: accordionHeight}, accordionHeight > 0 && {paddingTop: 22}]}>
                    <SmallButton
                        title={"Redelegate"}
                        size={142}
                        height={accordionHeight}
                        active={delegations > 0 && accordionHeight > 0}
                        onPressEvent={() => onPressEvent('Redelegate')}/>
                    <View style={{width: 15}}/>
                    <SmallButton
                        title={"Undelegate"}
                        size={142}
                        height={accordionHeight}
                        active={convertNumber(FirmaUtil.getFCTStringFromUFCT(stakingState.delegated)) > 0 && accordionHeight > 0}
                        onPressEvent={() => onPressEvent('Undelegate')}/>
                </View>
                <TouchableOpacity style={styles.boxArrow} onPress={() => handleOpenAccordion()}>
                    <Animated.Image style={[styles.icon_arrow, {transform: [{rotate: degree(arrowDeg)}]}]} source={ARROW_ACCORDION} />
                </TouchableOpacity>
            </View>
            <AlertModal
                visible={isAlertModalOpen}
                handleOpen={handleModalOpen}
                title={"Failed"}
                desc={alertDescription}
                confirmTitle={"OK"}
                type={"ERROR"}/>
            <TransactionConfirmModal 
                transactionHandler={handleTransaction} 
                title={"Withdraw"} 
                amount={stakingState.stakingReward} 
                fee={getFeesFromGas(withdrawGas)} 
                open={openModal} 
                setOpenModal={handleWithdraw} />
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
        paddingVertical: 5,
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