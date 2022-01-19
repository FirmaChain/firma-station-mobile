import { BgColor, BoxColor, Lato, TextColor, TextGrayColor, WhiteColor } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ScreenWidth } from "../../../util/getScreenSize";

const MnemonicItems: React.FC<{
    mnemonicItems: string[];
    onPressEvent: Function;
}> = ({mnemonicItems, onPressEvent}) => {
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
                        <Text style={[styles.item, {width: (ScreenWidth() / 3) - 40}]}>{item}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default MnemonicItems;

const styles = StyleSheet.create({
    conatainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        margin: 10,
        paddingVertical: 20,
        borderRadius: 4,
        fontFamily: Lato,
        backgroundColor: BoxColor,
        color: TextColor,
        textAlign: 'center',
        fontSize: 12,
        overflow: 'hidden',
    }
})