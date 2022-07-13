import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BgColor, BoxColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from "@/constants/theme";
import DelegationList from "../parts/delegation/delegationList";
import ValidatorList from "../parts/validator/validatorList";

interface IProps {
    isRefresh: boolean;
    handleIsRefresh: (refresh:boolean) => void;
    navigateValidator: (address:string) => void; 
}

const StakingLists = ({isRefresh, handleIsRefresh, navigateValidator}:IProps) => {
    const [tab, setTab] = useState(0);
    return (
        <View style={styles.listContainer}>
            <View style={styles.tabBox}>
                <TouchableOpacity 
                    style={[styles.tab, {borderBottomColor: tab === 0? WhiteColor:'transparent'}]}
                    onPress={()=>setTab(0)}>
                    <Text style={tab === 0?styles.tabTitleActive:styles.tabTitleInactive}>My Stakings</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.tab, {borderBottomColor: tab === 1? WhiteColor:'transparent'}]}
                    onPress={()=>setTab(1)}>
                    <Text style={tab === 1?styles.tabTitleActive:styles.tabTitleInactive}>Validator</Text>
                </TouchableOpacity>
            </View>
            <DelegationList 
                visible={tab === 0}
                isRefresh={isRefresh}
                handleIsRefresh={handleIsRefresh}
                navigateValidator={navigateValidator}/>
            <ValidatorList 
                visible={tab === 1}
                isRefresh={isRefresh}
                handleIsRefresh={handleIsRefresh}
                navigateValidator={navigateValidator}/>
        </View>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 15,
        backgroundColor: BoxColor,
    },
    tabBox: {
        height: 58,
        marginHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BgColor,
        borderBottomWidth: 1,
        borderBottomColor: DisableColor,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    tab: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 3,
    },
    tabTitleActive: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        fontWeight: "bold",
        paddingTop: 3,
    },
    tabTitleInactive: {
        fontFamily: Lato,
        fontSize: 16,
        color: InputPlaceholderColor,
        paddingTop: 3,
    }
})


export default StakingLists;