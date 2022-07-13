import React, { useState } from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "@/constants/theme";
import { IValidatorDescription } from "@/hooks/staking/hooks";
import { VALIDATOR_PROFILE } from "@/constants/images";

interface IProps {
    validator: IValidatorDescription;
}

const DescriptionBox = ({validator}:IProps) => {
    const [avatarError, setAvatarError] = useState(false);

    const handleUrl = async(url:string) => {
        let urlValid = url;
        if(urlValid.includes("://") === false) urlValid = "https://" + urlValid;
        await Linking.openURL(urlValid);
    }

    return (
        <View style={[styles.boxH, {backgroundColor: BoxColor, paddingHorizontal: 20, paddingTop: 10}]}>
            <View style={{height: "100%", justifyContent: "flex-start"}}>
            <Image 
                style={styles.avatar} 
                onError={() => {setAvatarError(true)}}
                source={(avatarError || validator.avatar === null || validator.avatar === "")?VALIDATOR_PROFILE:{uri: validator.avatar}}/>
            </View>
            <View style={[styles.boxV, {flex: 1}]}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.moniker, {paddingBottom: (validator.description || validator.website)?8:0}]}>{validator.moniker}</Text>
                {validator.description && <Text style={styles.desc}>{validator.description}</Text>}
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
        alignItems: "center",
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