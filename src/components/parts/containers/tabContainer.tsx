import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { BgColor, GrayColor, Lato, TextColor, WhiteColor } from "@/constants/theme";
import { ICON_HISTORY } from "@/constants/images";
import { QuestionFilledCircle, Setting } from "@/components/icon/icon";
import { useAppSelector } from "@/redux/hooks";
import NetworkBadge from "../networkBadge";

interface Props {
    title: string;
    settingNavEvent: Function;
    historyNavEvent: Function;
    handleGuide?: ()=>void;
    children: JSX.Element;
}

const TabContainer = ({title, settingNavEvent, historyNavEvent, handleGuide, children}:Props) => {

    const {storage: common} = useAppSelector(state => state);
    
    const handleMoveToSetting = () => {
        settingNavEvent && settingNavEvent();
    }

    const handleMoveToHistory = () => {
        historyNavEvent && historyNavEvent();
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <View style={[styles.boxH, {paddingLeft: 10}]}>
                    <Text style={[styles.title, {paddingLeft: 10}]}>{title}</Text>
                    {handleGuide &&
                    <TouchableOpacity style={styles.guide} onPress={()=>handleGuide()}>
                        <QuestionFilledCircle size={18} color={GrayColor}/>
                    </TouchableOpacity>
                    }
                </View>

                <View style={[styles.boxH, {justifyContent: "flex-end", paddingRight: 10}]}>
                    <TouchableOpacity style={{paddingLeft: 10, paddingRight: 10, marginRight: 10}} onPress={() => handleMoveToHistory()}>
                        <Image style={{width: 30, height: 30, resizeMode: "contain"}} source={ICON_HISTORY} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{paddingLeft: 5, paddingRight: 10}} onPress={() => handleMoveToSetting()}>
                        <Setting size={30} color={WhiteColor} />
                    </TouchableOpacity>
                </View>
                {common.network !== "MainNet" &&
                    <NetworkBadge top={-20} title={common.network} />
                }
            </View>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.select({android: 0, ios: getStatusBarHeight()}),
        backgroundColor: BgColor,
    },
    boxH: {
        flexDirection: "row",
        alignItems: "center",
    },
    titleContainer: {
        width: "100%",
        height: 50,
        backgroundColor: BgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
    },
    title: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: 'bold',
        color: TextColor,
    },
    guide: {
        paddingLeft: 5,
        paddingRight: 10,
        paddingVertical: 10,
        marginTop: 3,
    }
})

export default TabContainer;