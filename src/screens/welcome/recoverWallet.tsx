import React from "react";
import { Screens, StackParamList } from "@/navigators/stackNavigators";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor, BoxColor, Lato, TextWarnColor } from "@/constants/theme";
import Button from "@/components/button/button";
import { RECOVER_INFO_MESSAGE } from "@/constants/common";

type RecoverWalletScreenNavigationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

interface RecoverWalletScreenProps {
    navigation: RecoverWalletScreenNavigationProps;
}

const RecoverWalletScreen: React.FunctionComponent<RecoverWalletScreenProps> = (props) => {
    const {navigation} = props;

    const handleBack = () => {
        navigation.goBack();
    }

    const handleRecoverViaSeed = () => {
        navigation.navigate(Screens.StepRecover);
    }

    return (
        <Container
            title="Recover Wallet"
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <View style={{paddingBottom: 20}}>
                            <Button
                                title="Use seed phrase"
                                active={true}
                                border={true}
                                onPressEvent={handleRecoverViaSeed}/>
                        </View>
                        <View style={{paddingBottom: 20}}>
                            <Button
                                title="Scan QR code"
                                active={true}
                                border={true}
                                onPressEvent={handleRecoverViaSeed}/>
                        </View>

                        <View style={styles.wranContainer}>
                            <Text style={styles.warnText}>{RECOVER_INFO_MESSAGE}</Text>
                        </View>
                    </View>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    wranContainer: {
        fontFamily: Lato,
        backgroundColor: BoxColor,
        borderRadius: 4,
        padding: 20,
        overflow: 'hidden',
    },
    warnText: {
        fontSize: 14,
        lineHeight: 20,
        color: TextWarnColor,
    }
})

export default RecoverWalletScreen;