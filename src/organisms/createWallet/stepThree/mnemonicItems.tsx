import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BoxColor, Lato, TextColor } from "@/constants/theme";
import { ScreenWidth } from "@/util/getScreenSize";

interface Props {
    mnemonicItems: string[];
    onPressEvent: Function;
}

const MnemonicItems = ({mnemonicItems, onPressEvent}:Props) => {
    const onPress = (index: number) => {
        onPressEvent(index);
    }

    return (
        <View style={styles.conatainer}>
            {mnemonicItems.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index} 
                        onPress={() => onPress(index)}>
                        <Text style={[styles.item, {width: (ScreenWidth() / 3) - 20}]}>{item}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default MnemonicItems;

const styles = StyleSheet.create({
    conatainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        marginVertical: 5,
        paddingVertical: 13,
        borderRadius: 4,
        fontFamily: Lato,
        backgroundColor: BoxColor,
        color: TextColor,
        textAlign: 'center',
        fontSize: 16,
        overflow: 'hidden',
    }
})