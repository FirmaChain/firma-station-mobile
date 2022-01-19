import React, { useState } from "react";
import { Pressable, StyleSheet, ScrollView, Text } from "react-native";
import Radio from 'react-native-vector-icons/MaterialCommunityIcons';
import { BorderColor, Lato, TextColor, WhiteColor } from "../../constants/theme";

interface Props {
    initVal: number;
    data: any[];
    onPressEvent: Function;
}

const ModalItems = ({initVal, data, onPressEvent}:Props) => {
    const [selected, setSelected] = useState(initVal);

    const handleSelect = (index:number) => {
        onPressEvent && onPressEvent(index);
        setSelected(index);
    }

    return (
        <ScrollView style={styles.modalContainer}>
            {data.map((item, index) => {
                return(
                    <Pressable key={index} style={styles.modalContentBox} onPress={() => handleSelect(index)}>
                        <Text style={styles.itemTitle}>{item}</Text>
                        <Radio name={index === selected? 'radiobox-marked' : 'radiobox-blank'} size={20} color={WhiteColor} />
                    </Pressable>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        paddingVertical: 20,
    },
    modalContentBox: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
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