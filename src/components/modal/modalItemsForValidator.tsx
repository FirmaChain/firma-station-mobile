import { StakeInfo } from "@/hooks/staking/hooks";
import MonikerSection from "@/organims/staking/parts/list/monikerSection";
import React, { useState } from "react";
import { Pressable, StyleSheet, ScrollView, Text, Image, View } from "react-native";
import Radio from "react-native-vector-icons/MaterialCommunityIcons";
import { BorderColor, Lato, TextColor, WhiteColor } from "../../constants/theme";
import { Person } from "../icon/icon";

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
        <ScrollView style={styles.modalContainer}>
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
                        <Radio name={item.validatorAddress === selected? "radiobox-marked" : "radiobox-blank"} size={20} color={WhiteColor} />
                    </Pressable>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        paddingVertical: 20,
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
})

export default ModalItemsForValidator;