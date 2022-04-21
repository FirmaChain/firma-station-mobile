import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HistoryListState } from "@/hooks/wallet/hooks";
import { ForwardArrow } from "@/components/icon/icon";
import { BoxColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "@/constants/theme";
import { convertTime } from "@/util/common";
import { EXPLORER_URL, HISTORY_NOT_EXIST } from "@/constants/common";

interface Props {
    historyList: HistoryListState;
    pagination: number;
    handleExplorer: (uri:string)=>void;
}

const HistoryList = ({historyList, pagination, handleExplorer}:Props) => {
    return (
        <View style={styles.container}>
            {historyList.list.length > 0?
            historyList.list.map((value:any, index) => {
                if(index < pagination){
                return (
                    <TouchableOpacity key={index} onPress={()=>handleExplorer(EXPLORER_URL() + '/transactions/' + value.hash)}>
                        <View style={styles.box}>
                            <View style={styles.wrapperH}>
                                <View style={{flex: 2}}>
                                    <View style={[styles.wrapperH, {alignItems: "center", paddingBottom: 15}]}>
                                        <Text style={[styles.contentTitle, {fontSize: 10, fontWeight: "normal"}]}>{convertTime(value.timestamp, true, false)}</Text>
                                    </View>
                                    <View style={[styles.wrapperH, styles.wrapper, {flex: 4, justifyContent: "flex-start", alignItems: "flex-start"}]}>
                                        <View style={[styles.historyWrapper, {flex: 1}]}>
                                            <Text style={[styles.contentTitle, {fontSize: 14}]}>Block</Text>
                                            <Text style={[styles.contentItem, {fontSize: 14}]}>{value.block}</Text>
                                        </View>
                                        <View style={[styles.historyWrapper, {flex: 2, paddingHorizontal: 10}]}>
                                            <Text style={[styles.contentTitle, {fontSize: 14}]}>Type</Text>
                                            <Text style={[styles.contentItem, 
                                                {fontSize: 14, 
                                                paddingHorizontal: 5,
                                                color: value.type.tagTheme, 
                                                backgroundColor: value.type.tagTheme+"26",
                                                borderRadius: 6,
                                                overflow: "hidden"}]}>{value.type.tagDisplay}</Text>
                                        </View>
                                        <View style={[styles.historyWrapper, {flex: 1}]}>
                                            <Text style={[styles.contentTitle, {fontSize: 14}]}>Result</Text>
                                            <Text style={[styles.contentItem, {fontSize: 14}]}>{value.success}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{justifyContent: "center"}}>
                                    <ForwardArrow size={20} color={TextCatTitleColor}/>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }})
            :
            <View style={{flex:1, justifyContent: "center"}}>
                <Text style={styles.notice}>{HISTORY_NOT_EXIST}</Text>
            </View>
        }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"space-between",
        margin: 20,
    },
    historyWrapper: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    box: {
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    wrapperH: {
        flexDirection: "row",
    },
    wrapper: {
        paddingBottom: 5,
    },
    contentItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextColor,
        marginTop: 6,
        paddingVertical: 5,
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "bold",
        color: TextDarkGrayColor,
    },
    notice: {
        textAlign: "center",
        fontFamily: Lato,
        fontSize: 18,
        color: TextDarkGrayColor,
        opacity: .8,
    }
})

export default HistoryList;