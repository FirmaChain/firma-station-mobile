import React from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BgColor } from "@/constants/theme";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Deposit>;

export type DepositParams = {
    proposalId: number;
}

interface Props {
    navigation: ScreenNavgationProps;
}

const DepositScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation} = props;

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Deposit"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View>

                </View>
            </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
})

export default DepositScreen;