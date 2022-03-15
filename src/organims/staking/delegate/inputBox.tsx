import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StakeInfo } from "@/hooks/staking/hooks";
import { useBalanceData } from "@/hooks/wallet/hooks";
import { DisableColor, InputBgColor, InputPlaceholderColor, Lato, PointColor, TextColor, TextGrayColor, WhiteColor } from "@/constants/theme";
import { AUTO_ENTERED_AMOUNT_TEXT, REDELEGATE_NOTICE_TEXT, UNDELEGATE_NOTICE_TEXT } from "@/constants/common";
import { DownArrow } from "@/components/icon/icon";
import WarnContainer from "@/components/parts/containers/warnContainer";
import InputSetVerticalForAmount from "@/components/input/inputSetVerticalForAmount";
import WalletInfo from "@/organims/wallet/send/walletInfo";
import ValidatorSelectModal from "./validatorSelectModal";

interface Props {
    type: string;
    operatorAddress: string;
    delegationState: Array<StakeInfo>;
    resetRedelegateValues: boolean;
    resetInputValues: boolean;
    handleDelegateState: (type: string, value:string|number) => void;
}

const InputBox = ({type, operatorAddress, delegationState, resetRedelegateValues, resetInputValues, handleDelegateState}:Props) => {
    const {balance, getBalance} = useBalanceData();

    const [openSelectModal, setOpenSelectModal] = useState(false);

    const [selectOperatorAddressSrc, setSelectOperatorAddressSrc] = useState("");
    const [selectValidatorMoniker, setSelectValidatorMoniker] = useState("");
    const [selectDelegationAmount, setSelectDelegationAmount] = useState(0);

    const [maxActive, setMaxActive] = useState(false);
    const [maxAmount, setMaxAmount] = useState('');
    const [safetyActive, setSafetyActive] = useState(true);
    const [limitAvailable, setLimitAvailable] = useState(0);

    const redelegationList = useMemo(() => {
        return delegationState.filter((item:any) => item.validatorAddress !== operatorAddress);
    }, [delegationState]);

    const available = useMemo(() => {
        return type === "Delegate"? balance : Number(selectDelegationAmount)
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

    const handleSelectValidator = (address:string) => {
        handleDelegateState("operatorAddressSrc", address);
        setSelectOperatorAddressSrc(address);
        const selectedValidator = redelegationList.find((item:any) => item.validatorAddress === address);
        setSelectValidatorMoniker(selectedValidator === undefined? '' : selectedValidator.moniker);
        setSelectDelegationAmount(selectedValidator === undefined? 0 : selectedValidator.amount);
    }

    const handleSafetyMode = (active:boolean) => {
        setSafetyActive(active)
        if(active){
            if(balance > 100000){
                setLimitAvailable(balance - 100000);
            } else {
                handleSafetyMode(false);
            }
        } else {
            if(balance > 20000) {
                setLimitAvailable(balance - 20000);
            } else {
                setLimitAvailable(0);
            }
        }
    }

    useEffect(() => {
        if(maxActive){
            switch (type) {
                case "Delegate":
                    setMaxAmount((limitAvailable).toString());
                    break;
                default:
                    setMaxAmount(selectDelegationAmount.toString());
                    break;
            }
        } else {
            setMaxAmount('');
        }
    }, [maxActive]);

    useEffect(() => {
        if(type === "Delegate" && balance > 0){
            if(balance < 100000) setSafetyActive(false);
        }
    }, [balance]);

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
                    limitValue={type === "Delegate"? limitAvailable : Number(selectDelegationAmount)}
                    forcedValue={maxAmount}
                    resetValues={resetInputValues}
                    enableMaxAmount={true}
                    onChangeMaxAmount={setMaxActive}
                    onChangeEvent={(value:number) => handleDelegateState("amount", value)}/>
                
                <View style={styles.radioBox}>
                    {type === "Delegate" &&
                        <View style={styles.radioBox}>
                            <Text style={[styles.title, {paddingRight: 5}]}>Safety</Text>
                            <TouchableOpacity disabled={limitAvailable === 0} onPress={() => handleSafetyMode(!safetyActive)}>
                                <View style={[styles.radioWrapper, safetyActive?{backgroundColor: PointColor, alignItems: "flex-end"}:{backgroundColor: DisableColor}]}>
                                    <View style={styles.radio} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {(type === "Delegate" && safetyActive && balance > 0) &&
                <View>
                    <WarnContainer text={AUTO_ENTERED_AMOUNT_TEXT} question={true}/>
                </View>
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
                <WalletInfo available={available}/>
            </View>
            {ClassifyByType()}
            <ValidatorSelectModal list={redelegationList} open={openSelectModal} setOpenModal={handleSelectModal} setValue={handleSelectValidator} resetValues={resetRedelegateValues}/> 
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
        justifyContent: "space-between",
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


export default InputBox;