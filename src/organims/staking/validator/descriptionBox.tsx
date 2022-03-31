import React from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor, WhiteColor } from "@/constants/theme";
import { ValidatorDescription } from "@/hooks/staking/hooks";
import { Person } from "@/components/icon/icon";

interface Props {
    validator: ValidatorDescription;
}

const DescriptionBox = ({validator}:Props) => {

    const handleUrl = async(url:string) => {
        let urlValid = url;
        if(urlValid.includes("://") === false) urlValid = "https://" + urlValid;
        await Linking.openURL(urlValid);
    }

    return (
        <View style={[styles.boxH, {backgroundColor: BoxColor, paddingHorizontal: 20, paddingTop: 10, marginTop: -10}]}>
            {validator.avatar?
            <Image style={styles.avatar} source={{uri: validator.avatar}}/>
            :
            <View style={styles.avatar}>
                <Person size={68} color={WhiteColor}/>
            </View>
            }
            <View style={[styles.boxV, {flex: 1}]}>
                <Text style={styles.moniker}>{validator.moniker}</Text>
                <Text style={styles.desc}>{validator.description}</Text>
                {validator.website &&
                <TouchableOpacity onPress={()=>handleUrl(validator.website)}>
                    <Text style={styles.url}>{validator.website}</Text>
                </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    boxH: {
        flexDirection: "row",
    },
    boxV: {
        alignItems: "flex-start",
    },
    avatar: {
        width: 68,
        height: 68,
        borderRadius: 50,
        overflow: "hidden",
        marginRight: 10,
    },
    moniker: {
        width: "100%",
        fontSize: 24,
        fontFamily: Lato,
        fontWeight: "bold",
        color: TextColor,
        paddingBottom: 8,
    },
    desc: {
        width: "auto",
        color: TextDarkGrayColor,
        fontSize: 16,
        paddingBottom: 12,
    },
    url: {
        width: "100%",
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: DisableColor,
        borderRadius: 4,
        overflow: "hidden",
        color: TextCatTitleColor,
        fontSize: 14,
    },
})

export default DescriptionBox;