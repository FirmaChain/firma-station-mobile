import { ForwardArrow } from "@/components/icon/icon";
import React, { useMemo } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoxColor, ContainerColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "../../constants/theme";

interface Props {
    history?: [any];
}

const HistoryBox = ({history}:Props) => {

    const historyData = useMemo(() => {
        if(history !== undefined) return history;
        return [
            {
                block : 123123,
                type : 'Send',
                hash : '45CA3540A95F6D10E642560E3965159E564BABBAAB8C736950E649E30E772440',
                result : 'Success',
                time : '2022-01-06 13:02:00',
            },
            {
                block : 123123,
                type : 'Send',
                hash : '45CA3540A95F6D10E642560E3965159E564BABBAAB8C736950E649E30E772440',
                result : 'Success',
                time : '2022-01-06 13:02:00',
            },
            {
                block : 123123,
                type : 'Send',
                hash : '45CA3540A95F6D10E642560E3965159E564BABBAAB8C736950E649E30E772440',
                result : 'Success',
                time : '2022-01-06 13:02:00',
            },
            {
                block : 123123,
                type : 'Send',
                hash : '45CA3540A95F6D10E642560E3965159E564BABBAAB8C736950E649E30E772440',
                result : 'Success',
                time : '2022-01-06 13:02:00',
            },
        ]
    }, [history])

    const handleHistory = () => {

    }

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center"}]}>
                    <Text style={styles.title}>Recent History</Text>
                    <TouchableOpacity onPress={()=>handleHistory()}>
                        <ForwardArrow size={20} color={TextCatTitleColor}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.wrapperH, {justifyContent: "flex-start", alignItems: "center" ,paddingTop: 25}]}>
                    <View style={styles.historyWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Block</Text>
                        <Text style={[styles.balance, {fontSize: 18}]}>123123</Text>
                    </View>
                    <View style={styles.historyWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Type</Text>
                        <Text style={[styles.balance, {fontSize: 18}]}>Send</Text>
                    </View>
                </View>
            </View>
        </View>
        // <View style={styles.container}>
        //     {historyData.map((h, index) => {
        //         return (
        //             <View key={index} style={styles.box}>
        //                 <View style={styles.boxH}>
        //                     <View style={styles.wrapper}>
        //                         <Text style={styles.title}>Block</Text>
        //                         <Text style={styles.desc}>{h.block}</Text>
        //                     </View>
        //                     <View style={styles.wrapper}>
        //                         <Text style={styles.title}>Type</Text>
        //                         <Text style={styles.desc}>{h.type}</Text>
        //                     </View>
        //                 </View>
        //                 <View style={styles.boxH}>
        //                     <View style={styles.wrapper}>
        //                         <Text style={styles.title}>Hash</Text>
        //                         <Text numberOfLines={1} ellipsizeMode="middle" style={styles.desc}>{h.hash}</Text>
        //                     </View>
        //                 </View>
        //                 <View style={styles.boxH}>
        //                     <View style={styles.wrapper}>
        //                         <Text style={styles.title}>Result</Text>
        //                         <Text style={styles.desc}>{h.result}</Text>
        //                     </View>
        //                     <View style={styles.wrapper}>
        //                         <Text style={styles.title}>Time</Text>
        //                         <Text style={[styles.desc, {fontSize: 14}]}>{h.time}</Text>
        //                     </View>
        //                 </View>
        //                 {index < historyData.length - 1 && <View style={styles.divider} /> }
        //             </View>
        //         )
        //     })}
        // </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "bold",
        color: TextCatTitleColor,
    },
    balance: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextCatTitleColor,
        paddingTop: 6,
    },
    chainName: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextDarkGrayColor,
    },
    historyWrapper: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    box: {
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30,
    },
    wrapperH: {
        flexDirection: "row",
    },
})

export default HistoryBox;