import React, { useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { CHECK_MNEMONIC, CHECK_PRIVATEKEY, RECOVER_WALLET_FAILED } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { waitForNextFrame } from '@/util/common';
import { mnemonicCheck, privateKeyCheck } from '@/util/firma';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Button from '@/components/button/button';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';

import InputBox from './inputBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.StepRecover>;

interface IProps {
    type: 'mnemonic' | 'privateKey';
}

const StepRecover = ({ type }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const { loading } = useAppSelector((state) => state.common);

    const [recoverValue, setRecoverValue] = useState('');

    const handleRecoverValue = (value: string) => {
        setRecoverValue(value);
    };

    const handleRecover = async () => {
        const loadingRequestId = CommonActions.beginLoadingProgress();
        try {
            if (loading) return;

            await waitForNextFrame();

            let recover = false;
            if (type === 'mnemonic') {
                recover = await mnemonicCheck(recoverValue);
            }
            if (type === 'privateKey') {
                recover = await privateKeyCheck(recoverValue);
            }

            if (recover === false) {
                const message = type === 'mnemonic' ? CHECK_MNEMONIC : CHECK_PRIVATEKEY;
                return Toast.show({
                    type: 'error',
                    text1: message
                });
            }
            navigation.navigate(Screens.CreateStepOne, { recoverValue: recoverValue });
        } catch (error) {
            console.log('[StepRecover] error : ', error);
            Toast.show({
                type: 'error',
                text1: RECOVER_WALLET_FAILED
            });
        } finally {
            CommonActions.endLoadingProgress(loadingRequestId);
        }
    };

    const handleMoveToWeb = () => {
        Linking.openURL(GUIDE_URI.recoverWallet);
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
        padding: 20,
        paddingBottom: 0
    }
});

export default StepRecover;
