import React, { useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/redux/hooks';
import { PasswordValidationCheck } from '@/util/validationCheck';
import { getPrivateKeyFromMnemonic, mnemonicCheck } from '@/util/firma';
import { getRecoverValue } from '@/util/wallet';
import { BgColor } from '@/constants/theme';
import { GUIDE_URI } from '@/../config';
import Toast from 'react-native-toast-message';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import Button from '@/components/button/button';
import ExportWalletModal from './exportWalletModal';
import InputBox from './inputBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.ExportWallet>;

interface IProps {
    type: string;
}

const ExportWallet = ({ type }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const { wallet } = useAppSelector((state) => state);

    const exportPK = type === 'ExportPK';
    const titleText = useMemo(() => {
        if (exportPK) return 'Export private key';
        return 'Export mnemonic';
    }, [exportPK]);

    // 0: need to password confirm
    // 1: export privatekey
    const [status, setStatus] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const [privatekey, setPrivatekey] = useState('');
    const [validation, setValidation] = useState(false);

    const handlePassword = (value: string) => {
        setPassword(value);
        setValidation(PasswordValidationCheck(value));
    };

    const handleModalOpen = (open: boolean) => {
        setIsModalOpen(open);
        if (open === false) {
            setStatus(0);
        }
    };

    const exportWallet = async (password: string) => {
        try {
            setMnemonic('');
            setPrivatekey('');
            await getMnemonicFromChain(password);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const getMnemonicFromChain = async (password: string) => {
        try {
            let result = await getRecoverValue(wallet.name, password);
            if (result !== null) {
                handleModalOpen(false);
                if (exportPK) {
                    let isMnemonic = await mnemonicCheck(result);
                    setStatus(1);

                    if (isMnemonic) {
                        const _result = await getPrivateKeyFromMnemonic(result);
                        if (_result) {
                            setPrivatekey(_result);
                        }
                    } else {
                        setPrivatekey(result);
                    }
                    handleModalOpen(true);
                } else {
                    setStatus(1);
                    setMnemonic(result);
                    handleModalOpen(true);
                }
            } else {
                handleModalOpen(true);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const handleMoveToWeb = () => {
        let key = type.toLowerCase();
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[key]});
        Linking.openURL(GUIDE_URI[key]);
    };

    const handleBack = () => {
        handleModalOpen(false);
        navigation.goBack();
    };

    return (
        <Container title={titleText} handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <InputBox resetValues={!isModalOpen} handlePassword={handlePassword} />
                    <View style={styles.buttonBox}>
                        <Button title="Export" active={validation} onPressEvent={() => exportWallet(password)} />
                    </View>
                    <ExportWalletModal
                        title={exportPK ? 'Private Key' : 'Mnemonic'}
                        value={exportPK ? privatekey : mnemonic}
                        alertOpen={status === 0 && isModalOpen}
                        exportOpen={status === 1 && isModalOpen}
                        handleOpen={handleModalOpen}
                        handleBack={handleBack}
                    />
                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 3,
        paddingHorizontal: 20
    },
    contents: {
        flex: 2,
        paddingVertical: 20
    },
    wallet: {
        paddingVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#aaa'
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});

export default ExportWallet;
