import React, { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@/redux/actions';
import { BgColor, InputBgColor, Lato, TextColor } from '@/constants/theme';
import { CHECK_MNEMONIC, CHECK_PRIVATEKEY, RECOVER_WALLET_FAILED } from '@/constants/common';
import { GUIDE_URI } from '@/../config';
import Button from '@/components/button/button';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import InputBox from './inputBox';
import Toast from 'react-native-toast-message';
import { mnemonicCheck, privateKeyCheck, recoverWallet } from '@/util/firma';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.StepRecover>;

interface IProps {
    type: 'mnemonic' | 'privateKey';
}

const StepRecover = ({ type }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const [recoverValue, setRecoverValue] = useState('');

    const handleRecoverValue = (value: string) => {
        setRecoverValue(value);
    };

    const handleRecover = async () => {
        try {
            CommonActions.handleLoadingProgress(true);
            let recover = false;
            if(type === 'mnemonic'){
                recover = await mnemonicCheck(recoverValue);
            }
            if(type === 'privateKey'){
                recover = await privateKeyCheck(recoverValue);
            }

            CommonActions.handleLoadingProgress(false);
            if (recover === false) {
                let message = type === 'mnemonic' ? CHECK_MNEMONIC : CHECK_PRIVATEKEY;
                return Toast.show({
                    type: 'error',
                    text1: message
                });
            }
            navigation.navigate(Screens.CreateStepOne, { recoverValue: recoverValue });
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            Toast.show({
                type: 'error',
                text1: RECOVER_WALLET_FAILED
            });
        }
    };

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["recoverWallet"]});
        Linking.openURL(GUIDE_URI['recoverWallet']);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container title="Recover Wallet" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <InputBox type={type} handleRecoverValue={handleRecoverValue} />
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Button title="Recover" active={true} onPressEvent={handleRecover} />
                    </View>
                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 3,
        padding: 20
    },
    wrapperH: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    title: {
        color: TextColor,
        fontFamily: Lato,
        fontSize: 14
    },
    inputWrapper: {
        height: 200,
        marginVertical: 20,
        padding: 20,
        backgroundColor: InputBgColor,
        borderWidth: 1,
        borderRadius: 4
    },
    input: {
        color: TextColor,
        flex: 1
    }
});

export default StepRecover;
