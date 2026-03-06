import React from 'react';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';

import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Deposit>;

interface IProps {
    navigation: ScreenNavgationProps;
}

export type DepositParams = {
    proposalId: number;
};

const DepositScreen = (props: IProps) => {
    const { navigation } = props;

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container title="Deposit" backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View></View>
            </ViewContainer>
        </Container>
    );
};

export default DepositScreen;
