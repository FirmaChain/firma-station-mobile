import { GUIDE_URI } from '@/../config';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import Button from '@/components/button/button';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';

import MnemonicGrid from './mnmonicGrid';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.CreateStepTwo>;

interface IProps {
    // FIXME: Navigation provides wallet data from multiple external wallet formats.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wallet: any;
}

const StepTwo = ({ wallet }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const onMoveToStepThree = () => {
        navigation.navigate(Screens.CreateStepThree, { wallet: wallet });
    };

    const handleMoveToWeb = () => {
        Linking.openURL(GUIDE_URI.newWallet);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container title="Write down seed phrase" step={2} handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <>
                    <ScrollView style={styles.contentBox}>
                        <MnemonicGrid mnemonic={wallet.mnemonic} />
                    </ScrollView>
                    <View style={styles.buttonBox}>
                        <Button title="I have written down my seed" active={true} onPressEvent={onMoveToStepThree} />
                    </View>
                </>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    contentBox: {
        marginVertical: 20
    },
    buttonBox: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    }
});

export default StepTwo;
