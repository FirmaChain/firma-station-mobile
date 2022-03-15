import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "@/components/button/button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { WELCOME_DESCRIPTION } from "@/constants/common";
import { BgColor, DisableColor, Lato, TextGrayColor } from "@/constants/theme";
import Description from "./description";
import { CommonActions } from "@/redux/actions";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

interface Props {
    walletExist: boolean;
}

const Welcome = (props:Props) => {
    const {walletExist} = props;
    const navigation: ScreenNavgationProps = useNavigation();

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

    useEffect(() => {
        CommonActions.handleNetwork("MainNet");
    }, [])

    return (
        <View style={styles.viewContainer}>
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
    container: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BgColor,
    },
    viewContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
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