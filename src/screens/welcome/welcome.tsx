import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import { Screens, StackParamList } from "../../navigators/appRoutes";
import Button from "../../components/button/button";
import Description from "../../organims/welcome/description";
import { getChain } from "../../util/secureKeyChain";
import { BgColor, DisableColor, Lato, TextGrayColor } from "../../constants/theme";
import ViewContainer from "@/components/parts/containers/viewContainer";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

interface WelcomeScreenProps {
    navigation: ScreenNavgationProps;
}

const WelcomeScreen: React.FunctionComponent<WelcomeScreenProps> = (props) => {
    const {navigation} = props;
    const Title: string = 'CONNECT';
    const Desc: string = 'Use seed phrases to create\nnew wallets or restore existing wallets.';
    const [walletExist, setWalletExist] = useState(false);

    function handleCreateStepOne(){
        navigation.navigate(Screens.CreateStepOne, {});
    }

    function handleSelectWallet(){
        navigation.navigate(Screens.SelectWallet);
    }

    function handleRecoverWallet(){
        navigation.navigate(Screens.RecoverWallet);
    }

    const isWalletExist = async() => {
        await getChain('test_3').then(res => {
            if(res === false) return setWalletExist(false);
            return setWalletExist(true);
        }).catch(error => {
            console.log('error : ' + error);
        })
    }

    useEffect(() => {
        isWalletExist();
        return () => {
            setWalletExist(false);
        }
    }, [])

    return (
        <ViewContainer bgColor={BgColor}>
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
        </ViewContainer>
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

export default WelcomeScreen;