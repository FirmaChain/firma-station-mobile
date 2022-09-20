import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { useNFT } from '@/hooks/dapps/hooks';
import NFTsBox from './nftsBox';
import ServicesBox from './servicesBox';
import { useIsFocused } from '@react-navigation/native';

interface IProps {
    data: any;
    serviceOnly: boolean;
}

const TabBox = ({ data, serviceOnly }: IProps) => {
    const isFocused = useIsFocused();
    const { MyNFTS, handleNFTIdList, handleIdentity } = useNFT();

    const [tab, setTab] = useState(0);

    const NFTS = useMemo(() => {
        return MyNFTS;
    }, [MyNFTS]);

    const isNFTExist = useMemo(() => {
        return NFTS.length > 0;
    }, [NFTS]);

    const identity = useMemo(() => {
        return data.identity;
    }, [data.identity]);

    useEffect(() => {
        if (isFocused) {
            handleNFTIdList();
            handleIdentity(identity);
        }
    }, [identity, isFocused]);

    useEffect(() => {
        if (isNFTExist) {
            setTab(0);
        } else {
            setTab(1);
        }
    }, [isNFTExist]);

    useEffect(() => {
        if (isFocused) {
            if (serviceOnly) {
                setTab(1);
            } else {
                handleNFTIdList();
                handleIdentity(identity);
            }
        }
    }, [isFocused, serviceOnly, identity]);

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
                            <Text style={tab === 0 ? styles.tabTitleActive : styles.tabTitleInactive}>NFTs</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, { borderBottomColor: tab === 1 ? WhiteColor : 'transparent' }]}
                            onPress={() => setTab(1)}
                        >
                            <Text style={tab === 1 ? styles.tabTitleActive : styles.tabTitleInactive}>Services</Text>
                        </TouchableOpacity>
                    </React.Fragment>
                )}
            </View>
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <NFTsBox visible={tab === 0} NFTS={NFTS} />
                <ServicesBox visible={tab === 1} data={data.serviceList} />
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

export default TabBox;
