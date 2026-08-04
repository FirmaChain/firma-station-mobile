import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { BgColor, BoxColor, Lato, TextCatTitleColor, TextDisableColor } from '@/constants/theme';
import { useDappsContext } from '@/context/dappsContext';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { fadeIn } from '@/util/animation';
import { wait } from '@/util/common';
import ConnectClient, { ProjectList } from '@/util/connectClient';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import DappsSkeleton from '@/components/skeleton/dappsSkeleton';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Dapps>;

const itemCountPerLine = 2;

const Dapps = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    const { setSelectedTabIndex, setData } = useDappsContext();

    const { network, contentVolume, dappServicesVolume } = useAppSelector((state) => state.storage);

    const connectClient = new ConnectClient(CHAIN_NETWORK[network].RELAY_HOST);
    const fadeAnimDapp = useRef(new Animated.Value(0)).current;

    const [containerSize, setContainerSize] = useState(0);
    const [projectList, setProjectList] = useState<Array<any>>([]);

    const dappsVolumes = useMemo(() => {
        if (contentVolume?.dapps === undefined) return null;
        return contentVolume.dapps;
    }, [contentVolume]);

    const itemsSkeleton = useMemo(() => {
        if (dappsVolumes === null) return [];
        const array = Array.from({ length: Number(dappsVolumes) });
        return array;
    }, [dappsVolumes]);

    const itemSize = useMemo(() => {
        return (containerSize - 20) / itemCountPerLine;
    }, [containerSize]);

    const getProjectList = async () => {
        try {
            const list: ProjectList = await connectClient.getProjects();
            StorageActions.handleContentVolume({
                ...contentVolume,
                dapps: list.projectList.length
            });

            wait(800).then(() => {
                setProjectList(list.projectList);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const moveToDetail = useCallback((data: any) => {
        setData(data);
        navigation.navigate(Screens.DappDetail);
    }, []);

    const DappItem = useCallback(
        ({ item, size }: any) => {
            return (
                <TouchableOpacity style={styles.contentWrap} onPress={() => moveToDetail(item)}>
                    <Animated.View style={{ paddingHorizontal: 10 }}>
                        <View style={[styles.contentImage, { width: '100%', height: size - 20, backgroundColor: BoxColor }]}>
                            <Animated.Image
                                style={[styles.contentImage, { width: '100%', height: size - 20, opacity: fadeAnimDapp }]}
                                source={{ uri: item.icon }}
                            />
                        </View>
                        {/* <Image style={[styles.contentImage, { width: '100%', height: size - 20 }]} source={item.icon} /> */}
                        <Animated.Text style={[styles.contentTitle, { width: '100%', opacity: fadeAnimDapp }]} numberOfLines={1}>
                            {item.name}
                        </Animated.Text>
                    </Animated.View>
                </TouchableOpacity>
            );
        },
        [moveToDetail]
    );

    useEffect(() => {
        if (dappsVolumes !== null) {
            if (projectList.length >= dappsVolumes || projectList.length > 0) {
                fadeIn(Animated, fadeAnimDapp, 500);

                let list = dappServicesVolume;
                projectList.map((value) => {
                    list = { ...list, [value.identity]: value.serviceList.length };
                    StorageActions.handleDappServicesVolume(list);
                });
            }
        }
    }, [projectList]);

    useEffect(() => {
        if (isFocused) {
            setSelectedTabIndex(0);
            setData({});
            getProjectList();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.box}>
                    <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                        {dappsVolumes != null && (
                            <React.Fragment>
                                {dappsVolumes > 0 ? (
                                    projectList.length > 0 ? (
                                        projectList.map((value, index) => {
                                            return <DappItem key={index} item={value} size={itemSize} />;
                                        })
                                    ) : (
                                        itemsSkeleton.map((value, index) => {
                                            return <DappsSkeleton key={index} size={itemSize} />;
                                        })
                                    )
                                ) : (
                                    <View style={styles.noDappsBox}>
                                        <Text style={styles.noDappsText}>No Dapps</Text>
                                    </View>
                                )}
                            </React.Fragment>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingTop: 32,
        backgroundColor: BgColor
    },
    box: {
        width: '100%',
        height: '100%'
    },
    wrapBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 10
    },
    contentWrap: {
        width: '50%',
        flexShrink: 0,
        marginBottom: 20
    },
    contentImage: {
        resizeMode: 'contain',
        overflow: 'hidden',
        borderRadius: 8
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        textAlign: 'center',
        textTransform: 'uppercase',
        color: TextCatTitleColor,
        padding: 5,
        marginTop: 5
    },
    noDappsBox: {
        flexGrow: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noDappsText: {
        fontFamily: Lato,
        fontSize: 16,
        textAlign: 'center',
        color: TextDisableColor
    }
});

export default React.memo(Dapps);
