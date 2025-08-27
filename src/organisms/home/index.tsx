import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, ModalActions } from '@/redux/actions';
import { CONTACT, GUIDE_URI } from '@/../config';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import TabContainer from '@/components/parts/containers/tabContainer';
import TabNavigators from '@/navigators/tabNavigators';
import { useWalletJSON } from '@/hooks/common/hooks';
import { useAppSelector } from '@/redux/hooks';
import { rootState } from '@/redux/reducers';
import AlertModal from '@/components/modal/alertModal';
import { UNABLE_TO_RETRIEVE_WALLET } from '@/constants/common';
import { removeWalletWithAutoLogin } from '@/util/wallet';
import { Lato } from '@/constants/theme';
import { TextAddressColor } from '@/constants/theme';
import { wait } from '@/util/common';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

interface IProps {
    title: string;
}

const Home = ({ title }: IProps) => {
    const { wallet } = useAppSelector((state: rootState) => state);
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
        let list = walletJson.contactAddressList;
        let exist = list.find(address => address === wallet.address) !== undefined;
        setExistOnJson(exist);
    }, [walletJson, wallet]);

    useEffect(() => {
        verifyWallet();
    }, [walletJson]);

    useEffect(() => {
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime('');
        CommonActions.handleLoggedIn(true);
        CommonActions.handleLoadingProgress(false);
        getWalletJsonData();
    }, []);

    return (
        <TabContainer
            title={title}
            handleGuide={key === 'dapps' ? undefined : handleMoveToWeb}
            settingNavEvent={moveToSetting}
            historyNavEvent={moveToHistory}>
            <Fragment>
                <TabNavigators />
                {existOnJson && (
                    <AlertModal
                        visible={existOnJson}
                        forcedActive={true}
                        handleOpen={handleDisconnectWallet}
                        title={'Notice'}
                        desc={UNABLE_TO_RETRIEVE_WALLET}
                        children={
                            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${CONTACT}`)}>
                                <Text style={styles.contact}>{`[ ${CONTACT} ]`}</Text>
                            </TouchableOpacity>
                        }
                        confirmTitle={'OK'}
                        type={'CONFIRM'}
                    />
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
        color: TextAddressColor,
    },
});

export default Home;
