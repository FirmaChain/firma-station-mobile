import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { CONTACT, GUIDE_URI } from '@/../config';
import { UNABLE_TO_RETRIEVE_WALLET } from '@/constants/common';
import { Lato, TextAddressColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import TabNavigators from '@/navigators/tabNavigators';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait } from '@/util/common';
import { removeWalletWithAutoLogin } from '@/util/wallet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useWalletJSON } from '@/hooks/common/hooks';
import AlertModal from '@/components/modal/alertModal';
import TabContainer from '@/components/parts/containers/tabContainer';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

interface IProps {
    title: string;
    loadingRequestId?: string;
}

const Home = ({ title, loadingRequestId }: IProps) => {
    const { address: walletAddress } = useAppSelector((state) => state.wallet);

    const { walletJson, getWalletJsonData } = useWalletJSON();

    const navigation: ScreenNavgationProps = useNavigation();
    const key = title.toLowerCase();

    const [existOnJson, setExistOnJson] = useState(false);

    const moveToSetting = () => {
        navigation.navigate(Screens.Setting);
    };

    const moveToHistory = () => {
        navigation.navigate(Screens.History);
    };

    const handleMoveToWeb = () => {
        Linking.openURL(GUIDE_URI[key]);
    };

    const handleDisconnectWallet = async () => {
        try {
            setExistOnJson(false);
            await removeWalletWithAutoLogin();
            CommonActions.handleLockStation(false);
            CommonActions.handleAppPausedTime('');
            wait(300).then(() => {
                navigation.reset({ routes: [{ name: Screens.Welcome }] });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const verifyWallet = useCallback(() => {
        const list = walletJson.contactAddressList;
        const exist = list.find((address) => address === walletAddress) !== undefined;
        setExistOnJson(exist);
    }, [walletJson, walletAddress]);

    useEffect(() => {
        verifyWallet();
    }, [walletJson]);

    useEffect(() => {
        CommonActions.endLoadingProgress(loadingRequestId);
    }, [loadingRequestId]);

    useEffect(() => {
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime('');
        CommonActions.handleLoggedIn(true);
        getWalletJsonData();
    }, []);

    return (
        <TabContainer
            title={title}
            handleGuide={key === 'dapps' ? undefined : handleMoveToWeb}
            settingNavEvent={moveToSetting}
            historyNavEvent={moveToHistory}
        >
            <Fragment>
                <TabNavigators />
                {existOnJson && (
                    <AlertModal
                        visible={existOnJson}
                        forcedActive={true}
                        handleOpen={handleDisconnectWallet}
                        title={'Notice'}
                        desc={UNABLE_TO_RETRIEVE_WALLET}
                        confirmTitle={'OK'}
                        type={'CONFIRM'}
                    >
                        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${CONTACT}`)}>
                            <Text style={styles.contact}>{`[ ${CONTACT} ]`}</Text>
                        </TouchableOpacity>
                    </AlertModal>
                )}
            </Fragment>
        </TabContainer>
    );
};

const styles = StyleSheet.create({
    contact: {
        fontSize: 16,
        fontFamily: Lato,
        textAlign: 'center',
        paddingVertical: 10,
        color: TextAddressColor
    }
});

export default Home;
