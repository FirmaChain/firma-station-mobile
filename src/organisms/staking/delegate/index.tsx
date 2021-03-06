import React, { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { useDelegationData } from "@/hooks/staking/hooks";
import { getEstimateGasDelegate, getEstimateGasRedelegate, getEstimateGasUndelegate, getFeesFromGas } from "@/util/firma";
import { convertNumber } from "@/util/common";
import { TRANSACTION_TYPE } from "@/constants/common";
import { FIRMACHAIN_DEFAULT_CONFIG, GUIDE_URI } from "@/../config";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import Button from "@/components/button/button";
import AlertModal from "@/components/modal/alertModal";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import InputBox from "./inputBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Delegate>;

interface IProps {
    type: string;
    operatorAddress: string;
}

interface IDelegateState {
    type: string;
    operatorAddressDst : string;
    operatorAddressSrc: string;
    amount: number;
    gas: number;
}

const Delegate = ({type, operatorAddress}:IProps) => {
    const navigation:ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    
    const {wallet, common} = useAppSelector(state => state);
    const { delegationState, handleDelegationState } = useDelegationData();

    const [resetInputValues, setInputResetValues] = useState(false);
    const [resetRedelegateValues, setResetRedelegateValues] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isSignModalOpen, setIsSignModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');
    
    const [status, setStatus] = useState(0);
    const [standardAvailable, setStandardAvailable] = useState(0);
    const [delegateState, setDelegateState] = useState<IDelegateState>({
        type: TRANSACTION_TYPE[type.toUpperCase()],
        operatorAddressDst : operatorAddress,
        operatorAddressSrc : "",
        amount: 0,
        gas: FIRMACHAIN_DEFAULT_CONFIG.defaultGas,
    });

    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
    }

    const handleSignModal = (open:boolean) => {
        setIsSignModalOpen(open);
        if(open === false) setStatus(status - 1);
    }

    const handleStandardAvailable = (balance: number) => {
        setStandardAvailable(balance);
    }

    const handleDelegateState = (type:string, value: string | number) => {
        setDelegateState((prevState) => ({
            ...prevState,
            [type] : value,
        }))
    }

    const handleNext = async() => {
        if(status > 0) return;
        CommonActions.handleLoadingProgress(true);
        
        let gas = FIRMACHAIN_DEFAULT_CONFIG.defaultGas;
        try {
            switch (type) {
                case "Delegate":
                    let amount = standardAvailable > delegateState.amount? delegateState.amount:standardAvailable;
                    gas = await getEstimateGasDelegate(wallet.name, delegateState.operatorAddressDst, amount);
                    break;
                case "Undelegate":
                    gas = await getEstimateGasUndelegate(wallet.name, delegateState.operatorAddressDst, delegateState.amount);
                    break;
                case "Redelegate":
                    gas = await getEstimateGasRedelegate(wallet.name, delegateState.operatorAddressSrc, delegateState.operatorAddressDst, delegateState.amount);
                    break;
            }
            handleDelegateState("gas", gas);
            setAlertDescription("");
            setStatus(1);
        } catch (error) {
            console.log(error); 
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            handleModalOpen(true);
            return;
        }
        CommonActions.handleLoadingProgress(false);
    }

    const handleTransaction = (password:string) => {
        setStatus(0);
        setInputResetValues(true);
        setResetRedelegateValues(true);

        const transactionState = {
            ...delegateState,
            password: password,
        }

        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const refreshStates = async() => {
        if(isFocused){
            CommonActions.handleLoadingProgress(true);
        }
        try {
            await handleDelegationState();
            setResetRedelegateValues(false);
            setInputResetValues(false);
            CommonActions.handleLoadingProgress(false);
            CommonActions.handleDataLoadStatus(0);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    }

    const handleMoveToWeb = () => {
        let key = type.toLowerCase()
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[key]});
        Linking.openURL(GUIDE_URI[key]);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        setIsSignModalOpen(status > 0);
    }, [status]);

    useEffect(() => {
        if(isFocused){
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
        }
    }, [common.dataLoadStatus])

    useEffect(() => {
        if(isFocused){
            refreshStates();
        }
    }, [isFocused])
    
    return (
        <Container
            title={type}
            handleGuide={handleMoveToWeb}
            backEvent={handleBack}>
                <ViewContainer>
                    <>
                    <View style={{flex: 1}}>
                        <View style={{flex: 6}}>
                            <ScrollView
                                keyboardShouldPersistTaps={"handled"}>
                                <InputBox 
                                    type={type} 
                                    operatorAddress={delegateState.operatorAddressDst}
                                    delegationState={delegationState}
                                    handleStandardAvailable={handleStandardAvailable}
                                    handleDelegateState={handleDelegateState} 
                                    resetRedelegateValues={resetRedelegateValues} 
                                    resetInputValues={resetInputValues} />
                                <TransactionConfirmModal 
                                    transactionHandler={handleTransaction} 
                                    title={type} 
                                    amount={delegateState.amount} 
                                    fee={getFeesFromGas(delegateState.gas)} 
                                    open={isSignModalOpen} 
                                    setOpenModal={handleSignModal} />
                            </ScrollView>
                        </View>
                        <View style={[styles.buttonBox, {flex: 1}]}>
                            <Button
                                title={"Next"}
                                active={convertNumber(delegateState.amount) > 0}
                                onPressEvent={handleNext}/>
                        </View>
                    </View>

                    <AlertModal
                        visible={isAlertModalOpen}
                        handleOpen={handleModalOpen}
                        title={"Failed"}
                        desc={alertDescription}
                        confirmTitle={"OK"}
                        type={"ERROR"}/>
                    </>
                </ViewContainer>
        </Container>
    )
}


const styles = StyleSheet.create({
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },
})


export default Delegate;