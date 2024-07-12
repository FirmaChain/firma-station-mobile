import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { DividerColor } from '@/constants/theme';
import ConnectClient, { ServiceData, ServiceMetaData } from '@/util/connectClient';
import { CHAIN_NETWORK } from '@/../config';
import { useAppSelector } from '@/redux/hooks';
import { getDAppServiceId } from '@/util/wallet';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import DescriptionBox from './descriptionBox';
import BalanceBox from './balanceBox';
import TabBox from './tabBox';
import RefreshScrollView from '@/components/parts/refreshScrollView';
import { getCW20TokenInfo, getCW20TokenMarketingInfo } from '@/util/firma';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.DappDetail>;

export interface IDappDataState {
    identity: string;
    isServiceOnly: boolean;
    serviceList: Array<ServiceMetaData>;
    token: ITokenState | null;
    cw721ContractAddress: string | null;
    cw20ContractAddress: string | null;
    marketingLogo: string | null;
    decimal: number | null;
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


const DappDetail = ({ data }: IProps) => {
    const { storage, wallet } = useAppSelector((state) => state);
    const navigation: ScreenNavgationProps = useNavigation();
    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const [dappData, setDappData] = useState<IDappDataState>();
    const [isLoadedDappService, setIsLoadedDappService] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [isBottom, setIsBottom] = useState(false);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isScrolledToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
        setIsBottom(isScrolledToBottom);
    };

    const moveToSendScreen = () => {
        if (dappData === null) return;
        if (dappData?.cw20ContractAddress === undefined || dappData.cw20ContractAddress === null) return;
        if (dappData.token?.symbol === undefined || dappData.token?.symbol === null) return;
        navigation.navigate(Screens.SendCW20, { contract: dappData?.cw20ContractAddress, symbol: dappData.token?.symbol });
    }

    const handleRefresh = (refresh: boolean) => {
        setIsRefresh(refresh);
    };

    const handleDappData = async () => {
        try {
            const identity = data?.identity === undefined ? '' : data.identity;
            const isServiceOnly = data?.isServiceOnly === undefined ? false : data.isServiceOnly;
            const serviceList = data?.serviceList === undefined ? [] : data.serviceList;
            const cw721ContractAddress = data?.cw721ContractAddress === '' ? null : data.cw721ContractAddress;
            const cw20ContractAddress = data?.cw20ContractAddress === '' ? null : data.cw20ContractAddress;
            let token = null;
            let marketingLogo: string | null = null;
            let decimal = null;

            if (cw20ContractAddress !== null && cw20ContractAddress !== '0x' && cw20ContractAddress !== '') {
                const cw20Token = await getCW20TokenInfo(cw20ContractAddress);
                const cw20TokenMarketing = await getCW20TokenMarketingInfo(cw20ContractAddress);

                token = {
                    denom: cw20Token.symbol,
                    symbol: cw20Token.symbol
                };
                decimal = cw20Token.decimals;
                marketingLogo = cw20TokenMarketing.logo.url;
            } else {
                token = data?.token === undefined ? null : data.token;
            }

            setDappData({
                identity: identity,
                isServiceOnly: isServiceOnly,
                serviceList: serviceList,
                token: token,
                cw721ContractAddress: cw721ContractAddress,
                cw20ContractAddress: cw20ContractAddress,
                marketingLogo: marketingLogo,
                decimal: decimal
            });

        } catch (error) {
            console.log('handleDappData : ', error);
        }
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

                let index = dappData.serviceList.findIndex((val) => val.serviceId === dappService.service.serviceId);
                if (index === -1) {
                    dappData['serviceList'] = [...prevList, dappService.service];
                }
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
        if (dappData.cw20ContractAddress !== null) return true;
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
                <RefreshScrollView refreshFunc={() => handleRefresh(true)} scrollToTop={true} scrollEndFunc={handleScroll}>
                    <View style={{ flex: 1 }}>
                        <DescriptionBox data={data} />
                        <View style={{ padding: 15 }} />
                        {dappData !== undefined && (
                            <React.Fragment>
                                {isBalanceSectionOpen && <BalanceBox tokenData={dappData.token} cw20Contract={dappData.cw20ContractAddress} marketingLogo={dappData.marketingLogo} decimal={dappData.decimal} moveToSendScreen={moveToSendScreen} />}
                                <TabBox data={dappData} isScrollEnd={isBottom} serviceOnly={isServiceOnly} isRefresh={isRefresh} handleRefresh={handleRefresh} />
                            </React.Fragment>
                        )}
                    </View>
                </RefreshScrollView>
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
