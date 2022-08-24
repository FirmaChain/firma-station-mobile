import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderColor, BoxColor, InputPlaceholderColor, Lato, PointLightColor, TextCatTitleColor, TextColor } from "@/constants/theme";
import { RESTAKE_STATUS } from "@/constants/common";
import { ForwardArrow } from "@/components/icon/icon";
import { StakingGrantState } from "@/hooks/staking/hooks";

interface IProps {
    moveToRestake: ()=>void;
    delegationStates: boolean;
    grantStates: StakingGrantState;
}

const RestakeInfoBox = ({moveToRestake, delegationStates, grantStates}:IProps) => {

    const defaultColor = RESTAKE_STATUS['NO_DELEGATION'].color;

    const stakingGrantExist = useMemo(() => {
        if(grantStates.list.length > 0){
            let activation = grantStates.list.filter((value) => value.isActive);
            return activation.length > 0;
        }
        return false;
    }, [grantStates])

    const stakingGrantStatus = useMemo(() => {
        return grantStates;
    }, [stakingGrantExist, grantStates])

    const expiration = useMemo(() => {
        if(stakingGrantExist){
            const today = new Date().getTime();
            const expire = new Date(stakingGrantStatus.expire).getTime();
            
            const diffDate = expire - today;
            const currentDay = 24 * 60 * 60 * 1000;
            const dDay = Math.floor(Math.abs(diffDate/currentDay));

            return dDay;
        }
        return 0;
    }, [stakingGrantStatus])

    const restakeStatus = useMemo(() => {
        if(delegationStates === false){
            return RESTAKE_STATUS['NO_DELEGATION'];
        } else {
            if(stakingGrantExist) {
                return RESTAKE_STATUS['ACTIVE'];
            } else {
                return RESTAKE_STATUS['INACTIVE'];
            }
        }
    }, [delegationStates, stakingGrantStatus]);

    return (
        <TouchableOpacity style={styles.restakeButtonBox} disabled={!delegationStates} onPress={()=>moveToRestake()}>
            <View style={styles.infoBox}>
                <Text style={styles.title}>Restake
                    <Text style={[styles.title, {fontSize: 13, color: InputPlaceholderColor}]}>{' (Beta)'}</Text>
                </Text>
                <View style={[styles.infoBox, {justifyContent: "flex-end", paddingHorizontal: delegationStates?10:0}]}>
                    {stakingGrantExist && <Text style={[styles.label, {backgroundColor: defaultColor + "30", color: defaultColor, marginRight: 6}]}>{"D-" + expiration}</Text>}
                    <Text style={[styles.label, {backgroundColor: restakeStatus.color+"30", color: restakeStatus.color}]}>{restakeStatus.title}</Text>
                </View>
            </View>
            {delegationStates && <ForwardArrow size={20} color={TextCatTitleColor}/>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    restakeButtonBox: {
        padding: 20, 
        marginTop: 12, 
        backgroundColor: BoxColor, 
        borderRadius: 8, 
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "space-between"
    },
    activeInfoBox: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginRight: 15,
    },
    infoBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "space-between",
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        textAlign: "center",
    },
    label: {
        fontFamily: Lato,
        fontSize: 13,
        borderRadius: 10,
        textAlign: "center",
        overflow: "hidden",
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    background: {
        flex: 100,
        height: 6,
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: BorderColor,
        borderRadius: 8,
        position: "relative",
        overflow: "hidden",
    },
    percentage: {
        height: 6,
        borderRadius: 8,
        backgroundColor: PointLightColor,
    },
})

export default RestakeInfoBox;