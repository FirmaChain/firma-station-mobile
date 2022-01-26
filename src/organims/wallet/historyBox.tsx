import { ForwardArrow } from "@/components/icon/icon";
import { convertTime } from "@/util/common";
import React, { useMemo } from "react"
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoxColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "../../constants/theme";

interface Props {
    recentHistory: any;
}

const HistoryBox = ({recentHistory}:Props) => {
    const historyData = useMemo(() => {
        if(recentHistory !== undefined) return recentHistory;
        return {
            hash: '',
            success: '',
            type: '',
            block: 0,    
        }
        
    }, [recentHistory])

    const moveToExplorer = (hash:string) => {
        Linking.openURL('https://explorer-colosseum.firmachain.dev/transactions/' + hash);
    }

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
                <View style={[styles.wrapperH, styles.wrapper, {justifyContent: "flex-start", alignItems: "center" ,paddingTop: 18}]}>
                    <View style={styles.historyWrapper}>
                        <Text style={[styles.contentTitle, {fontSize: 14}]}>Block</Text>
                        <Text style={[styles.contentItem, {fontSize: 14}]}>{historyData.block}</Text>
                    </View>
                    <View style={styles.historyWrapper}>
                        <Text style={[styles.contentTitle, {fontSize: 14}]}>Type</Text>
                        <Text style={[styles.contentItem, {fontSize: 14}]}>{historyData.type}</Text>
                    </View>
                </View>
                <View style={styles.wrapper}>
                    <View style={styles.historyWrapper}>
                        <Text style={[styles.contentTitle, {fontSize: 14}]}>Hash</Text>
                        <TouchableOpacity onPress={()=>moveToExplorer(historyData.hash)}>
                            <Text 
                                style={[styles.contentItem, {fontSize: 14}]}
                                numberOfLines={1}
                                ellipsizeMode="middle">{historyData.hash}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.wrapperH, styles.wrapper, {justifyContent: "flex-start", alignItems: "center"}]}>
                    <View style={styles.historyWrapper}>
                        <Text style={[styles.contentTitle, {fontSize: 14}]}>Result</Text>
                        <Text style={[styles.contentItem, {fontSize: 14}]}>{historyData.success}</Text>
                    </View>
                    <View style={styles.historyWrapper}>
                        <Text style={[styles.contentTitle, {fontSize: 14}]}>Time</Text>
                        <Text style={[styles.contentItem, {fontSize: 14}]}>{convertTime(historyData.timestamp, false)}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        paddingHorizontal: 20,
        marginBottom: 20,
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
    wrapper: {
        paddingBottom: 20,
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "bold",
        color: TextCatTitleColor,
    },
    contentItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextCatTitleColor,
        paddingTop: 6,
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "bold",
        color: InputPlaceholderColor,
    },
})

export default HistoryBox;