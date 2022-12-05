import React, { useEffect, useMemo, useState } from 'react';
import { VERSION } from '@/../config';
import { setClient } from '@/apollo';
import { setExplorerUrl } from '@/constants/common';
import { BgColor, Lato, TextGrayColor } from '@/constants/theme';
import { useChainVersion } from '@/hooks/common/hooks';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, ModalActions, StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { setFirmaSDK } from '@/util/firma';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CustomModal from '@/components/modal/customModal';
import ModalItems from '@/components/modal/modalItems';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import TextMenuItem from '../setting/textMenuItem';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Version>;

const Version = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { chainVer, sdkVer, refetch } = useChainVersion();
    const { storage, common } = useAppSelector((state) => state);

    // const networkList = ["MainNet", "TestNet"];
    const networkList = ['MainNet', 'TestNet', 'DevNet'];
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
    const [openNetworkSelectModal, setOpenNetworkSelectModal] = useState(false);
    const [tabCount, setTabCount] = useState(common.networkChangeActivate ? 50 : 0);

    const ChainVer = useMemo(() => {
        return common.chainVer;
    }, [common.chainVer]);

    const SDKVer = useMemo(() => {
        return common.sdkVer;
    }, [common.sdkVer]);

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
        ModalActions.handleDAppData(null);
        ModalActions.handleModalData(null);
        StorageActions.handleNetwork(networkList[index]);
        setSelectedNetworkIndex(index);
        setOpenNetworkSelectModal(false);
        refetch();
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        CommonActions.handleChainVer(chainVer);
        CommonActions.handleSDKVer(sdkVer);
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
                    <TextMenuItem title="Chain Version" content={ChainVer} contentColor={TextGrayColor} />
                    <TextMenuItem title="SDK Version" content={SDKVer} contentColor={TextGrayColor} />

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
