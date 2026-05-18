import React, { useMemo } from 'react';
import { GUIDE_URI } from '@/../config';
import { AddressBoxColor, BgColor, TextCatTitleColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { removeWalletWithAutoLogin } from '@/util/wallet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';

import BioAuthRadio from './bioAuthRadio';
import Delete from './delete';
import Disconnect from './disconnect';
import MenuItem from './menuItem';
import NotificationRadio from './notificationRadio';
import TextMenuItem from './textMenuItem';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Setting>;

const Setting = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { name: walletName, address: walletAddress } = useAppSelector((state) => state.wallet);
    const { recoverType } = useAppSelector((state) => state.storage);

    const settingList = useMemo(() => {
        const settingList = [
            { title: 'Change Password', path: 'ChangePW' },
            { title: 'Export Private Key', path: 'ExportPK' }
        ];
        if (recoverType === undefined || recoverType[walletAddress] === undefined || recoverType[walletAddress] === 'mnemonic') {
            settingList.splice(1, 0, { title: 'Export Mnemonic', path: 'ExportMN' });
        }

        return settingList;
    }, [recoverType]);

    const handleMenus = (path: string) => {
        switch (path) {
            case 'ChangeWN':
                navigation.navigate(Screens.ChangeWalletName);
                break;
            case 'ChangePW':
                navigation.navigate(Screens.ChangePassword);
                break;
            case 'ExportPK':
            case 'ExportMN':
                navigation.navigate(Screens.ExportWallet, { type: path });
                break;
            case 'Version':
                navigation.navigate(Screens.Version);
                break;
            default:
                break;
        }
    };

    const disconnectWallet = async () => {
        await removeWalletWithAutoLogin();
        ModalActions.handleDAppData(null);
        ModalActions.handleModalData(null);
        navigation.reset({ routes: [{ name: Screens.Welcome }] });
    };

    const handleMoveToWeb = (key: string) => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[key]});
        Linking.openURL(GUIDE_URI[key]);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container title="Setting" handleGuide={() => handleMoveToWeb('setting')} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps={'handled'} style={{ borderTopWidth: 1, borderTopColor: BgColor }}>
                        <View style={styles.topButtonsBox}>
                            <TextMenuItem
                                title="Wallet"
                                content={walletName}
                                bgColor={AddressBoxColor}
                                icon={true}
                                iconColor={TextCatTitleColor}
                                iconSize={20}
                                iconName={'square-edit-outline'}
                                iconType={'MaterialCommunityIcons'}
                                onPressEvent={() => handleMenus('ChangeWN')}
                            />
                        </View>
                        <BioAuthRadio walletName={walletName} />
                        <NotificationRadio />
                        {settingList.map((item, index) => {
                            return <MenuItem key={index} title={item.title} path={item.path} handleMenus={handleMenus} />;
                        })}
                        <View style={styles.bottomButtonsBox}>
                            <MenuItem title={'Version'} path={'Version'} handleMenus={handleMenus} />
                        </View>
                        <View style={styles.bottomButtonsBox}>
                            <Disconnect handleDisconnect={disconnectWallet} />
                            <Delete walletName={walletName} walletAddress={walletAddress} handleDisconnect={disconnectWallet} />
                        </View>
                    </ScrollView>
                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    topButtonsBox: {
        paddingBottom: 20
    },
    bottomButtonsBox: {
        paddingTop: 20
    }
});

export default Setting;
