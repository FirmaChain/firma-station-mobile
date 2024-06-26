import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { BgColor, BoxColor, Lato, TextCatTitleColor, TextDisableColor } from '@/constants/theme';
import { CHAIN_NETWORK } from '@/../config';
import { useAppSelector } from '@/redux/hooks';
import { StorageActions } from '@/redux/actions';
import { wait } from '@/util/common';
import { fadeIn } from '@/util/animation';
import ConnectClient, { ProjectList } from '@/util/connectClient';
import DappsSkeleton from '@/components/skeleton/dappsSkeleton';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Dapps>;

const itemCountPerLine = 2;

const Dapps = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { storage } = useAppSelector((state) => state);
    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);
    const fadeAnimDapp = useRef(new Animated.Value(0)).current;

    const [containerSize, setContainerSize] = useState(0);
    const [projectList, setProjectList] = useState<Array<any>>([]);

    const dappsVolumes = useMemo(() => {
        if (storage.contentVolume?.dapps === undefined) return null;
        return storage.contentVolume.dapps;
    }, [storage.contentVolume]);

    const itemsSkeleton = useMemo(() => {
        if (dappsVolumes === null) return [];
        let array = Array.from({ length: Number(dappsVolumes) });
        return array;
    }, [dappsVolumes]);

    const itemSize = useMemo(() => {
        return (containerSize - 20) / itemCountPerLine;
    }, [containerSize]);

    const getProjectList = async () => {
        try {
            let list: ProjectList = await connectClient.getProjects();
            StorageActions.handleContentVolume({
                ...storage.contentVolume,
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
        navigation.navigate(Screens.DappDetail, { data: data });
    }, []);

    const DappItem = useCallback(
        ({ item, size }: any) => {
            return (
                <TouchableOpacity style={[styles.contentWrap, { width: size }]} onPress={() => moveToDetail(item)}>
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

                let list = storage.dappServicesVolume;
                projectList.map((value) => {
                    list = { ...list, [value.identity]: value.serviceList.length };
                    StorageActions.handleDappServicesVolume(list);
                });
            }
        }
    }, [projectList]);

    useEffect(() => {
        if (isFocused) {
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
        paddingHorizontal: 10,
    },
    contentWrap: {
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
