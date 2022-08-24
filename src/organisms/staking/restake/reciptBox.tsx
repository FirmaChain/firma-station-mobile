import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderColor, Lato, TextAddressColor, TextGrayColor } from "@/constants/theme";
import { ICON_LINK_ARROW } from "@/constants/images";
import { convertAmount, convertTime } from "@/util/common";
import { RESTAKE_API } from "@/../config";

const ReceiptBox = () => {

    const [restakeInfoJson, setRestakeInfoJson]:any = useState(null);

    const nextYear = useMemo(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return convertTime(date.toString(), false);
    }, [])

    const decimalPoint = useMemo(() => {
        if(restakeInfoJson){
            const reward = restakeInfoJson.minimumRewards;
            if(reward < 10){
                return 6;
            } else if(reward < 100){
                return 5;
            } else if(reward < 1000){
                return 4;
            } else if(reward < 10000){
                return 3;
            } else if(reward < 100000){
                return 2;
            } else if(reward < 1000000){
                return 1;
            }
        }
        return 0;
    }, [restakeInfoJson])

    const restakeInfo = useMemo(() => {
        if(restakeInfoJson){
            return {
                frequency: restakeInfoJson.frequency,
                minimumRewards: convertAmount(restakeInfoJson.minimumRewards, true, decimalPoint),
                expiryDate: nextYear
            }
        }
        return {
            frequency: "4 hours",
            minimumRewards: 10,
            expiryDate: nextYear,
        }
    }, [restakeInfoJson, decimalPoint])
    
    const getRestakeInfo = async() => {
        try {
            const result = await fetch(RESTAKE_API);
            const json = await result.json();
            setRestakeInfoJson(json);
        } catch (error) {
            console.log(error);
        }
    }

    const handleMoveToWeb = () => {

    }

    useEffect(() => {
        getRestakeInfo();
    }, [])

    return (
        <View style={{paddingBottom: 25}}>
            <View style={styles.wrapper}>
                <Text style={styles.text}>Frequency</Text>
                <Text style={styles.text}>{restakeInfo.frequency}</Text>
            </View>
            <View style={styles.wrapper}>
                <Text style={styles.text}>Minimum Reward</Text>
                <Text style={styles.text}>{restakeInfo.minimumRewards + " FCT"}</Text>
            </View>
            <View style={styles.wrapper}>
                <Text style={styles.text}>Expiry Date</Text>
                <Text style={styles.text}>{restakeInfo.expiryDate}</Text>
            </View>
            <View style={[styles.boxH, {justifyContent: "flex-end", paddingTop: 10, paddingBottom: 20}]}>
                <TouchableOpacity style={[styles.boxH, {width: "auto"}]} onPress={handleMoveToWeb}>
                    <Text style={styles.link}>More View</Text>
                    <Image
                        style={styles.arrowIcon}
                        source={ICON_LINK_ARROW}/>
                </TouchableOpacity>
            </View>
            <View style={styles.dashedBorder} />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: 12,
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    text: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextGrayColor,
    },
    boxH: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    link: {
        fontFamily: Lato,
        fontWeight: "normal",
        fontSize: 16,
        color: TextAddressColor,
    },
    arrowIcon: {
        width: 16,
        maxWidth: 16,
        height: 16,
        overflow: 'hidden',
        marginLeft: 2,
    },
    dashedBorder: {
        width: "100%",
        borderColor: BorderColor,
        borderWidth: 1,
        borderStyle: "dashed",
    },
})

export default ReceiptBox;