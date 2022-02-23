import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "@/components/parts/containers/conatainer";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import Button from "@/components/button/button";
import ViewContainer from "@/components/parts/containers/viewContainer";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import ValidatorSelectModal from "@/organims/staking/delegate/validatorSelectModal";
import WalletInfo from "@/organims/wallet/send/walletInfo";
import { AUTO_ENTERED_AMOUNT_TEXT, CONTEXT_ACTIONS_TYPE, FIRMACHAIN_DEFAULT_CONFIG, KeyValue, REDELEGATE_NOTICE_TEXT, TRANSACTION_TYPE, UNDELEGATE_NOTICE_TEXT } from "@/constants/common";
import { DownArrow, Radio } from "@/components/icon/icon";
import { DisableColor, InputBgColor, InputPlaceholderColor, Lato, PointColor, TextColor, TextGrayColor, WhiteColor } from "@/constants/theme";
import { AppContext } from "@/util/context";
import { getEstimateGasDelegate, getEstimateGasRedelegate, getEstimateGasUndelegate, getFeesFromGas } from "@/util/firma";
import WarnContainer from "@/components/parts/containers/warnContainer";
import { useDelegationData } from "@/hooks/staking/hooks";
import { useFocusEffect } from "@react-navigation/native";
import { useBalanceData } from "@/hooks/wallet/hooks";
import InputSetVerticalForAmount from "@/components/input/inputSetVerticalForAmount";
import AlertModal from "@/components/modal/alertModal";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Delegate>;

export type DelegateParams = {
    state: any;
}

interface DelegateScreenProps {
    route: {params: DelegateParams};
    navigation: ScreenNavgationProps;
}

