import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { BgColor, BorderColor, BoxColor, ContainerColor, Lato, TextCatTitleColor, TextColor, TextGrayColor } from "../../constants/theme";
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
    validators: Array<any>;
    navigateValidator: Function;
}

const DelegationList = ({validators, navigateValidator}:Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My delegations</Text>
                <Text style={styles.columns}>Delegated</Text>
                <Text style={styles.columns}>Reward</Text>
            </View>
            {validators.map((vd, index) => {
                if(index < 5){
                    return (
                        <TouchableOpacity key={index} onPress={() => navigateValidator(vd)}>
                            <View key={index} style={styles.item}>
                                <View style={[styles.vdWrapperH, {alignItems: "center"}]}>
                                    <View style={styles.moniikerWrapperH}>
                                    {vd.validatorAvatar?
                                    <Image
                                        style={styles.avatar}
                                        source={{uri: vd.validatorAvatar}}/>
                                    :
                                    <Icon style={styles.icon} name="person" size={35} />
                                    }
                                    <Text style={[styles.columns, {color: TextColor, textAlign: "left"}]}>{vd.validatorMoniker}</Text>
                                    </View>
                                    <Text style={[styles.columns, {color: TextColor}]}>123</Text>
                                    <Text style={[styles.columns, {color: TextColor}]}>123</Text>
                                </View>
                                {index < validators.length - 1 && <View style={styles.divider} />}
                            </View>
                        </TouchableOpacity>
                    )
                }
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 4,
        overflow: "hidden",
        justifyContent: 'center',
        marginBottom: 20,
    },
    header: {
        height: 50,
        paddingHorizontal: 20,
        backgroundColor: BoxColor,
        borderBottomColor: BgColor,
        borderBottomWidth: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    item : {
        backgroundColor: BoxColor,
    },
    title: {
        flex: 2,
        fontFamily: Lato,
        color: TextCatTitleColor,
        fontWeight: 'bold'
    },
    columns: {
        flex: 1,
        textAlign: "right",
        fontFamily: Lato,
        color: TextCatTitleColor,
    },
    vdWrapperH: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    moniikerWrapperH: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 35,
        maxWidth: 35,
        height: 35,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 10,
    },
    icon: {
        marginRight: 10,
    },
    divider: {
        height: .5,
        backgroundColor: BgColor,
    }
})

export default DelegationList;