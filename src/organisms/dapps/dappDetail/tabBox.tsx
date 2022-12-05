import React, { memo, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { INFTProps, useNFT } from '@/hooks/dapps/hooks';
import { useIsFocused } from '@react-navigation/native';
import { IDappDataState } from '.';
import NFTsBox from './nftsBox';
import ServicesBox from './servicesBox';

interface IProps {
    data: IDappDataState;
    serviceOnly: boolean;
    isRefresh: boolean;
    handleRefresh: (refresh: boolean) => void;
}

const TabBox = ({ data, serviceOnly, isRefresh, handleRefresh }: IProps) => {
    const isFocused = useIsFocused();
    const { MyNFTS, handleNFTIdList, handleIdentity } = useNFT();

    const [tab, setTab] = useState(0);

    const NFTS: Array<INFTProps> | null = useMemo(() => {
        return MyNFTS;
    }, [MyNFTS]);

    const NFTCount = useMemo(() => {
        if (NFTS !== null) {
            return NFTS.length;
        }
        return 0;
    }, [NFTS]);

    useEffect(() => {
        if (isFocused) {
            if (serviceOnly) {
                setTab(0);
            } else {
                handleNFTIdList();
            }
        }
    }, [serviceOnly, isFocused]);

    useEffect(() => {
        if (isRefresh) {
            handleNFTIdList();
            handleRefresh(false);
        }
    }, [isRefresh]);

    useEffect(() => {
        if (isFocused) {
            handleIdentity(data.identity);
        }
    }, [isFocused]);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.tabBox}>
                {serviceOnly ? (
                    <View style={styles.serviceTab}>
                        <Text style={styles.tabTitleActive}>Services</Text>
                    </View>
                ) : (
                    <React.Fragment>
                        <TouchableOpacity
                            style={[styles.tab, { borderBottomColor: tab === 0 ? WhiteColor : 'transparent' }]}
                            onPress={() => setTab(0)}
                        >
                            <Text style={tab === 0 ? styles.tabTitleActive : styles.tabTitleInactive}>Services</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, { borderBottomColor: tab === 1 ? WhiteColor : 'transparent' }]}
                            onPress={() => setTab(1)}
                        >
                            <Text style={tab === 1 ? styles.tabTitleActive : styles.tabTitleInactive}>
                                {NFTCount > 0 ? `NFTs (${NFTCount})` : 'NFTs'}
                            </Text>
                        </TouchableOpacity>
                    </React.Fragment>
                )}
            </View>
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <ServicesBox visible={tab === 0} identity={data.identity} data={data.serviceList} />
                <NFTsBox visible={tab === 1} NFTS={NFTS} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabBox: {
        height: 58,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BgColor,
        borderBottomWidth: 1,
        borderBottomColor: DisableColor,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    tab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3
    },
    serviceTab: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'flex-start'
    },
    tabTitleActive: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        fontWeight: 'bold',
        paddingTop: 3
    },
    tabTitleInactive: {
        fontFamily: Lato,
        fontSize: 16,
        color: InputPlaceholderColor,
        paddingTop: 3
    }
});

export default memo(TabBox);
