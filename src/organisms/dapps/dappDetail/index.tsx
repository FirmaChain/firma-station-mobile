import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { DividerColor } from '@/constants/theme';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import DescriptionBox from './descriptionBox';
import BalanceBox from './balanceBox';
import TabBox from './tabBox';
import ConnectClient, { ServiceData, ServiceMetaData } from '@/util/connectClient';
import { CHAIN_NETWORK } from '@/../config';
import { useAppSelector } from '@/redux/hooks';
import { getDAppServiceId } from '@/util/wallet';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.DappDetail>;

export interface IDappDataState {
    identity: string;
    isServiceOnly: boolean;
    serviceList: Array<ServiceMetaData>;
    token: ITokenState | null;
}

export interface ITokenState {
    denom: string;
    symbol: string;
}

interface IDappServiceState {
    identity: string;
    serviceId: string;
}

interface IProps {
    data: any;
}

const initDappData: IDappDataState = {
    identity: '',
    isServiceOnly: false,
    serviceList: [],
    token: null
};

const DappDetail = ({ data }: IProps) => {
    const { storage, wallet } = useAppSelector((state) => state);
    const navigation: ScreenNavgationProps = useNavigation();
    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const [dappData, setDappData] = useState<IDappDataState>();
    const [isLoadedDappService, setIsLoadedDappService] = useState(false);

    const handleDappData = () => {
        let identity = data?.identity === undefined ? '' : data.identity;
        let isServiceOnly = data?.isServiceOnly === undefined ? false : data.isServiceOnly;
        let serviceList = data?.serviceList === undefined ? [] : data.serviceList;
        let token = data?.token === undefined ? null : data.token;

        setDappData({
            identity: identity,
            isServiceOnly: isServiceOnly,
            serviceList: serviceList,
            token: token
        });
    };

    const handleUserDappService = async () => {
        if (dappData === undefined) return;
        if (isLoadedDappService === true) return;
        try {
            let dappServiceData = await getDAppServiceId(wallet.name);
            if (dappServiceData === null) return;
            let dappService: IDappServiceState = JSON.parse(dappServiceData)[storage.network];
            if (dappService === null || dappService === undefined) return;
            getUserDappServiceFromId(dappService);
        } catch (error) {
            console.log(error);
        }
    };

    const getUserDappServiceFromId = useCallback(
        async (ids: IDappServiceState) => {
            if (dappData === undefined) return;
            if (ids.identity !== dappData.identity) return;
            try {
                let dappService: ServiceData = await connectClient.getUserDappService(ids.identity, ids.serviceId);
                let prevList = dappData.serviceList;

                dappData['serviceList'] = [...prevList, dappService.service];
                dappData['serviceList'].sort((a: any, b: any) => (a.serviceId < b.serviceId ? -1 : a.serviceId > b.serviceId ? 1 : 0));

                setIsLoadedDappService(true);
                setDappData({ ...dappData });
            } catch (error) {
                console.log(error);
            }
        },
        [dappData]
    );

    useEffect(() => {
        handleDappData();
    }, [data]);

    useEffect(() => {
        if (isLoadedDappService) return;
        if (dappData !== undefined) {
            handleUserDappService();
        }
    }, [dappData]);

    const isServiceOnly = useMemo(() => {
        if (dappData === undefined) return false;
        return dappData.isServiceOnly;
    }, [dappData]);

    const isBalanceSectionOpen = useMemo(() => {
        if (dappData === undefined) return false;
        if (isServiceOnly === false) {
            return dappData.token !== undefined && dappData.token !== null;
        }
    }, [dappData, isServiceOnly]);

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container titleOn={false} backEvent={handleBack}>
            <ViewContainer>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ flex: 1 }}>
                        <DescriptionBox data={data} />
                        <View style={{ padding: 20 }}>
                            <View style={styles.divider} />
                        </View>
                        {dappData !== undefined && (
                            <React.Fragment>
                                {isBalanceSectionOpen && <BalanceBox tokenData={dappData.token} />}
                                <TabBox data={dappData} serviceOnly={isServiceOnly} />
                            </React.Fragment>
                        )}
                    </View>
                </ScrollView>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: DividerColor
    }
});

export default DappDetail;
