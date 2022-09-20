import { VERSION } from '@/../config';
import { setClient } from '@/apollo';
import { VerifiedCircle } from '@/components/icon/icon';
import CustomModal from '@/components/modal/customModal';
import ModalItems from '@/components/modal/modalItems';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import { setExplorerUrl } from '@/constants/common';
import { BgColor, BoxColor, Lato, TextColor, TextGrayColor, YesColor } from '@/constants/theme';
import { useChainVersion } from '@/hooks/common/hooks';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { setFirmaSDK } from '@/util/firma';
import { VersionCheck } from '@/util/validationCheck';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import TextMenuItem from '../setting/textMenuItem';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Version>;

const Version = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { chainVer, sdkVer } = useChainVersion();
    const { storage, common } = useAppSelector((state) => state);

    // const networkList = ["MainNet", "TestNet"];
    const networkList = ['MainNet', 'TestNet', 'DevNet'];
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
    const [openNetworkSelectModal, setOpenNetworkSelectModal] = useState(false);
    const [tabCount, setTabCount] = useState(common.networkChangeActivate ? 50 : 0);
    const [versionCheck, setVersionCheck] = useState(false);

    const handleNetworkSelectModal = (open: boolean) => {
        if (tabCount >= 50) {
            CommonActions.handleNetworkChangeActivate(true);
            setOpenNetworkSelectModal(open);
        } else {
            setTabCount(tabCount + 1);
        }
    };

    const handleSelectNetwork = (index: number) => {
        if (index === selectedNetworkIndex) return setOpenNetworkSelectModal(false);
        CommonActions.handleIsNetworkChange(true);
        CommonActions.handleLoadingProgress(true);
        setFirmaSDK(networkList[index]);
        setClient(networkList[index]);
        setExplorerUrl(networkList[index]);
        StorageActions.handleNetwork(networkList[index]);
        setSelectedNetworkIndex(index);
        setOpenNetworkSelectModal(false);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        const result = VersionCheck(common.currentAppVer, VERSION);

        setVersionCheck(result);
    }, [common.currentAppVer]);

    useEffect(() => {
        if (chainVer !== '') {
            CommonActions.handleChainVer(chainVer);
        }
        if (sdkVer !== '') {
            CommonActions.handleSDKVer(sdkVer);
        }
    }, [chainVer, sdkVer]);

    useEffect(() => {
        for (var i = 0; i < networkList.length; i++) {
            if (storage.network === networkList[i]) setSelectedNetworkIndex(i);
        }
    }, []);

    return (
        <Container title="Version" backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <Pressable onPress={() => handleNetworkSelectModal(true)}>
                        <TextMenuItem title="App Version" content={'v' + VERSION} contentColor={TextGrayColor} />
                    </Pressable>
                    <TextMenuItem title="Chain Version" content={common.chainVer} contentColor={TextGrayColor} />
                    <TextMenuItem title="SDK Version" content={common.sdkVer} contentColor={TextGrayColor} />

                    <CustomModal visible={openNetworkSelectModal} bgColor={BgColor} handleOpen={handleNetworkSelectModal}>
                        <ModalItems initVal={selectedNetworkIndex} data={networkList} onPressEvent={handleSelectNetwork} />
                    </CustomModal>
                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 3
    },
    listItem: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: BgColor
    },
    itemTitleBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    content: {
        fontFamily: Lato,
        fontSize: 16
    }
});

export default Version;
