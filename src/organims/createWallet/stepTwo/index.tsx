import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { BgColor } from "@/constants/theme";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import Button from "@/components/button/button";
import MnemonicGrid from "./mnmonicGrid";
import { GUIDE_URI } from "@/../config";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.CreateStepTwo>;

interface Props {
    wallet: any;
}

const StepTwo = ({wallet}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation(); 

    const onMoveToStepThree = () => {
        navigation.navigate(Screens.CreateStepThree, {wallet: wallet});
    }

    const handleMoveToWeb = () => {
        navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["newWallet"]});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Write down seed phrase"
            step={2}
            handleGuide={handleMoveToWeb}
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <>
                    <ScrollView style={styles.contentBox}>
                        <MnemonicGrid mnemonic={wallet.mnemonic}/>
                    </ScrollView>
                    <View style={styles.buttonBox}>
                        <Button title='I have written down my seed' active={true} onPressEvent={onMoveToStepThree} />
                    </View>
                    </>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    contentBox: {
        marginVertical: 20,
    },
    buttonBox: {
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    }
})

export default StepTwo;