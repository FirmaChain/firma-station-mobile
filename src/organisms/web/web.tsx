import Container from "@/components/parts/containers/conatainer";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import WebView from "react-native-webview";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.WebScreen>;

interface IProps {
    uri: string;
}

const Web = ({uri}:IProps) => {
    const navigation:ScreenNavgationProps = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            titleOn={false}
            backEvent={handleBack}>
                <WebView
                    source={{uri: uri}}/>
        </Container>
    )
}

export default Web;