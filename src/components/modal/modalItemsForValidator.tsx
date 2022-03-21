import React, { useState } from "react";
import { Pressable, StyleSheet, ScrollView, Text, Image, View } from "react-native";
import { StakeInfo } from "@/hooks/staking/hooks";
import { BorderColor, Lato, TextColor, TextDarkGrayColor, WhiteColor } from "@/constants/theme";
import { NO_DELEGATION } from "@/constants/common";
import { Person, Radio } from "../icon/icon";

interface Props {
    initVal: string;
    data: Array<StakeInfo>;
    onPressEvent: Function;
}

const ModalItemsForValidator = ({initVal, data, onPressEvent}:Props) => {
    const [selected, setSelected] = useState(initVal);

    const handleSelect = (address:string) => {
        onPressEvent && onPressEvent(address);
        setSelected(address);
    }

    return (
        <ScrollView style={[styles.modalContainer, {marginBottom: data.length > 0? 20:10}]}>
            {data.length > 0?
                <>
                {data.map((item, index) => {
                    return(
                        <Pressable key={index} style={styles.modalContentBox} onPress={() => handleSelect(item.validatorAddress)}>
                            {item.avatarURL?
                                <Image
                                    style={styles.avatar}
                                    source={{uri: item.avatarURL}}/>
                                :
                                <View style={styles.icon}>
                                    <Person size={32} color={WhiteColor}/>
                                </View>
                            }
                            <Text style={styles.moniker}>{item.moniker}</Text>
                            <Radio size={20} color={WhiteColor} active={item.validatorAddress === selected} />
                        </Pressable>
                    )
                })}
                </>
                :
                <Text style={styles.notice}>{NO_DELEGATION}</Text>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        maxHeight: 500,
    },
    modalContentBox: {
        width: "100%",
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: .5,
        borderBottomColor: BorderColor,
    },
    avatar: {
        width: 32,
        maxWidth: 32,
        height: 32,
        borderRadius: 50,
        overflow: "hidden",
        marginRight: 10,
    },
    moniker: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: "600",
        color: TextColor,
    },
    icon: {
        marginRight: 10,
    },
    notice: {
        paddingHorizontal: 20,
        paddingTop: 30,
        fontFamily: Lato,
        fontSize: 16,
        textAlign: "center",
        color: TextDarkGrayColor,

    }
})

export default ModalItemsForValidator;