import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BoxColor, DisableColor, Lato, PointLightColor, TextCatTitleColor, TextColor, TextDarkGrayColor, TextDisableColor, TextGrayColor } from "../../constants/theme";
import MonikerSection from "./parts/list/monikerSection";
import DataSection from "./parts/list/dataSection";

interface Props {
    validators: Array<any>;
    navigateValidator: Function;
}

const DelegationList = ({validators, navigateValidator}:Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List 
                    <Text style={{color: PointLightColor}}> 30</Text>
                </Text>
            </View>
            {validators.map((vd, index) => {
                if(index < 5){
                    return (
                        <TouchableOpacity key={index} onPress={() => navigateValidator(vd)}>
                            <View style={[styles.item]}>
                                <MonikerSection validator={vd} />
                                <DataSection title="Delegated" data="100.00 FCT" />
                                <DataSection title="Reward" data="100.00 FCT" />
                                <View style={{paddingBottom: 22}} />
                                {index < 4 && <View style={styles.divider} />}
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
        borderRadius: 4,
        overflow: "hidden",
        justifyContent: 'center',
        marginBottom: 20,
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: BoxColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    item : {
        paddingTop: 22,
        backgroundColor: BoxColor,
    },
    title: {
        flex: 2,
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
    },
    divider: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: DisableColor,
    }
})

export default DelegationList;