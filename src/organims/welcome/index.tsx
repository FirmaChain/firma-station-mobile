import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useAppSelector } from "@/redux/hooks";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { DisableColor, FailedColor, Lato, TextGrayColor } from "@/constants/theme";
import { WELCOME_DESCRIPTION } from "@/constants/common";
import Button from "@/components/button/button";
import Description from "./description";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

interface Props {
    walletExist: boolean;
}

const Welcome = (props:Props) => {
    const {walletExist} = props;
    const navigation: ScreenNavgationProps = useNavigation();

    const {common} = useAppSelector(state => state);

    const Title: string = 'CONNECT';
    const Desc: string = WELCOME_DESCRIPTION;

    function handleCreateStepOne(){
        navigation.navigate(Screens.CreateStepOne, {});
    }

    function handleSelectWallet(){
        navigation.navigate(Screens.SelectWallet);
    }

    function handleRecoverWallet(){
        navigation.navigate(Screens.RecoverWallet);
    }

    return (
        <View style={styles.viewContainer}>
            <Text style={styles.network}>{common.network !== "MainNet" && common.network}</Text>
            <Description title={Title} desc={Desc} />
            <View style={styles.buttonBox}>
                {walletExist && 
                <View style={{paddingBottom: 10}}>
                    <Button title={'Select Wallet'} active={true}onPressEvent={handleSelectWallet}/>
                </View>}
                <Button title={'New Wallet'} active={true} border={true} onPressEvent={handleCreateStepOne} />
                <View style={styles.dividerWrapper}>
                    <View style={styles.divider}/>
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider}/>
                </View>
                <Button title={'Recover Wallet'} active={true} border={true} onPressEvent={handleRecoverWallet} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: Platform.select({android: 0, ios: getStatusBarHeight()}),
    },
    network: {
        width: "100%",
        height: 25,
        fontFamily: Lato, 
        fontSize: 14,
        textAlign: "right", 
        color: FailedColor,
        paddingHorizontal: 20,
    },
    buttonBox: {
        width: "100%", 
        paddingHorizontal: 20, 
        flex: 1, 
        justifyContent: "flex-end"
    },
    dividerWrapper: {
        height: 17,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 14,
    },
    divider: {
        flex:1,
        height: 1,
        backgroundColor: DisableColor,
    },
    dividerText: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextGrayColor,
        paddingHorizontal: 18,
    }
})

export default Welcome;