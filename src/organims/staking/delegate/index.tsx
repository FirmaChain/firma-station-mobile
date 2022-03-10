import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { useDelegationData } from "@/hooks/staking/hooks";
import { getEstimateGasDelegate, getEstimateGasRedelegate, getEstimateGasUndelegate, getFeesFromGas } from "@/util/firma";
import { FIRMACHAIN_DEFAULT_CONFIG, TRANSACTION_TYPE } from "@/constants/common";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import Button from "@/components/button/button";
import AlertModal from "@/components/modal/alertModal";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import InputBox from "./inputBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Delegate>;

interface Props {
    type: string;
    operatorAddress: string;
}

interface DelegateState {
    type: string;
    operatorAddressDst : string;
    operatorAddressSrc: string;
    amount: number;
    gas: number;
}

const Delegate = ({type, operatorAddress}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation();
    
    const {wallet} = useAppSelector(state => state);
    const { delegationState, handleDelegationState } = useDelegationData();

    const [resetInputValues, setInputResetValues] = useState(false);
    const [resetRedelegateValues, setResetRedelegateValues] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isSignModalOpen, setIsSignModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');
    
    const [status, setStatus] = useState(0);
    const [delegateState, setDelegateState] = useState<DelegateState>({
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

    const handleDelegateState = (type:string, value: string | number) => {
        setDelegateState((prevState) => ({
            ...prevState,
            [type] : value,
        }))
    }

    const handleNext = async() => {
        if(status > 0) return;
        CommonActions.handleLoadingProgress(true);
        console.log(delegateState.operatorAddressDst);
        
        let gas = FIRMACHAIN_DEFAULT_CONFIG.defaultGas;
        try {
            switch (type) {
                case "Delegate":
                    gas = await getEstimateGasDelegate(wallet.name, delegateState.operatorAddressDst, delegateState.amount);
                    break;
                case "Undelegate":
                    gas = await getEstimateGasUndelegate(wallet.name, delegateState.operatorAddressDst, delegateState.amount);
                    break;
                case "Redelegate":
                    gas = await getEstimateGasRedelegate(wallet.name, delegateState.operatorAddressSrc, delegateState.operatorAddressDst, delegateState.amount);
                    break;
            }
            handleDelegateState("gas", gas);
            setStatus(status + 1);
        } catch (error) {
            console.log(error); 
            setAlertDescription(String(error));
            setIsAlertModalOpen(true);
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

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        setIsSignModalOpen(status > 0);
    }, [status]);

    useFocusEffect(
        useCallback(() => {
            handleDelegationState();
            setResetRedelegateValues(false);
            setInputResetValues(false);
        }, [])
    )
    
    return (
        <Container
            title={type}
            backEvent={handleBack}>
                <ViewContainer>
                    <>
                    <View style={{flex: 1}}>
                        <InputBox 
                            type={type} 
                            operatorAddress={delegateState.operatorAddressDst}
                            delegationState={delegationState} 
                            handleDelegateState={handleDelegateState} 
                            resetRedelegateValues={resetRedelegateValues} 
                            resetInputValues={resetInputValues} />
                        <View style={[styles.buttonBox, {flex: 1, minHeight: 60}]}>
                            <Button
                                title={"Next"}
                                active={Number(delegateState.amount) > 0}
                                onPressEvent={handleNext}/>
                        </View>
                    </View>
                    <TransactionConfirmModal 
                        transactionHandler={handleTransaction} 
                        title={type} 
                        amount={delegateState.amount} 
                        fee={getFeesFromGas(delegateState.gas)} 
                        open={isSignModalOpen} 
                        setOpenModal={handleSignModal} />

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