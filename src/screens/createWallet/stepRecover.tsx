import React from "react";
import { Screens, StackParamList } from "@/navigators/stackNavigators";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor, BoxColor, Lato, TextGrayColor } from "@/constants/theme";


type StepRecoverScreenNavigationProps = StackNavigationProp<StackParamList, Screens.StepRecover>;

interface StepRecoverScreenProps {
    navigation: StepRecoverScreenNavigationProps;
}

const StepRecoverScreen: React.FunctionComponent<StepRecoverScreenProps> = (props) => {
    const {navigation} = props;

    const handleBack = () => {
        navigation.goBack();
    }

    const handleRecoverViaSeed = () => {

    }

    return (
        <Container
            title="Recover Wallet"
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <View style={styles.wrapperH}>
                            <Text style={styles.title}>Enter seed phrase</Text>
                            <TouchableOpacity>

                            </TouchableOpacity>
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
    wrapperH:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
    },
    title: {
        color: TextGrayColor,
        fontFamily: Lato,
        fontSize: 16,
    }
})

export default StepRecoverScreen;