import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StakeInfo } from "@/hooks/staking/hooks";
import { useBalanceData } from "@/hooks/wallet/hooks";
import { convertNumber, convertToFctNumber } from "@/util/common";
import { DisableColor, InputBgColor, InputPlaceholderColor, Lato, PointColor, TextCatTitleColor, TextColor, WhiteColor } from "@/constants/theme";
import { AUTO_ENTERED_AMOUNT_TEXT, FEE_INSUFFICIENT_NOTICE, REDELEGATE_NOTICE_TEXT, UNDELEGATE_NOTICE_TEXT, UNSAFETY_NOTICE_TEXT } from "@/constants/common";
import { DownArrow } from "@/components/icon/icon";
import WarnContainer from "@/components/parts/containers/warnContainer";
import InputSetVerticalForAmount from "@/components/input/inputSetVerticalForAmount";
import WalletInfo from "@/organisms/wallet/send/walletInfo";
import ValidatorSelectModal from "./validatorSelectModal";

interface Props {
    type: string;
    operatorAddress: string;
    delegationState: Array<StakeInfo>;
    resetRedelegateValues: boolean;
    resetInputValues: boolean;
    handleStandardAvailable: (balance: number) => void;
    handleDelegateState: (type: string, value:string|number) => void;
}

const InputBox = ({type, operatorAddress, delegationState, resetRedelegateValues, resetInputValues, handleStandardAvailable, handleDelegateState}:Props) => {
    const {balance, getBalance} = useBalanceData();

    const [openSelectModal, setOpenSelectModal] = useState(false);

    const [selectOperatorAddressSrc, setSelectOperatorAddressSrc] = useState("");
    const [selectValidatorMoniker, setSelectValidatorMoniker] = useState("");
    const [selectDelegationAmount, setSelectDelegationAmount] = useState(0);

    const [maxActive, setMaxActive] = useState(false);
    const [safetyActive, setSafetyActive] = useState(true);
    const [limitAvailable, setLimitAvailable] = useState(0);

    const redelegationList = useMemo(() => {
        return delegationState;
    }, [delegationState]);

    const reward = useMemo(() => {
        if(type === "Delegate"){
            const state = delegationState.find((value) => value.validatorAddress === operatorAddress);
            if(state !== undefined){
                return convertNumber(state.reward);
            } else {
                return 0; 
            }
        }
        return 0;
    }, [delegationState, balance])

    const available = useMemo(() => {
        return type === "Delegate"? convertNumber(balance) : convertNumber(selectDelegationAmount)
    }, [delegationState, selectDelegationAmount, balance])

    const noticeText = useMemo(() => {
        switch (type) {
            case "Redelegate":
                return REDELEGATE_NOTICE_TEXT;
            case "Undelegate":
                return UNDELEGATE_NOTICE_TEXT;
            default:
                return [];
        }
    }, [type])

    const handleSelectModal = (open:boolean) => {
        setOpenSelectModal(open);
    }

    const handleMaxActive = (active:boolean) => {
        setMaxActive(active);
    }

    const handleSelectValidator = (address:string) => {
        handleDelegateState("operatorAddressSrc", address);
        setSelectOperatorAddressSrc(address);
        const selectedValidator = redelegationList.find((item:any) => item.validatorAddress === address);
        setSelectValidatorMoniker(selectedValidator === undefined? "" : selectedValidator.moniker);
        setSelectDelegationAmount(selectedValidator === undefined? 0 : selectedValidator.amount);
    }

    useEffect(() => {
        switch (type) {
            case "Delegate":
                if(safetyActive){
                    if(available > 100000){
                        handleStandardAvailable(convertNumber(convertToFctNumber(available - 100000)));
                        setLimitAvailable((available + reward) - 100000);
                    } 
                } else {
                    if(available > 20000) {
                        handleStandardAvailable(convertNumber(convertToFctNumber(available - 20000)));
                        setLimitAvailable((available + reward) - 20000);
                    } else {
                        setLimitAvailable(0);
                        setSafetyActive(false);
                    }
                }
                return;
            default:
                setLimitAvailable(0);
                return;
        }
    }, [type, safetyActive, available, reward])
    

    useEffect(() => {
        if(type === "Delegate" && available > 0){
            if(available <= 100000) setSafetyActive(false);
        }
    }, [available]);

    useEffect(() => {
        if(type === "Undelegate"){
            const amount = delegationState.find((item:any) => item.validatorAddress === operatorAddress)?.amount;
            setSelectDelegationAmount(amount === undefined? 0 : amount);
        }
    }, [type, delegationState]);

    useFocusEffect(
        useCallback(() => {
            if(type === "Delegate"){
                getBalance();
            }
          },[])
    )

    const ClassifyByType = () => {
        switch (type) {
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
                    placeholder="0 FCT"
                    accent={type === "Delegate"? safetyActive:maxActive}
                    limitValue={type === "Delegate"? limitAvailable : convertNumber(selectDelegationAmount)}
                    resetValues={resetInputValues}
                    enableMaxAmount={true}
                    handleMaxActive={handleMaxActive}
                    onChangeEvent={(value:number) => handleDelegateState("amount", value)}/>
                
                {type === "Delegate" &&
                    <>
                    <View style={styles.radioBox}>
                        <Text style={[styles.title, {paddingRight: 5}]}>Safety</Text>
                        <TouchableOpacity disabled={available <= 100000} onPress={() => setSafetyActive(!safetyActive)}>
                            <View style={[styles.radioWrapper, safetyActive?{backgroundColor: PointColor, alignItems: "flex-end"}:{backgroundColor: DisableColor}]}>
                                <View style={styles.radio} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {(available > 0 && available <= 20000) && 
                        <View style={{marginBottom: 10}}>
                            <WarnContainer text={FEE_INSUFFICIENT_NOTICE}/>
                        </View>
                    }
                    {(safetyActive && available >= 100000) &&
                    <View>
                        <WarnContainer text={AUTO_ENTERED_AMOUNT_TEXT} question={true}/>
                    </View>
                    }
                    {(safetyActive === false && available < 100000) &&
                    <View>
                        <WarnContainer text={UNSAFETY_NOTICE_TEXT} question={true}/>
                    </View>
                    }
                    </>
                }

                {(type === "Undelegate" || type === "Redelegate")&&
                
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
                            <Text 
                                style={[
                                    styles.selectTitle, 
                                    selectOperatorAddressSrc === "" && {color: InputPlaceholderColor}
                                ]}>{selectOperatorAddressSrc === ""? "Select..." : selectValidatorMoniker}</Text>
                            <DownArrow size={10} color={InputPlaceholderColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                {selectOperatorAddressSrc !== "" && delegate()}
            </View>
        )
    }

    return (
        <ScrollView>
            <View style={{paddingHorizontal: 20}}>
                <WalletInfo type={type} available={available} reward={reward}/>
            </View>
            {ClassifyByType()}
            <ValidatorSelectModal 
                myAddress={operatorAddress}
                list={redelegationList} 
                open={openSelectModal} 
                setOpenModal={handleSelectModal} 
                setValue={handleSelectValidator} 
                resetValues={resetRedelegateValues}/> 
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    conatainer: {
        paddingHorizontal: 20,
    },
    selectBox: {
        width: "100%",
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
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
        marginBottom: 10,
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


export default InputBox;