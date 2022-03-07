import InputSetVerticalForAddress from "@/components/input/inputSetVerticalForAddress";
import InputSetVerticalForAmount from "@/components/input/inputSetVerticalForAmount";
import { DisableColor, Lato, PointColor, TextGrayColor, WhiteColor } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InputSetVertical from "../../../components/input/inputSetVertical";

interface Props {
    address: any;
    amount: any;
    memo: any;
    available: number;
    reset: boolean;
}

const SendInputBox = ({address, amount, memo, available, reset}:Props) => {
    const [safetyActive, setSafetyActive] = useState(true);
    const [limitAvailable, setLimitAvailable] = useState(0);

    const handleAddress = (value:string) => {
        address(value);
    }

    const handleAmount = (value:number) => {
        amount(value);
    }

    const handleMemo = (value:string) => {
        memo(value);
    }

    useEffect(() => {
        if(safetyActive && available > 100000){
            setLimitAvailable(available - 100000);
        } 
        if(!safetyActive && available > 20000) {
            setLimitAvailable(available - 20000);
        }
    }, [available, safetyActive])

    useEffect(() => {
        if(available > 20000){
            setSafetyActive(true);
        } else {
            setLimitAvailable(0);
            setSafetyActive(false);
        }
    }, [available])

    return (
        <View>
            <InputSetVerticalForAddress
                title="To address"
                placeholder="Address"
                resetValues={reset}
                onChangeEvent={handleAddress}/>
            <InputSetVerticalForAmount
                title="Amount"
                placeholder="0 FCT"
                accent={safetyActive}
                limitValue={limitAvailable}
                resetValues={reset}
                onChangeEvent={handleAmount}/>
            <InputSetVertical
                title="Memo"
                message=""
                validation={true}
                placeholder="Memo"
                resetValues={reset}
                onChangeEvent={handleMemo}/>
            <View style={styles.radioBox}>
                <Text style={[styles.title, {paddingRight: 5}]}>Safety</Text>
                <TouchableOpacity disabled={limitAvailable == 0 || available < 100000} onPress={() => setSafetyActive(!safetyActive)}>
                    <View style={[styles.radioWrapper, safetyActive?{backgroundColor: PointColor, alignItems: "flex-end"}:{backgroundColor: DisableColor}]}>
                        <View style={styles.radio} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
        marginBottom: 5,
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

export default SendInputBox;