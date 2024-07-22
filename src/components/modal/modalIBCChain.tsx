import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Text, Platform, View, Pressable } from "react-native";
import { BgColor, BoxDarkColor, Lato, TextColor, WhiteColor } from "@/constants/theme";
import { Radio } from "../icon/icon";
import { IbcChainState } from "../../../config";

interface IProps {
    data: IbcChainState[];
    selectChain: IbcChainState | null;
    onPressEvent: (chain: IbcChainState) => void;
}

const ModalIBCChain = ({ data, selectChain, onPressEvent }: IProps) => {
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        if (selectChain === null) return;
        const index = data.findIndex(chain => chain.channel === selectChain.channel);
        setSelected(index < 0 ? null : index);
    }, [selectChain, data])

    return (
        <ScrollView style={styles.modalContainer}>
            {data.map((item, index) => {
                return (
                    <Pressable key={index} style={styles.modalContentBox} onPress={() => onPressEvent(item)}>
                        <View style={styles.itemWrapper}>
                            <Text style={styles.itemTitle}>{`${item.name.toUpperCase()} (${item.channel})`}</Text>
                        </View>
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
        marginBottom: Platform.select({ android: 0, ios: 25 }),
        maxHeight: 500,
        backgroundColor: BoxDarkColor,
    },
    modalContentBox: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        marginBottom: 1,
        backgroundColor: BgColor,
    },
    itemWrapper: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-start",
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: "normal",
        color: TextColor,
    },
    itemSubTitle: {
        fontFamily: Lato,
        fontSize: 11,
        fontWeight: "normal",
        color: TextColor,
        opacity: .5,
        paddingLeft: 5,
        paddingBottom: 1,
    }
})

export default ModalIBCChain;