import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { BgColor, Lato, TextColor, WhiteColor } from "../../../constants/theme";
import SettingIcon from 'react-native-vector-icons/AntDesign';
import { ScreenWidth } from "../../../util/getScreenSize";

interface Props {
    title: string;
    navEvent: Function;
    children: JSX.Element;
}

const TabContainer = ({title, navEvent, children}:Props) => {
    const handleMoveToSetting = () => {
        navEvent && navEvent();
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() => handleMoveToSetting()}>
                    <SettingIcon name='setting' size={25} color={WhiteColor}/>
                </TouchableOpacity>
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