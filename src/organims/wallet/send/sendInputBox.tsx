import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DisableColor, Lato, PointColor, TextGrayColor, WhiteColor } from "@/constants/theme";
import InputSetVerticalForAddress from "@/components/input/inputSetVerticalForAddress";
import InputSetVerticalForAmount from "@/components/input/inputSetVerticalForAmount";
import InputSetVertical from "@/components/input/inputSetVertical";

interface Props {
    handleSendInfo: (type:string, value:string|number) => void;
    available: number;
    reset: boolean;
}

const SendInputBox = ({handleSendInfo, available, reset}:Props) => {
    const [safetyActive, setSafetyActive] = useState(true);
    const [limitAvailable, setLimitAvailable] = useState(0);

    const handleSendInfoState = (type:string, value:string|number) => {
        handleSendInfo(type, value);
    }

    useEffect(() => {
        if(safetyActive){
            if(available > 100000){
                setLimitAvailable(available - 100000);
            }
        } else {
            if(available > 20000) {
                setLimitAvailable(available - 20000);
            } else {
                setLimitAvailable(0);
            }
        }
    }, [available, safetyActive])

    useEffect(() => {
        if(available > 100000){
            setSafetyActive(true);
        } else {
            setLimitAvailable(available >= 20000? (available-20000):0);
            setSafetyActive(false);
        }
    }, [available])

    return (
        <View>
            <InputSetVerticalForAddress
                title="To address"
                placeholder="Address"
                resetValues={reset}
                onChangeEvent={(value:any) => handleSendInfoState("address", value)}/>
            <InputSetVerticalForAmount
                title="Amount"
                placeholder="0 FCT"
                accent={safetyActive}
                limitValue={limitAvailable}
                resetValues={reset}
                onChangeEvent={(value:any) => handleSendInfoState("amount", value)}/>
            <InputSetVertical
                title="Memo"
                message=""
                validation={true}
                placeholder="Memo"
                resetValues={reset}
                onChangeEvent={(value:any) => handleSendInfoState("memo", value)}/>
            <View style={styles.radioBox}>
                <Text style={[styles.title, {paddingRight: 5}]}>Safety</Text>
                <TouchableOpacity disabled={limitAvailable < 20000 || available < 100000} onPress={() => setSafetyActive(!safetyActive)}>
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