const DelegateScreen: React.FunctionComponent<DelegateScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {state} = params;

    const {wallet, dispatchEvent} = useContext(AppContext);
    const { delegationState, handleDelegationState } = useDelegationData(wallet.address);

    const {balance, getBalance} = useBalanceData(wallet.address);

    const [limitAvailable, setLimitAvailable] = useState(0);
    const [amount, setAmount] = useState(0);
    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [status, setStatus] = useState(0);
    const [resetInputValues, setInputResetValues] = useState(false);
    const [openSignModal, setOpenSignModal] = useState(false);
    const [resetRedelegateValues, setResetRedelegateValues] = useState(false);

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const [autoActive, setAutoActive] = useState(false);
    const [autoAmount, setAutoAmount] = useState('');

    const [safetyActive, setSafetyActive] = useState(true);

    const [selectOperatorAddressSrc, setSelectOperatorAddressSrc] = useState("");
    const [selectValidatorMoniker, setSelectValidatorMoniker] = useState("");
    const [selectDelegationAmount, setSelectDelegationAmount] = useState(0);
    const [openSelectModal, setOpenSelectModal] = useState(false);

    const noticeText = useMemo(() => {
        switch (state.type) {
            case "Redelegate":
                return REDELEGATE_NOTICE_TEXT;
            case "Undelegate":
                return UNDELEGATE_NOTICE_TEXT;
            default:
                return [];
        }
    }, [state.type])

    const handleTransaction = (password:string) => {
        let transactionState:KeyValue = {
            type: TRANSACTION_TYPE[state.type.toUpperCase()],
            password: password,
            operatorAddressDst : state.operatorAddress,
            amount: amount,
            gas: gas,
        }

        if(state.type === "Redelegate"){
            transactionState['operatorAddressSrc'] = selectOperatorAddressSrc;
        }

        setStatus(0);
        setSelectDelegationAmount(0);
        setSelectOperatorAddressSrc("");
        setInputResetValues(true);
        setResetRedelegateValues(true);
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const handleAmount = (value:number) => {
        setStatus(0);
        setAmount(value);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    const ClassifyByType = () => {
        switch (state.type) {
            case "Delegate":
                return delegate();
            case "Undelegate":
                return delegate();
            case "Redelegate":
                return redelegate();
        }
    }

    const delegate = () => {
        return (
            <View style={styles.conatainer}>
                <InputSetVerticalForAmount
                    title="Amount"
                    placeholder="0"
                    accent={state.type === "Delegate"? safetyActive:autoActive}
                    limitValue={state.type === "Delegate"? limitAvailable : Number(selectDelegationAmount)}
                    forcedValue={autoAmount}
                    resetValues={resetInputValues}
                    onChangeEvent={handleAmount}/>
                
                <View style={styles.radioBox}>
                    {state.type === "Delegate"?
                        <View style={styles.radioBox}>
                            <Text style={[styles.title, {paddingRight: 5}]}>Safety</Text>
                            <TouchableOpacity onPress={() => setSafetyActive(!safetyActive)}>
                                <View style={[styles.radioWrapper, safetyActive?{backgroundColor: PointColor, alignItems: "flex-end"}:{backgroundColor: DisableColor}]}>
                                    <View style={styles.radio} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity style={styles.radioBox} onPress={() => setAutoActive(!autoActive)}>
                            <Radio active={autoActive} size={20} color={WhiteColor} />
                            <Text style={[styles.title, {paddingLeft: 5, marginBottom: 0, color: WhiteColor}]}>{state.type === "Delegate"? "Auto":"All"}</Text>
                        </TouchableOpacity>
                    }
                </View>
                {safetyActive &&
                <View>
                    <WarnContainer text={AUTO_ENTERED_AMOUNT_TEXT} question={true}/>
                </View>
                }
                {(state.type === "Undelegate" || state.type === "Redelegate")&&
                
                noticeText.map((value, index) => {
                    return (
                        <View key={index} style={{paddingVertical: 5}}>
                            <WarnContainer text={value} />
                        </View>
                    )
                })
                }
            </View>
        )
    }

    const redelegate = () => {
        return (
            <View>
                <View style={[styles.conatainer, {marginBottom: 13}]}>
                    <View style={styles.selectBox}>
                        <Text style={styles.title}>Source Validator</Text>
                        <TouchableOpacity style={[styles.select]} onPress={() => handleSelectModal(true)}>
                            <Text style={[styles.selectTitle, selectOperatorAddressSrc === "" &&{color: InputPlaceholderColor}]}>{selectOperatorAddressSrc === ""? "Select..." : selectValidatorMoniker}</Text>
                            <DownArrow size={10} color={InputPlaceholderColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                {selectOperatorAddressSrc !== "" && delegate()}
            </View>
        )
    }

    const handleNext = async() => {
        if(status > 0) return;
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
        let gas = FIRMACHAIN_DEFAULT_CONFIG.defaultGas;
        try {
            switch (state.type) {
                case "Delegate":
                    gas = await getEstimateGasDelegate(wallet.name, state.operatorAddress, amount);
                    setGas(gas);
                    break;
                case "Undelegate":
                    gas = await getEstimateGasUndelegate(wallet.name, state.operatorAddress, amount);
                    setGas(gas);
                    break;
                case "Redelegate":
                    gas = await getEstimateGasRedelegate(wallet.name, selectOperatorAddressSrc, state.operatorAddress, amount);
                    setGas(gas);
                    break;
            }
            setStatus(status + 1);
        } catch (error) {
            console.log(error); 
            setAlertDescription(String(error));
            setIsAlertModalOpen(true);
        }
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
    }

    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
    }

    const handleSignModal = (open:boolean) => {
        setOpenSignModal(open);
        if(open === false) setStatus(status - 1);
    }

    const handleSelectValidator = (address:string) => {
        setSelectOperatorAddressSrc(address);
        const selectedValidator = delegationState.find((item:any) => item.validatorAddress === address);
        setSelectValidatorMoniker(selectedValidator === undefined? '' : selectedValidator.moniker);
        setSelectDelegationAmount(selectedValidator === undefined? 0 : selectedValidator.amount);
    }

    const handleSelectModal = (open:boolean) => {
        setOpenSelectModal(open);
    }

    useEffect(() => {
        if(autoActive){
            switch (state.type) {
                case "Delegate":
                    setAutoAmount((balance - 100000).toString());
                    break;
                default:
                    setAutoAmount(selectDelegationAmount.toString());
                    break;
            }
        } else {
            setAutoAmount('');
        }
    }, [autoActive])

    useEffect(() => {
        if(balance > 0){
            if(safetyActive){
                setLimitAvailable(balance - 100000);
            } else {
                setLimitAvailable(balance - 20000);
            }
        }
        
    }, [safetyActive, balance])
    

    useEffect(() => {
        setOpenSignModal(status > 0);
    }, [status])

    useEffect(() => {
        if(state){
            if(state.type === "Undelegate"){
                const amount = delegationState.find((item:any) => item.validatorAddress === state.operatorAddress)?.amount;
                setSelectDelegationAmount(amount === undefined? 0 : amount);
            }
        }
    }, [state.type, delegationState]);

    useFocusEffect(
        useCallback(() => {
            if(state.type !== "Delegate"){
                getBalance();
                handleDelegationState();
                setResetRedelegateValues(false);
            }
        }, [])
    )

    return (
        <Container
            title={state.type}
            backEvent={handleBack}>
                <ViewContainer>
                    <>
                    <ScrollView>
                        <View style={{paddingHorizontal: 20}}>
                            <WalletInfo available={state.type === "Delegate"? balance : Number(selectDelegationAmount)}/>
                        </View>
                        {ClassifyByType()}
                        <TransactionConfirmModal transactionHandler={handleTransaction} title={state.type} amount={amount} fee={getFeesFromGas(gas)} open={openSignModal} setOpenModal={handleSignModal} />
                        <ValidatorSelectModal list={delegationState.filter((item:any) => item.validatorAddress !== state.operatorAddress)} open={openSelectModal} setOpenModal={handleSelectModal} setValue={handleSelectValidator} resetValues={resetRedelegateValues}/> 
                    </ScrollView>
                    <View style={[styles.buttonBox, {flex: 1, minHeight: 60}]}>
                        <Button
                            title={"Next"}
                            active={Number(amount) > 0}
                            onPressEvent={handleNext}/>
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
    conatainer: {
        paddingHorizontal: 20,
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },
    selectBox: {
        width: "100%",
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
        marginBottom: 5,
    },
    select: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    },
    selectTitle: {
        fontFamily: Lato,
        fontSize:14,
        color: TextColor,
    },
    radioBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 5,
    },
    radioWrapper: {
        width: 45,
        borderRadius: 20,
        justifyContent: "center",
        padding: 3,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor,
    }
})

export default DelegateScreen;