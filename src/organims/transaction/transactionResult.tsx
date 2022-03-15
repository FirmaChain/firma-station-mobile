import React from "react";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BgColor, Lato, PointLightColor, TextColor, TextGrayColor, TextWarnColor } from "@/constants/theme";
import { FailCircle, SuccessCircle } from "@/components/icon/icon";
import Button from "@/components/button/button";
import { ResultState } from ".";
import { EXPLORER_URL } from "@/constants/common";

interface Props {
    result: ResultState;
    handleBack: () => void;
}

const TransactionResult = ({result, handleBack}:Props) => {

    const convertTransactionCodeToText = (code:number) => {
        if(code === 0) return "Transaction Success";
        return "Transaction Failed";
    }

    const openExplorer = (hash:string) => {
        if(result.code === -1) return;
        Linking.openURL(EXPLORER_URL() + '/transactions/' + hash);
    }


    return (
        <View style={styles.container}>
            <View style={[styles.resultBox, {flex: 1, justifyContent: "center", alignItems: "center"}]}>
                {result.code === 0? 
                <SuccessCircle size={45} color={PointLightColor}/>        
                :
                <FailCircle size={45} color={TextWarnColor}/>
                }
                <Text style={[styles.result, {color: result.code === 0? PointLightColor:TextWarnColor}]}>{convertTransactionCodeToText(result.code)}</Text>
                <View style={styles.resultWrapper}>
                    {result.code !== -1 && <Text style={[styles.hash, {color: TextGrayColor}]}>HASH: </Text>}
                    <TouchableOpacity onPress={()=>openExplorer(result.result)}>
                        <Text numberOfLines={result.code === -1?10:1} ellipsizeMode={"middle"} style={[styles.hash, {paddingHorizontal: 5}]}>{result.result}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.resultBox, {justifyContent: "flex-end"}]}>
            <Button
                title={"OK"}
                active={true}
                onPressEvent={handleBack}/>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: BgColor,
        paddingBottom: Platform.select({android: 30, ios: 50}),
        paddingHorizontal: 20,
    },
    resultBox: {
        width: "100%",
    },
    resultWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    result: {
        fontFamily: Lato,
        fontSize: 22,
        fontWeight: "600",
        textAlign: "center",
        color: PointLightColor,
        paddingTop: 10,
        paddingBottom: 20,
    },
    hash: {
        fontFamily: Lato,
        fontSize: 14,
        textAlign: "center",
        color: TextColor,
        paddingBottom: 20,
    }
})

export default TransactionResult;