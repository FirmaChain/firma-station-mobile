import React, { useState } from "react";
import { Pressable, StyleSheet, ScrollView, Text } from "react-native";
import { BorderColor, Lato, TextColor, WhiteColor } from "@/constants/theme";
import { Radio } from "../icon/icon";

interface Props {
    initVal: number;
    data: any[];
    onPressEvent: (index:number) => void;
}

const ModalItems = ({initVal, data, onPressEvent}:Props) => {
    const [selected, setSelected] = useState(initVal);

    const handleSelect = (index:number) => {
        onPressEvent(index);
        setSelected(index);
    }

    return (
        <ScrollView style={styles.modalContainer}>
            {data.map((item, index) => {
                return(
                    <Pressable key={index} style={styles.modalContentBox} onPress={() => handleSelect(index)}>
                        <Text style={styles.itemTitle}>{item}</Text>
                        <Radio size={20} color={WhiteColor} active={index === selected} />
                    </Pressable>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        marginBottom: 20,
        maxHeight: 500,
    },
    modalContentBox: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        borderBottomWidth: .5,
        borderBottomColor: BorderColor,
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: "normal",
        color: TextColor,
    },
})

export default ModalItems;