import React, { useEffect, useMemo, useState } from 'react';
import { DAPP_SERVICE_EXIST_NOTICE, DAPP_SERVICE_REGIST, DAPP_SERVICE_REGIST_SUCCESS, IKeyValue } from '@/constants/common';
import { BgColor, Lato, TextCatTitleColor, TextDarkGrayColor, TextWarnColor, WhiteColor } from '@/constants/theme';
import { CommonActions, ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import type { DappQRData } from '@/util/connectClient';
import { getDAppServiceId, setDAppServiceId } from '@/util/wallet';
import { Image, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Button from '../button/button';
import CustomModal from './customModal';

interface IProjectState {
    icon: string;
    name: string;
    projectId: string;
}

interface IServiceState {
    icon: string;
    name: string;
    serviceId: string;
}

interface IStoredDappService {
    identity: string;
    serviceId: string;
}

// interface IDappServiceState {
//   identity: string;
//   serviceId: string;
// }

const DappServiceRegistModal = () => {
    const { appState, isBioAuthInProgress } = useAppSelector((state) => state.common);
    const { network } = useAppSelector((state) => state.storage);
    const { name: walletName } = useAppSelector((state) => state.wallet);
    const { dappServiceRegModal, modalData } = useAppSelector((state) => state.modal);

    const [project, setProject] = useState<IProjectState>();
    const [service, setService] = useState<IServiceState>();
    const [serviceRegistered, setServiceRegistered] = useState(false);
    const [storageServiceData, setStorageServiceData] = useState<IKeyValue<IStoredDappService>>({});

    const isVisible = useMemo(() => {
        return dappServiceRegModal;
    }, [dappServiceRegModal]);

    const QRData = useMemo(() => {
        if (isVisible) {
            return modalData?.data as DappQRData;
        }
        return null;
    }, [modalData, isVisible]);

    useEffect(() => {
        const checkDappServiceRegistered = async () => {
            if (QRData) {
                try {
                    setProject(QRData.project);
                    setService(QRData.service);

                    const result = await getDAppServiceId(walletName);
                    const service: IKeyValue<IStoredDappService> = JSON.parse(result ?? 'null');
                    setStorageServiceData(service === undefined ? {} : service);
                    const exist = isStoragedServiceId(service);
                    setServiceRegistered(exist);
                } catch (error) {
                    console.error(error);
                    handleModal(false);
                }
            }
        };
        checkDappServiceRegistered();
    }, [QRData]);

    const isStoragedServiceId = (service: IKeyValue<IStoredDappService>) => {
        return service !== null && service[network] !== undefined;
    };

    const handleModal = (open: boolean) => {
        ModalActions.handleDAppServiceRegistModal(open);
    };

    const handleCloseModal = () => {
        handleModal(false);
        ModalActions.handleModalData(null);
    };

    const handleRegistService = async () => {
        try {
            let serviceId: IKeyValue<IStoredDappService> = {};
            if (project !== undefined && service !== undefined) {
                serviceId = {
                    ...storageServiceData,
                    [network]: { identity: project.projectId, serviceId: service.serviceId }
                };
            }
            await setDAppServiceId(walletName, JSON.stringify(serviceId));

            Toast.show({
                type: 'success',
                text1: DAPP_SERVICE_REGIST_SUCCESS
            });
            handleCloseModal();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (appState !== 'active' && isBioAuthInProgress === false) handleCloseModal();
    }, [appState]);

    return (
        <CustomModal
            visible={isVisible}
            handleOpen={handleModal}
            handleShow={() => CommonActions.endLoadingProgress(modalData?.loadingRequestId)}
            toastInModal={false}
        >
            <View style={styles.modalTextContents}>
                <View style={[styles.boxV, styles.inlineStyle1]}>
                    {project !== undefined && (
                        <View style={styles.projectBox}>
                            <Image style={styles.inlineStyle2} source={{ uri: project.icon }} />
                            <Text style={[styles.url, styles.inlineStyle3]}>{project.name}</Text>
                        </View>
                    )}
                    {service !== undefined && (
                        <React.Fragment>
                            <View style={styles.logoBox}>
                                <Image style={styles.inlineStyle4} source={{ uri: service.icon }} />
                            </View>
                            <Text style={styles.desc}>{service.name}</Text>
                            {serviceRegistered ? (
                                <Text style={[styles.title, styles.inlineStyle5]}>{DAPP_SERVICE_EXIST_NOTICE}</Text>
                            ) : (
                                <Text style={styles.title}>{DAPP_SERVICE_REGIST}</Text>
                            )}
                        </React.Fragment>
                    )}
                </View>
                <View style={styles.modalButtonBox}>
                    <View style={styles.inlineStyle6}>
                        <Button
                            title={serviceRegistered ? 'Close' : 'Cancel'}
                            active={true}
                            border={true}
                            onPressEvent={() => handleCloseModal()}
                        />
                    </View>
                    {serviceRegistered === false && (
                        <React.Fragment>
                            <View style={styles.inlineStyle7} />
                            <View style={styles.inlineStyle8}>
                                <Button title={'Add'} active={true} onPressEvent={() => handleRegistService()} />
                            </View>
                        </React.Fragment>
                    )}
                </View>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { alignItems: 'center' },
    inlineStyle2: { width: 14, height: 14, resizeMode: 'contain', borderRadius: 10 },
    inlineStyle3: { paddingBottom: 0, paddingHorizontal: 10 },
    inlineStyle4: { width: 85, height: 85, resizeMode: 'contain', borderRadius: 10 },
    inlineStyle5: { color: TextWarnColor },
    inlineStyle6: { flex: 1 },
    inlineStyle7: { width: 10 },
    inlineStyle8: { flex: 1 },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
    },
    projectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: BgColor
    },
    url: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'bold',
        color: TextCatTitleColor
    },
    logoBox: {
        paddingTop: 20,
        paddingBottom: 10
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: WhiteColor,
        paddingTop: 20,
        paddingBottom: 5
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor
    },
    modalTextContents: {
        width: '100%',
        padding: 20
    },
    modalButtonBox: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default DappServiceRegistModal;
