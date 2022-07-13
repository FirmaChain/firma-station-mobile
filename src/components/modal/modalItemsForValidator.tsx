import React, { useState } from "react";
import { Pressable, StyleSheet, ScrollView, Text, Image, View } from "react-native";
import { IStakeInfo } from "@/hooks/staking/hooks";
import { BgColor, BoxColor, BoxDarkColor, Lato, TextCatTitleColor, TextColor, TextWarnColor, WhiteColor } from "@/constants/theme";
import { ExclamationCircle, Radio } from "../icon/icon";
import { VALIDATOR_PROFILE } from "@/constants/images";

interface IProps {
    title: string;
    initVal: string;
    data: Array<IStakeInfo>;
    myAddress: string;
    onPressEvent: Function;
}

const ModalItemsForValidator = ({title, initVal, data, myAddress, onPressEvent}:IProps) => {
    const [selected, setSelected] = useState(initVal);
    const [avatarError, setAvatarError] = useState(false);

    const handleSelect = (address:string) => {
        if(myAddress === address) return;
        onPressEvent && onPressEvent(address);
        setSelected(address);
    }

    return (
        <View style={[styles.modalContainer, {marginBottom: data.length > 0? 20:10}]}>
            <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <ScrollView>
                <View>
                    {data.map((item, index) => {
                        const mine = myAddress === item.validatorAddress;
                        return(
                            <View key={index} style={styles.modalContentBox}>
                                <Pressable onPress={() => handleSelect(item.validatorAddress)}>
                                    <View style={[styles.modalPressBox, mine && {opacity: .15}]}>
                                        <Image
                                            style={styles.avatar}
                                            onError={() => {setAvatarError(true)}}
                                            source={(avatarError || item.avatarURL === null || item.avatarURL === "")?VALIDATOR_PROFILE:{uri: item.avatarURL}}/>
                                        <Text style={styles.moniker}>{item.moniker}</Text>
                                        <Radio size={20} color={WhiteColor} active={item.validatorAddress === selected} />
                                    </View>
                                    <View style={[styles.noticeBox, {display: mine?"flex":"none"}]}>
                                        <ExclamationCircle size={15} color={TextWarnColor} />
                                        <Text style={[styles.notice]}>Not allowed to same validator</Text>
                                    </View>
                                </Pressable>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        maxHeight: 500,
        backgroundColor: BoxDarkColor,
    },
    headerBox: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: BoxColor,
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
    },
    modalContentBox: {
        position: "relative",
        backgroundColor: BgColor,
        marginBottom: 1,
    },
    modalPressBox: {
        width: "100%",
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 1,
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
    noticeBox: {
        width: "100%",
        position: "absolute",
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    notice: {
        fontFamily: Lato,
        fontSize: 16,
        lineHeight: 32,
        textAlign: "center",
        color: TextWarnColor,
        paddingLeft: 5,
    }
})

export default ModalItemsForValidator;