import React, { memo, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { useIsFocused } from '@react-navigation/native';
import { IDappDataState } from '.';
import NFTsBox from './nftsBox';
import ServicesBox from './servicesBox';
import { useDappsContext } from '@/context/dappsContext';

interface IProps {
    data: IDappDataState;
    serviceOnly: boolean;
    isRefresh: boolean;
    isScrollEnd: boolean;
    handleRefresh: (refresh: boolean) => void;
}

const TabBox = ({ data, serviceOnly, isRefresh, isScrollEnd, handleRefresh }: IProps) => {
    const isFocused = useIsFocused();
    const { selectedTabIndex, setSelectedTabIndex } = useDappsContext()

    useEffect(() => {
        if (isFocused) {
            if (serviceOnly) {
                setSelectedTabIndex(0);
            }
        }
    }, [serviceOnly, isFocused]);

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
                            style={[styles.tab, { borderBottomColor: selectedTabIndex === 0 ? WhiteColor : 'transparent' }]}
                            onPress={() => setSelectedTabIndex(0)}
                        >
                            <Text style={selectedTabIndex === 0 ? styles.tabTitleActive : styles.tabTitleInactive}>Services</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, { borderBottomColor: selectedTabIndex === 1 ? WhiteColor : 'transparent' }]}
                            onPress={() => setSelectedTabIndex(1)}
                        >
                            <Text style={selectedTabIndex === 1 ? styles.tabTitleActive : styles.tabTitleInactive}>
                                {'NFTs'}
                            </Text>
                        </TouchableOpacity>
                    </React.Fragment>
                )}
            </View>
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <ServicesBox visible={selectedTabIndex === 0} identity={data.identity} data={data.serviceList} />
                <NFTsBox visible={selectedTabIndex === 1} isScrollEnd={isScrollEnd} identity={data.identity} cw721Contract={data.cw721ContractAddress} isRefresh={isRefresh} handleRefresh={handleRefresh} />
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
