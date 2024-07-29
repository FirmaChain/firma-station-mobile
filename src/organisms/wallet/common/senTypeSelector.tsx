import React, { useEffect, useState } from "react";
import { BoxColor, PointColor, TextColor, TextGrayColor } from "@/constants/theme";
import { ScreenWidth } from "@/util/getScreenSize";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type SendType = 'SEND_TOKEN' | 'SEND_IBC'

interface IProps {
    type: SendType;
    handleType: (type: SendType) => void;
}

const SendTypeSelector = ({ type, handleType }: IProps) => {
    const screenWidth = ScreenWidth();

    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: type === 'SEND_TOKEN' ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [type]);

    const interpolatedBackground = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [PointColor, PointColor],
    });

    const interpolatedPosition = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, screenWidth / 2 - 25],
    });

    return (
        <View style={styles.tabContainer}>
            <Animated.View
                style={[
                    styles.selectTabBackground,
                    {
                        backgroundColor: interpolatedBackground,
                        transform: [
                            {
                                translateX: interpolatedPosition,
                            },
                        ],
                    },
                ]}
            />
            <TouchableOpacity
                style={[styles.tab, type === 'SEND_TOKEN' && styles.activeTab]}
                onPress={() => handleType('SEND_TOKEN')}
            >
                <Text style={[styles.tabText, type === 'SEND_TOKEN' && styles.activeTabText]}>{'Send'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, type === 'SEND_IBC' && styles.activeTab]}
                onPress={() => handleType('SEND_IBC')}
            >
                <Text style={[styles.tabText, type === 'SEND_IBC' && styles.activeTabText]}>{'IBC Send'}</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BoxColor,
        borderRadius: 5,
        padding: 5,
        marginBottom: 20,
    },
    selectTabBackground: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        left: 5,
        borderRadius: 5,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    activeTab: {
    },
    tabText: {
        textAlign: 'center',
        color: TextGrayColor,
    },
    activeTabText: {
        color: TextColor,
        fontWeight: 'bold'
    },
});


export default SendTypeSelector