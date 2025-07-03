import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { IFavoriteProps } from '@/redux/types';
import { StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { rootState } from '@/redux/reducers';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { MenuIcon, Radio, RemoveIcon } from '../icon/icon';
import { LayoutAnim, easeInAndOutCustomAnim, fadeIn, fadeOut } from '@/util/animation';
import { FAVORITE_REMOVE_SUCCESS, FAVORITE_REMOVE_WARN_TEXT } from '@/constants/common';
import { BgColor, Lato, TextCatTitleColor, TextColor, TextGrayColor, TextWarnColor, WhiteColor } from '@/constants/theme';
import { BoxDarkColor, FailedColor } from '@/constants/theme';
import { RestakeActiveColor } from '@/constants/theme';
import { ICON_ATOM_LOGO, ICON_OSMO_LOGO, LOADING_LOGO_3 } from '@/constants/images';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import FastImage from 'react-native-fast-image';

interface IProps {
    initVal: string;
    data: Array<IFavoriteProps>;
    isEdit: boolean;
    onPressEvent: (address: string, memo: string) => void;
    onPressEventForEdit: (address: string) => void;
}

type Item = {
    key: number;
    name: string;
    address: string;
    memo: string;
};

const ModalItemsForFavorites = ({ initVal, data, isEdit, onPressEvent, onPressEventForEdit }: IProps) => {
    // External Seletor
    const { storage, wallet } = useAppSelector((state: rootState) => state);

    // Internal Hooks
    const flatListRef = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [selected, setSelected] = useState(initVal);
    const [removeItemIndex, setRemoveItemIndex] = useState(-1);

    const currentList = useMemo(() => {
        if (data === null) return [];
        return data.map((item, index) => {
            return {
                key: index,
                name: item.name,
                address: item.address,
                memo: item.memo === undefined ? '' : item.memo,
            };
        });
    }, [data]);

    const AnimationState = useMemo(() => {
        LayoutAnim();
        easeInAndOutCustomAnim(150);
        if (isEdit) {
            fadeIn(Animated, fadeAnim, 300);
            return {
                iconWidth: 20,
                iconMargin: 15,
            };
        } else {
            setRemoveItemIndex(-1);
            fadeOut(Animated, fadeAnim, 300);
            return {
                iconWidth: 0,
                iconMargin: 0,
            };
        }
    }, [isEdit]);

    // Functions
    const handleSelect = (address: string, memo: string, isEdit: boolean) => {
        if (isEdit === false) {
            onPressEvent(address, memo);
            setSelected(address);
        } else {
            onPressEventForEdit(address);
        }
    };

    const handleRemoveItemSelect = (index: number) => {
        setRemoveItemIndex(index === removeItemIndex ? -1 : index);
    };

    const recreateList = (data: Item[]) => {
        let newFavorite: Item[] = [];
        data.map((item, index) => {
            return newFavorite.push({
                key: index,
                name: item.name,
                address: item.address,
                memo: item.memo === undefined ? '' : item.memo,
            });
        });
        adjustFavoriteList(newFavorite);
    };

    const removeFavorite = (key: number) => {
        let newFavorite: Item[] = currentList.filter((_item, index) => index !== key);
        adjustFavoriteList(newFavorite);
        setRemoveItemIndex(-1);

        Toast.show({
            type: 'info',
            text1: FAVORITE_REMOVE_SUCCESS,
        });
    };

    const adjustFavoriteList = (list: Item[]) => {
        let favorites = storage.favorite;
        let newList = favorites.map(value => {
            if (value.ownerAddress === wallet.address) {
                return {
                    ownerAddress: value.ownerAddress,
                    favorite: list,
                };
            } else {
                return value;
            }
        });

        StorageActions.handleFavorite(newList);
    };

    // Render Item

    const ListItem = ({ item, drag }: RenderItemParams<Item>) => {
        const index = currentList.findIndex(dataItem => dataItem.key === item.key) || 0;
        const fadeAnimForRemove = useRef(new Animated.Value(0)).current;

        const AnimationStateForRemoveBox = useMemo(() => {
            if (index === removeItemIndex) {
                fadeIn(Animated, fadeAnimForRemove, 300);
                return {
                    height: 'auto' as 'auto', // height suppports 'auto' but considered as 'string' here
                    padding: 10,
                    buttonPadding: 4,
                };
            } else {
                fadeOut(Animated, fadeAnimForRemove, 150);
                return {
                    height: 0.1,
                    padding: 0,
                    buttonPadding: 0,
                };
            }
        }, [removeItemIndex]);

        const MemoExist = useMemo(() => {
            return item.memo !== '';
        }, [item]);

        const RenderListItem = useCallback(() => {
            const getLogoImage = (address: string) => {
                if (address.includes('firma')) return LOADING_LOGO_3;
                if (address.includes('cosmos')) return ICON_ATOM_LOGO;
                if (address.includes('osmo')) return ICON_OSMO_LOGO;

                return LOADING_LOGO_3;
            };

            return (
                <TouchableOpacity
                    key={index}
                    style={styles.modalContentBox}
                    onPress={() => {
                        handleSelect(item.address, item.memo, isEdit);
                    }}>
                    <View>
                        <View style={[styles.modalPressBox]}>
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    marginRight: AnimationState.iconMargin,
                                    width: AnimationState.iconWidth,
                                }}>
                                <TouchableOpacity
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    onPress={() => {
                                        isEdit && handleRemoveItemSelect(index);
                                    }}>
                                    <RemoveIcon size={20} color={FailedColor} />
                                </TouchableOpacity>
                            </Animated.View>
                            <View style={styles.favoriteItemBox}>
                                <View style={styles.nameBox}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <FastImage style={styles.logo} source={getLogoImage(item.address)} />
                                    </View>
                                    <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>
                                        {item.name}
                                    </Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={styles.verifiedBox}>
                                            <Text style={styles.verified}>{'VERIFIED'}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.address} numberOfLines={1} ellipsizeMode={'middle'}>
                                    {item.address}
                                </Text>
                                <Text
                                    style={[styles.memo, { display: MemoExist ? 'flex' : 'none' }]}
                                    numberOfLines={1}
                                    ellipsizeMode={'middle'}>
                                    {item.memo}
                                </Text>
                            </View>

                            <View>
                                {isEdit ? (
                                    <TouchableOpacity onPressIn={drag}>
                                        <MenuIcon size={20} color={WhiteColor} />
                                    </TouchableOpacity>
                                ) : (
                                    <Radio size={20} color={WhiteColor} active={item.address === selected} />
                                )}
                            </View>
                        </View>
                        <Animated.View
                            style={[
                                styles.removeConfirmBox,
                                {
                                    opacity: fadeAnimForRemove,
                                    height: AnimationStateForRemoveBox.height,
                                    paddingBottom: AnimationStateForRemoveBox.padding,
                                    paddingHorizontal: 20,
                                },
                            ]}>
                            <Text style={styles.removeNotice}>{FAVORITE_REMOVE_WARN_TEXT}</Text>
                            <TouchableOpacity onPress={() => removeFavorite(index)}>
                                <Animated.Text
                                    style={[
                                        styles.removeButton,
                                        {
                                            opacity: fadeAnimForRemove,
                                            height: AnimationStateForRemoveBox.height,
                                            paddingVertical: AnimationStateForRemoveBox.buttonPadding,
                                        },
                                    ]}>
                                    {'Remove'}
                                </Animated.Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            );
        }, [currentList, isEdit, selected, removeItemIndex]);
        return RenderListItem();
    };

    // Side Effect
    useEffect(() => {
        setSelected(initVal);
    }, [initVal]);

    return (
        <Fragment>
            <GestureHandlerRootView style={{ minHeight: 300, backgroundColor: BgColor }}>
                <DraggableFlatList
                    ref={flatListRef}
                    data={currentList}
                    style={{ maxHeight: 450 }}
                    renderItem={ListItem}
                    scrollEnabled={true}
                    keyExtractor={_item => String(_item.key) + _item.address}
                    onScrollToIndexFailed={() => {}}
                    onDragEnd={({ data }) => recreateList(data)}
                />
            </GestureHandlerRootView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    modalContentBox: {
        position: 'relative',
        backgroundColor: BgColor,
        marginBottom: 1,
        borderBottomColor: BoxDarkColor,
        borderBottomWidth: 0.5,
    },
    modalPressBox: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 1,
    },
    favoriteItemBox: {
        flex: 1,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingRight: 10,
    },
    nameBox: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingBottom: 5,
    },
    name: {
        width: '70%',
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: '600',
        color: TextColor,
    },
    verifiedBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: RestakeActiveColor,
        borderWidth: 1,
        borderRadius: 5,
        marginLeft: 5,
    },
    verified: {
        fontFamily: Lato,
        fontSize: 8,
        color: RestakeActiveColor,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    logo: {
        width: 20,
        maxWidth: 20,
        height: 20,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 7,
    },
    address: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 12,
        fontWeight: '600',
        color: TextCatTitleColor,
        paddingBottom: 5,
    },
    memo: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 12,
        fontWeight: '600',
        color: TextGrayColor,
    },
    removeConfirmBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    removeNotice: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextWarnColor,
        marginRight: 20,
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
    },
});

export default ModalItemsForFavorites;
