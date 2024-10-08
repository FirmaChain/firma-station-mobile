import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    BgColor,
    BorderColor,
    BoxColor,
    DarkGrayColor,
    FailedColor,
    Lato,
    PointLightColor,
    TextAddressColor,
    TextColor,
    TextDisableColor,
    TextGrayColor,
    TextWarnColor,
    WhiteColor
} from '@/constants/theme';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { rootState } from '@/redux/reducers';
import { ICW20ContractState, useCWContext } from '@/context/cwContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import FastImage, { Source } from 'react-native-fast-image';
import { ForwardArrow, MenuIcon, RemoveIcon } from '@/components/icon/icon';
import { convertAmount } from '@/util/common';
import { StorageActions } from '@/redux/actions';
import { CW20_NOT_EXIST, CW20_REMOVE_SUCCESS, CW_REMOVE_WARN_TEXT, EXPLORER_URL } from '@/constants/common';
import { easeInAndOutCustomAnim, fadeIn, fadeOut, LayoutAnim } from '@/util/animation';
import { ICWContractsState } from '@/redux/types';
import Toast from 'react-native-toast-message';
import DataSection from './common/dataSection';
import NoticeItem from './common/noticeItem';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Assets>;

interface IProps {
    data: ICW20ContractState[];
    isEdit: boolean;
}

