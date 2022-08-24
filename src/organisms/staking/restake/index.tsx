import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { FirmaUtil } from "@firmachain/firma-js";
import { useDelegationData, useStakingData } from "@/hooks/staking/hooks";
import { BgColor, TextCatTitleColor } from "@/constants/theme";
import { RESTAKE_NOTICE_TEXT, RESTAKE_TYPE, TRANSACTION_TYPE } from "@/constants/common";
import { getEstimateGasGrantStakeAuthorization, getEstimateGasRevokeStakeAuthorization, getFeesFromGas } from "@/util/firma";
import { FIRMACHAIN_DEFAULT_CONFIG } from "@/../config";
import Button from "@/components/button/button";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import WarnContainer from "@/components/parts/containers/warnContainer";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import AlertModal from "@/components/modal/alertModal";
import BalanceInfoForRestake from "@/components/parts/balanceInfoForRestake";
import ReceiptBox from "./reciptBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Restake>;
let restakeType:string = "GRANT";

const Restake = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const { wallet } = useAppSelector(state => state);

    const { stakingState } = useStakingData();
    const { delegationState, stakingGrantState } = useDelegationData();

    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [openModal, setOpenModal] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState("");

    const totalDelegate = useMemo(() => {
        return FirmaUtil.getUFCTFromFCT(stakingState.delegated);
    }, [stakingState])

    const totalReward = useMemo(() => {
        return FirmaUtil.getUFCTFromFCT(stakingState.stakingReward);
    }, [stakingState])

    const grantExist = useMemo(() => {
        return stakingGrantState.list.length > 0;        
    }, [stakingGrantState])

    const validatorAddressList = useMemo(() => {
        if(delegationState.length > 0) {
            const list = delegationState.map((value) => {
                return value.validatorAddress;
            })
            return list;
        }
        return [];
    }, [delegationState]);

    const handleGrantOrRevoke = async(open:boolean, type: string) => {
        restakeType = type;
        handleGrantOrRevokeConfirm(open);
    }

    const handleGrantOrRevokeConfirm = async(open:boolean) => {
        try {
            if(open){
                await getEstimateGasGrantOrRevoke();
            }
            setOpenModal(open);
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            handleModalOpen(true);
            throw error;
        }
    }

    const getEstimateGasGrantOrRevoke = async() => {
        CommonActions.handleLoadingProgress(true);
        try {
            if(TRANSACTION_TYPE[restakeType] === TRANSACTION_TYPE["GRANT"]){
                const result = await getEstimateGasGrantStakeAuthorization(wallet.name, validatorAddressList);
                setGas(result);
            }
            if(TRANSACTION_TYPE[restakeType] === TRANSACTION_TYPE["REVOKE"]){
                const result = await getEstimateGasRevokeStakeAuthorization(wallet.name);
                setGas(result);
            }
            setAlertDescription("");
        } catch (error) {
            console.log(error);
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            handleModalOpen(true);
            throw error;
        }
        CommonActions.handleLoadingProgress(false);
    }

    const handleTransaction = (password:string) => {
        if(alertDescription !== "") return handleModalOpen(true);
        let transactionState;
        switch (TRANSACTION_TYPE[restakeType]) {
            case TRANSACTION_TYPE["REVOKE"]:
                transactionState = {
                    type: TRANSACTION_TYPE["REVOKE"],
                    password: password,
                    gas: gas,
                }
                break;
            case TRANSACTION_TYPE["GRANT"]:
                transactionState = {
                    type: TRANSACTION_TYPE["GRANT"],
                    password: password,
                    maxTokens: 0,
                    validatorAddressList : validatorAddressList,
                    gas: gas,
                }
                break;
            default:
                break;
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }
    
    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title={"Restake"}
            bgColor={BgColor}
            backEvent={handleBack}>
                <ViewContainer
                    bgColor={BgColor}>
                    <View style={styles.container}>
                        <View style={{flex: 1}}>
                            <ScrollView style={{marginBottom: 20}}>
                                <View style={{flex: 1, paddingHorizontal: 20}}>
                                    <BalanceInfoForRestake available={totalDelegate} reward={totalReward} />
                                    <ReceiptBox />
                                    {RESTAKE_NOTICE_TEXT.map((value, index) => {
                                        return (
                                            <View key={index} style={{marginBottom: 10}}>
                                                <WarnContainer text={value} question={true} />
                                            </View>
                                        )
                                    })}
                                </View>
                            </ScrollView>
                            <View style={styles.boxContainer}>
                                {grantExist &&
                                <>
                                <View style={{flex: 1}}>
                                    <Button
                                        title="Disable" 
                                        active={true}
                                        border={true}
                                        borderColor={TextCatTitleColor}
                                        borderTextColor={TextCatTitleColor}
                                        onPressEvent={()=>handleGrantOrRevoke(true, "REVOKE")}/>
                                </View>
                                <View style={{width: 10}} />
                                </>
                                }
                                <View style={{flex: 1}}>
                                    <Button
                                        title={grantExist?"Update":"Enable"}
                                        active={true}
                                        onPressEvent={()=>handleGrantOrRevoke(true, "GRANT")}/>
                                </View>
                            </View>
                        </View>
                        <TransactionConfirmModal
                            transactionHandler={handleTransaction} 
                            title={RESTAKE_TYPE[restakeType]} 
                            amount={0} 
                            fee={getFeesFromGas(gas)} 
                            open={openModal} 
                            setOpenModal={handleGrantOrRevokeConfirm} />
                        <AlertModal
                            visible={isAlertModalOpen}
                            handleOpen={handleModalOpen}
                            title={"Failed"}
                            desc={alertDescription}
                            confirmTitle={"OK"}
                            type={"ERROR"}/>
                    </View>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
    },
    boxContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20, 
    },
})

export default Restake;