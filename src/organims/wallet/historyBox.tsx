import { ForwardArrow } from "@/components/icon/icon";
import { EXPLORER_URL } from "@/constants/common";
import { convertTime } from "@/util/common";
import React, { useMemo } from "react"
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoxColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "../../constants/theme";

interface Props {
    recentHistory: any;
    handleHistory: Function;
}

const HistoryBox = ({recentHistory, handleHistory}:Props) => {
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
        Linking.openURL(EXPLORER_URL + '/transactions/' + hash);
    }

    const moveToHistory = () => {
        if(recentHistory === undefined) return;
        handleHistory && handleHistory();
    }

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <TouchableOpacity style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center"}]} onPress={()=>moveToHistory()}>
                    <Text style={styles.title}>Recent History</Text>
                    {recentHistory !== undefined &&
                    <ForwardArrow size={20} color={TextCatTitleColor}/>
                    }
                </TouchableOpacity>
                {recentHistory === undefined? 
                <View style={[styles.wrapperH, styles.wrapper, {justifyContent: "center", alignItems: "center" ,paddingTop: 18}]}>
                    <Text style={[styles.contentItem, {fontSize: 14}]}>There's no history yet</Text>
                </View>
                :
                <>
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
                        <Text style={[styles.contentItem, {fontSize: 14}]}>{convertTime(historyData.timestamp, false, true)}</Text>
                    </View>
                </View>
                </>
                }
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