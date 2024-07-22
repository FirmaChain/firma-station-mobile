import React, { useCallback, } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useBalanceData } from '@/hooks/wallet/hooks';
import { BgColor } from '@/constants/theme';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import { IBCTokenState } from '@/context/ibcTokenContext';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Send>;

interface IProps {
    tokenData: IBCTokenState;
}

export type SendType = 'SEND_TOKEN' | 'SEND_IBC'

const SendIBC = ({ tokenData }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { balance, getBalance } = useBalanceData();

    const handleBack = () => {
        navigation.goBack();
    };

    useFocusEffect(
        useCallback(() => {
            getBalance();
        }, [])
    );

    return (
        <Container title="Send" backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>

                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
});

export default SendIBC;
