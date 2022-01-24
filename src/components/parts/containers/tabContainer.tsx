import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { BgColor, Lato, TextColor, WhiteColor } from "../../../constants/theme";
import Icon from 'react-native-vector-icons/AntDesign';
import { ICON_HISTORY } from "@/constants/images";

interface Props {
    title: string;
    navEvent: Function;
    children: JSX.Element;
}

const TabContainer = ({title, navEvent, children}:Props) => {
    const handleMoveToSetting = () => {
        navEvent && navEvent();
    }

    const handleMoveToHistory = () => {

    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.boxH}>
                    <TouchableOpacity style={{marginRight: 20}} onPress={() => handleMoveToHistory()}>
                        <Image style={{width: 30, height: 30, resizeMode: "contain"}} source={ICON_HISTORY} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleMoveToSetting()}>
                        <Icon name='setting' size={30} color={WhiteColor}/>
                    </TouchableOpacity>
                </View>
            </View>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
        backgroundColor: BgColor,
    },
    boxH: {
        flexDirection: "row",
        alignItems: "center",
    },
    titleContainer: {
        height: 50,
        backgroundColor: BgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: 'bold',
        color: TextColor,
    }
})

export default TabContainer;