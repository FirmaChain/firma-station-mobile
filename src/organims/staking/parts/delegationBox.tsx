import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SmallButton from "../../../components/button/smallButton";
import { ContainerColor } from "../../../constants/theme";

interface Props {
    handleDelegate:Function;
}

const DelegationBox = ({handleDelegate}:Props) => {

    const onPressEvent = (type:string) => {
        handleDelegate(type);
    }

    return (
        <View style={styles.delegationBox}>
            <View style={styles.boxH}>
                <Text>My Delegation</Text>
                <Text>0.00 FCT</Text>
            </View>
            <View style={styles.boxH}>
                <SmallButton
                    title={"Delegate"}
                    onPressEvent={() => onPressEvent('Delegate')}/>
                <SmallButton
                    title={"Redelegate"}
                    onPressEvent={() => onPressEvent('Redelegate')}/>
                <SmallButton
                    title={"Undelegate"}
                    onPressEvent={() => onPressEvent('Undelegate')}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    delegationBox: {
        marginHorizontal: 20,
        marginVertical: 10,
        borderColor: ContainerColor, 
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    boxH: {
        width: "100%",
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    }
})

export default DelegationBox;