const CW20List = ({ isEdit, data }: IProps) => {
    const flatListRef = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation: ScreenNavgationProps = useNavigation();
    const { address } = useSelector((state: rootState) => state.wallet);
    const { network } = useSelector((state: rootState) => state.storage);
    const { cw20Contracts } = useSelector((state: rootState) => state.storage);
    const nonExist20StoreValue = Boolean(cw20Contracts === undefined || cw20Contracts[address] === undefined);
    const { handleUpdateCW20WholeData } = useCWContext();

    const [removeItemAddr, setRemoveItemAddr] = useState<string>('');

    const initialData = useMemo(() => {
        return data.map((item) => {
            return {
                key: item.address,
                ...item
            };
        });
    }, [data]);

    const removeContract = (removeAddress: string) => {
        const newData: ICW20ContractState[] = initialData.filter((_item) => _item.address.toLowerCase() !== removeAddress.toLowerCase());
        handleUpdateCW20WholeData(newData);

        if (nonExist20StoreValue) {
            StorageActions.handleCW20Contracts({ ...cw20Contracts, [address]: [] });
        } else {
            const contractsOutsideNetwork = cw20Contracts[address].filter((_item) => _item.network.toLowerCase() !== network.toLowerCase());
            const contractsInsideNetwork: ICWContractsState[] = newData.map((one) => ({
                address: one.address,
                type: 'CW20',
                network: one.network
            }));

            StorageActions.handleCW20Contracts({ ...cw20Contracts, [address]: [...contractsInsideNetwork, ...contractsOutsideNetwork] });
        }

        setRemoveItemAddr('');

        Toast.show({
            type: 'info',
            text1: CW20_REMOVE_SUCCESS
        });
    };

    const AnimationState = useMemo(() => {
        LayoutAnim();
        easeInAndOutCustomAnim(150);
        if (isEdit) {
            fadeIn(Animated, fadeAnim, 300);
            return { iconWidth: 20, iconMargin: 15 };
        } else {
            setRemoveItemAddr('');
            fadeOut(Animated, fadeAnim, 300);
            return { iconWidth: 0, iconMargin: 0 };
        }
    }, [isEdit, fadeAnim]);

    const handleRemoveItemSelect = (contractAddress: string) => {
        setRemoveItemAddr(contractAddress.toLowerCase() === removeItemAddr.toLowerCase() ? '' : contractAddress);
    };

    const CW20Item = useCallback(
        ({ item, index = 0, drag }: RenderItemParams<ICW20ContractState>) => {
            const isLastItem = index >= initialData.length - 1;
            const fadeAnimForRemove = useRef(new Animated.Value(0)).current;

            const AnimationStateForRemoveBox = useMemo(() => {
                LayoutAnim();
                easeInAndOutCustomAnim(150);
                if (item.address.toLowerCase() === removeItemAddr.toLowerCase()) {
                    fadeIn(Animated, fadeAnimForRemove, 300);
                    return { height: 'auto', padding: 10, buttonPadding: 4 };
                } else {
                    fadeOut(Animated, fadeAnimForRemove, 150);
                    return { height: 0, padding: 0, buttonPadding: 0 };
                }
            }, [removeItemAddr, fadeAnimForRemove, item?.address]);

            const getImageSource = (value: string | Source): Source => {
                if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
                    return { uri: value, priority: FastImage.priority.low };
                } else {
                    return value as Source;
                }
            };

            const handleMoveToExplorer = (uri: string) => {
                navigation.navigate(Screens.WebScreen, { uri: uri });
            };

            return (
                <TouchableOpacity disabled={true} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                marginLeft: AnimationState.iconMargin,
                                width: AnimationState.iconWidth,
                                paddingTop: 33
                            }}
                        >
                            <TouchableOpacity
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                onPress={() => {
                                    isEdit && handleRemoveItemSelect(item.address);
                                }}
                            >
                                <RemoveIcon size={20} color={FailedColor} />
                            </TouchableOpacity>
                        </Animated.View>
                        <View style={styles.item}>
                            <View style={[styles.contentBox, { paddingVertical: 6 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                                    <FastImage style={styles.thumbnail} resizeMode="contain" source={getImageSource(item.imgURI)} />
                                    <Text numberOfLines={1} ellipsizeMode="middle" style={styles.nameText}>
                                        {item.name}
                                    </Text>
                                </View>
                                <Animated.View>
                                    {isEdit ? (
                                        <TouchableOpacity onPressIn={drag}>
                                            <MenuIcon size={24} color={WhiteColor} />
                                        </TouchableOpacity>
                                    ) : (
                                        <ForwardArrow size={24} color={'transparent'} />
                                    )}
                                </Animated.View>
                            </View>
                            <View style={[styles.contentBox, { paddingVertical: 6, overflow: 'hidden' }]}>
                                <Text style={[styles.valueText, { fontWeight: '400', paddingRight: 20 }]}>{'Contract Address'}</Text>
                                <TouchableOpacity
                                    style={{ flexShrink: 1, justifyContent: 'flex-end' }}
                                    onPress={() => handleMoveToExplorer(EXPLORER_URL() + '/account/' + item.address)}
                                >
                                    <Text
                                        style={[styles.valueText, { color: TextAddressColor }]}
                                        numberOfLines={1}
                                        ellipsizeMode={'middle'}
                                    >
                                        {item.address}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <DataSection title={'Symbol'} data={item.symbol} />
                            <DataSection title={'Label'} data={item.label} label={true} />
                            <View style={[styles.contentBox, { paddingVertical: 6 }]}>
                                <Text style={[styles.valueText, { fontWeight: '400' }]}>{'Total Supply'}</Text>
                                <Text style={[styles.valueText, { fontWeight: '400' }]}>{`${convertAmount({
                                    value: item.totalSupply,
                                    isUfct: false,
                                    decimal: item.decimal,
                                    point: 2
                                })} ${item.symbol}`}</Text>
                            </View>
                            <View style={[styles.contentBox, { paddingTop: 6 }]}>
                                <Text style={[styles.valueText, { fontWeight: '400' }]}>{'Available'}</Text>
                                <Text style={[styles.valueText, { fontWeight: '500', color: TextColor }]}>{`${convertAmount({
                                    value: item.available,
                                    isUfct: false,
                                    decimal: item.decimal,
                                    point: 2
                                })} ${item.symbol}`}</Text>
                            </View>
                            <View style={{ paddingBottom: 22 }} />
                        </View>
                    </View>
                    <Animated.View
                        style={[
                            styles.removeConfirmBox,
                            {
                                opacity: item.address.toLowerCase() === removeItemAddr.toLowerCase() ? 1 : 0,
                                height: AnimationStateForRemoveBox.height,
                                paddingBottom: AnimationStateForRemoveBox.padding,
                                paddingHorizontal: 20
                            }
                        ]}
                    >
                        <Text style={styles.removeNotice}>{CW_REMOVE_WARN_TEXT}</Text>
                        <TouchableOpacity onPress={() => removeContract(item.address)}>
                            <Text
                                style={[
                                    styles.removeButton,
                                    {
                                        paddingVertical: AnimationStateForRemoveBox.buttonPadding
                                    }
                                ]}
                            >
                                {'Remove'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            );
        },
        [isEdit, removeItemAddr, initialData, AnimationState]
    );

    const recreateList = (data: ICW20ContractState[]) => {
        const newCWData = data.map((item) => ({ ...item }));
        handleUpdateCW20WholeData(newCWData);

        // update redux after context state is being updated
        setTimeout(() => {
            const contractsOutsideNetwork = cw20Contracts[address].filter((_item) => _item.network.toLowerCase() !== network.toLowerCase());
            const contractsInsideNetwork: ICWContractsState[] = newCWData.map((one) => ({
                address: one.address,
                type: 'CW20',
                network: one.network
            }));

            StorageActions.handleCW20Contracts({
                ...cw20Contracts,
                [address]: [...contractsInsideNetwork, ...contractsOutsideNetwork]
            });
        }, 0);
    };

    const currentNetworkContracts = useMemo(() => {
        if (!cw20Contracts[address] || cw20Contracts[address].length === 0 || !network) {
            return [];
        }

        return cw20Contracts[address].filter((one) => one.network.toLowerCase() === network.toLowerCase());
    }, [address, cw20Contracts, network]);

    return (
        <View style={styles.container}>
            {nonExist20StoreValue || currentNetworkContracts.length === 0 ? (
                <NoticeItem notification={CW20_NOT_EXIST} />
            ) : (
                <Fragment>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {'List'}
                            <Text style={{ color: PointLightColor }}> {currentNetworkContracts.length}</Text>
                        </Text>
                    </View>
                    <GestureHandlerRootView style={{ backgroundColor: BgColor, paddingBottom: 80 }}>
                        <DraggableFlatList
                            ref={flatListRef}
                            data={initialData}
                            style={{ maxHeight: 99999 }}
                            renderItem={CW20Item}
                            scrollEnabled={true}
                            keyExtractor={(_item, index) => _item.address.toString()}
                            onScrollToIndexFailed={() => {}}
                            onDragEnd={({ data }) => recreateList(data)}
                        />
                    </GestureHandlerRootView>
                </Fragment>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        overflow: 'hidden',
        backgroundColor: BgColor
    },
    header: {
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    itemBox: {
        borderBottomColor: BorderColor,
        borderBottomWidth: 0.5
    },
    itemBoxLast: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        overflow: 'hidden'
    },
    item: {
        flex: 1,
        paddingTop: 22,
        paddingHorizontal: 20,
        backgroundColor: BgColor
    },
    contentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    nameText: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: '600',
        color: TextColor
    },
    nftsCountBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 30
    },
    thumbnailWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 4
    },
    thumbnail: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: BoxColor,
        borderColor: DarkGrayColor,
        borderWidth: 0.5,
        marginRight: 10
    },
    valueText: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '600',
        color: TextDisableColor
    },
    removeConfirmBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
        marginBottom: 5
    },
    removeNotice: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextWarnColor,
        marginRight: 20
    },
    removeButton: {
        color: TextColor,
        fontFamily: Lato,
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: FailedColor,
        textAlign: 'center'
    }
});

export default React.memo(CW20List);
