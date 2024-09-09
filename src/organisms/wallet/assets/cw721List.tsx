import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    BgColor,
    BorderColor,
    BoxColor,
    DarkGrayColor,
    FailedColor,
    Lato,
    PointLightColor,
    TextColor,
    TextDisableColor,
    TextGrayColor,
    TextWarnColor,
    WhiteColor
} from '@/constants/theme';
import { ImageStore, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { rootState } from '@/redux/reducers';
import { ICW721ContractState, useCWContext } from '@/context/cwContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ForwardArrow, MenuIcon, RemoveIcon } from '@/components/icon/icon';
import { Animated } from 'react-native';
import { easeInAndOutCustomAnim, fadeIn, fadeOut, LayoutAnim } from '@/util/animation';
import { CW721_NOT_EXIST, CW721_REMOVE_SUCCESS, CW_REMOVE_WARN_TEXT } from '@/constants/common';
import { StorageActions } from '@/redux/actions';
import { ICWContractsState } from '@/redux/types';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import FastImage, { Source } from 'react-native-fast-image';
import DataSection from './common/dataSection';
import Toast from 'react-native-toast-message';
import NoticeItem from './common/noticeItem';
import { useNavigation } from '@react-navigation/native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { getCW721NFTImage } from '@/util/firma';
import { ICON_CW_NFT_THUMBNAIL } from '@/constants/images';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Assets>;

interface IProps {
    data: ICW721ContractState[];
    isEdit: boolean;
}

const CW721List = ({ data, isEdit }: IProps) => {
    const flatListRef = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation: ScreenNavgationProps = useNavigation();
    const { address } = useSelector((state: rootState) => state.wallet);
    const { network } = useSelector((state: rootState) => state.storage);
    const { cw721Contracts } = useSelector((state: rootState) => state.storage);
    const { handleUpdateCW721WholeData, cw721Thumbnail, handleCw721Thumbnail } = useCWContext();
    const nonExistStoreValue = Boolean(cw721Contracts === undefined || cw721Contracts[address] === undefined);

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
        const newData: ICW721ContractState[] = initialData.filter((_item) => _item.address.toLowerCase() !== removeAddress.toLowerCase());
        handleUpdateCW721WholeData(newData);

        /*
        ? to remove address immediately, redux update is madatory.
        ? so, maket 2 contract address list
        ? 1. contracts that is not current network, (from user cw721 address list on @Redux)
        ? 2. contract address of currently on view (from context)
        ? and save those list in one array like [...curContracts, ...restContracts]
        */

        if (nonExistStoreValue) {
            StorageActions.handleCW721Contracts({ ...cw721Contracts, [address]: [] });
        } else {
            const contractsOutsideNetwork = cw721Contracts[address].filter(
                (_item) => _item.network.toLowerCase() !== network.toLowerCase()
            );
            const contractsInsideNetwork: ICWContractsState[] = newData.map((one) => ({
                address: one.address,
                type: 'CW721',
                network: one.network
            }));

            StorageActions.handleCW721Contracts({ ...cw721Contracts, [address]: [...contractsInsideNetwork, ...contractsOutsideNetwork] });
        }

        setRemoveItemAddr('');

        Toast.show({
            type: 'info',
            text1: CW721_REMOVE_SUCCESS
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

    const handleThumbnail = async (item: ICW721ContractState) => {
        try {
            const { totalNFTIds, address: contract } = item;

            if (cw721Thumbnail[contract] && cw721Thumbnail[contract].length > 0) {
                return cw721Thumbnail[contract];
            }

            const images = [];

            if (totalNFTIds.length > 0) {
                for (let i = 0; i < Math.min(3, totalNFTIds.length); i++) {
                    const id = totalNFTIds[i];
                    try {
                        const image = await getCW721NFTImage({ contractAddress: contract, tokenId: id });
                        if (image === '') {
                            images.push(ICON_CW_NFT_THUMBNAIL);
                        } else {
                            images.push(image);
                        }
                    } catch (error) {
                        console.error(`Failed to fetch image for NFT ID: ${id}`, error);
                    }
                }
            }

            handleCw721Thumbnail(item.address, images);
        } catch (error) {
            console.log(error);
            handleCw721Thumbnail(item.address, []);
        }
    };

    const CW721Item = useCallback(
        ({ item, index = 0, drag }: RenderItemParams<ICW721ContractState>) => {
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
                return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))
                    ? { uri: value, priority: FastImage.priority.low }
                    : (value as Source);
            };

            const images = cw721Thumbnail[item.address];

            const DisplayNFTCount = useCallback(() => {
                const { totalSupply } = item;

                if (Boolean(images) === false) {
                    handleThumbnail(item);
                    return (
                        <View style={styles.nftsCountBox}>
                            <Text style={styles.valueText}>{'Loading NFTs Data'}</Text>
                        </View>
                    );
                }

                if (totalSupply === 0) {
                    return (
                        <View style={styles.nftsCountBox}>
                            <Text style={styles.valueText}>{'No NFTs minted yet.'}</Text>
                        </View>
                    );
                }

                const count = totalSupply > 999 ? '+999' : `+${totalSupply}`;

                if (images.every((value) => value === '')) {
                    return (
                        <View style={styles.nftsCountBox}>
                            <Text style={styles.valueText}>{`Total NFTs: ${count}`}</Text>
                        </View>
                    );
                }

                return (
                    <View style={styles.nftsCountBox}>
                        <View style={styles.thumbnailWrap}>
                            {images
                                .filter((value) => value !== '')
                                .map((value, idx) => (
                                    <FastImage
                                        key={`${item.address}-${idx}`}
                                        style={styles.thumbnail}
                                        resizeMode="contain"
                                        source={getImageSource(value)}
                                    />
                                ))}
                        </View>
                        <Text style={styles.valueText}>{count}</Text>
                    </View>
                );
            }, [images]);

            const moveToCW721Detail = () => {
                navigation.navigate(Screens.CW721, { data: { cw721Contract: item.address } });
            };

            return (
                <TouchableOpacity onPress={moveToCW721Detail} disabled={isEdit} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                marginLeft: AnimationState.iconMargin,
                                width: AnimationState.iconWidth,
                                paddingTop: 30
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
                                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.nameText}>
                                    {item.name}
                                </Text>
                                <Animated.View>
                                    {isEdit ? (
                                        <TouchableOpacity onPressIn={drag}>
                                            <MenuIcon size={24} color={WhiteColor} />
                                        </TouchableOpacity>
                                    ) : (
                                        <ForwardArrow size={24} color={DarkGrayColor} />
                                    )}
                                </Animated.View>
                            </View>
                            <DataSection title={'Symbol'} data={item.symbol} />
                            <DataSection title={'Label'} data={item.label} label />
                            <View style={[styles.contentBox, { paddingTop: 5 }]}>
                                <Text style={[styles.valueText, { fontWeight: '400' }]}>{'Total Supply'}</Text>
                                <DisplayNFTCount />
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
                                paddingHorizontal: 20,
                                paddingTop: 3
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
        [isEdit, removeItemAddr, initialData, AnimationState, cw721Thumbnail]
    );

    const recreateList = (data: ICW721ContractState[]) => {
        const newCWData = data.map((item) => ({ ...item }));
        handleUpdateCW721WholeData(newCWData);

        // update redux after context state is being updated
        setTimeout(() => {
            const contractsOutsideNetwork = cw721Contracts[address].filter(
                (_item) => _item.network.toLowerCase() !== network.toLowerCase()
            );
            const contractsInsideNetwork: ICWContractsState[] = newCWData.map((one) => ({
                address: one.address,
                type: 'CW721',
                network: one.network
            }));

            StorageActions.handleCW721Contracts({
                ...cw721Contracts,
                [address]: [...contractsInsideNetwork, ...contractsOutsideNetwork]
            });
        }, 0);
    };

    const currentNetworkContracts = useMemo(() => {
        if (!cw721Contracts[address] || cw721Contracts[address]?.length === 0 || !network) {
            return [];
        }

        return cw721Contracts[address].filter((one) => one.network.toLowerCase() === network.toLowerCase());
    }, [address, cw721Contracts, network]);

    return (
        <View style={styles.container}>
            {nonExistStoreValue || currentNetworkContracts.length === 0 ? (
                <NoticeItem notification={CW721_NOT_EXIST} />
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
                            renderItem={CW721Item}
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
        marginLeft: -4
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
        backgroundColor: FailedColor
    }
});

export default React.memo(CW721List);
