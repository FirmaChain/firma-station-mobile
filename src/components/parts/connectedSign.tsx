import React, { useEffect, useRef } from 'react';
import { IBCConnectedColor } from '@/constants/theme';
import { Animated, StyleSheet, Text, View } from 'react-native';

const ConnectedSign = () => {
    const sizeAnim = useRef(new Animated.Value(5)).current;

    useEffect(() => {
        const animateSize = Animated.sequence([
            Animated.timing(sizeAnim, {
                toValue: 12,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(sizeAnim, {
                toValue: 5,
                duration: 500,
                useNativeDriver: false
            })
        ]);

        Animated.loop(Animated.parallel([animateSize])).start();
    }, [sizeAnim]);

    const animatedStyle = {
        width: sizeAnim,
        height: sizeAnim
    };

    const inlineStyles1 = {
        inlineStyle1: { width: animatedStyle.width, height: animatedStyle.height }
    } as const;

    return (
        <View style={styles.connectedWrap}>
            <View style={styles.dotWrap}>
                <Animated.View style={[styles.dotShadow, inlineStyles1.inlineStyle1]} />
                <View style={styles.dot} />
            </View>
            <Text style={styles.connectedTitle}>{'LIVE'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    connectedWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    connectedTitle: {
        fontFamily: 'Lato',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: IBCConnectedColor,
        paddingLeft: 6
    },
    dotWrap: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    dotShadow: {
        position: 'absolute',
        backgroundColor: IBCConnectedColor + 30,
        borderRadius: 100
    },
    dot: {
        width: 5,
        height: 5,
        backgroundColor: IBCConnectedColor,
        borderRadius: 100
    }
});

export default ConnectedSign;
