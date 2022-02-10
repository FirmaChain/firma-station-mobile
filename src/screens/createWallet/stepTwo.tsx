import { BgColor } from "@/constants/theme";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useContext } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Button from "@/components/button/button";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import MnemonicGrid from "@/organims/createWallet/stepTwo/mnmonicGrid";
import { useFocusEffect } from "@react-navigation/native";
import { AppContext } from "@/util/context";
import { CONTEXT_ACTIONS_TYPE } from "@/constants/common";

type CreateStepTwoScreenNavigationProps = StackNavigationProp<StackParamList, Screens.CreateStepTwo>;

export type CreateStepTwoParams = {
    wallet: any;
}

interface CreateStepTwoScreenProps {
    route: {params: CreateStepTwoParams};
    navigation: CreateStepTwoScreenNavigationProps;
}

const CreateStepTwoScreen: React.FunctionComponent<CreateStepTwoScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {wallet} = params;

    const {dispatchEvent} = useContext(AppContext);

    const onMoveToStepThree = () => {
        navigation.navigate(Screens.CreateStepThree, {wallet: wallet});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
        }, [])
    )

    return (
        <Container
            title="Write down seed phrase"
            step={2}
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

export default CreateStepTwoScreen;

