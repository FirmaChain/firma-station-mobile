import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import _ from 'lodash';

interface IProps {
    initVal: string;
    data: IFavoriteProps[];
    isEdit: boolean;
    onPressEvent: (address: string, memo: string) => void;
    onPressEventForEdit: (address: string) => void;
}

// Custom hook: manange remove animation
const useRemoveAnimation = (item: IFavoriteProps, removeItem: IFavoriteProps | null) => {
    const fadeAnimForRemove = useRef(new Animated.Value(0)).current;

    return useMemo(() => {
        const isTargetItem = removeItem?.address === item.address && removeItem?.name === item.name && removeItem.memo === item.memo;

        if (isTargetItem) {
            fadeIn(Animated, fadeAnimForRemove, 300);
            return {
                opacity: fadeAnimForRemove,
                height: 'auto' as 'auto',
                padding: 10,
                buttonPadding: 4,
            };
        } else {
            fadeOut(Animated, fadeAnimForRemove, 150);
            return {
                opacity: fadeAnimForRemove,
                height: 0.1,
                padding: 0,
                buttonPadding: 0,
            };
        }
    }, [removeItem, item, fadeAnimForRemove]);
};

function removeObject<T>(arr: T[], target: T): T[] {
    return _.filter(arr, item => !_.isEqual(item, target));
}

// Confirm Remove Box
interface RemoveConfirmBoxProps {
    item: IFavoriteProps;
    removeItem: IFavoriteProps | null;
    onRemove: (item: IFavoriteProps) => void;
}

const RemoveConfirmBox = ({ item, removeItem, onRemove }: RemoveConfirmBoxProps) => {
    const animationState = useRemoveAnimation(item, removeItem);

    return (
        <Animated.View
            style={[
                styles.removeConfirmBox,
                {
                    opacity: animationState.opacity,
                    height: animationState.height,
                    paddingBottom: animationState.padding,
                    paddingHorizontal: 20,
                },
            ]}>
            <Text style={styles.removeNotice}>{FAVORITE_REMOVE_WARN_TEXT}</Text>
            <TouchableOpacity onPress={() => onRemove(item)}>
                <Animated.Text
                    style={[
                        styles.removeButton,
                        {
                            opacity: animationState.opacity,
                            height: animationState.height,
                            paddingVertical: animationState.buttonPadding,
                        },
                    ]}>
                    {'Remove'}
                </Animated.Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Favorite List Item
interface FavoriteListItemProps {
    item: IFavoriteProps;
    isEdit: boolean;
    selected: string;
    animationState: any;
    onSelect: (address: string, memo: string, isEdit: boolean) => void;
    onRemove: (item: IFavoriteProps) => void;
    drag: () => void;
}

const FavoriteListItem = ({ item, isEdit, selected, animationState, onSelect, onRemove, drag }: FavoriteListItemProps) => {
    const getLogoImage = (address: string) => {
        if (address.includes('firma')) return LOADING_LOGO_3;
        if (address.includes('cosmos')) return ICON_ATOM_LOGO;
        if (address.includes('osmo')) return ICON_OSMO_LOGO;
        return LOADING_LOGO_3;
    };

    return (
        <View key={item.address + item.name} style={styles.modalContentBox}>
            <View style={[styles.modalPressBox]}>
                <Animated.View
                    style={{
                        marginRight: animationState.iconMargin,
                        width: animationState.iconWidth,
                    }}>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => isEdit && onRemove(item)}>
                        <RemoveIcon size={20} color={FailedColor} />
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity style={styles.favoriteItemBox} onPress={() => onSelect(item.address, item.memo || '', isEdit)}>
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
                    <Text style={[styles.memo, { display: item.memo ? 'flex' : 'none' }]} numberOfLines={1} ellipsizeMode={'middle'}>
                        {item.memo}
                    </Text>
                </TouchableOpacity>

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
        </View>
    );
};

const ModalItemsForFavorites = ({ initVal: selectedAddress, data, isEdit, onPressEvent, onPressEventForEdit }: IProps) => {
    // External Seletor
    const {
        storage: { favorite },
        wallet,
    } = useAppSelector((state: rootState) => state);

    // Internal Hooks
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [removeItem, setRemoveItem] = useState<IFavoriteProps | null>(null);

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
            setRemoveItem(null);
            fadeOut(Animated, fadeAnim, 300);
            return {
                iconWidth: 0,
                iconMargin: 0,
            };
        }
    }, [isEdit]);

    // Functions
    const handleSelect = (address: string, memo: string, _isEdit: boolean) => {
        if (_isEdit === false) {
            onPressEvent(address, memo);
        } else {
            onPressEventForEdit(address);
        }
    };

    const removeFavorite = (item: IFavoriteProps) => {
        const newFavorite: IFavoriteProps[] = removeObject(data, item);

        adjustFavoriteList(newFavorite);
        setRemoveItem(null);

        Toast.show({
            type: 'info',
            text1: FAVORITE_REMOVE_SUCCESS,
        });
    };

    const adjustFavoriteList = useCallback(
        (list: IFavoriteProps[]) => {
            const newList = favorite.map(value => {
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
        },
        [favorite]
    );

    // Smaller ListItem render
    const ListItem = useCallback(
        ({ item, drag }: RenderItemParams<IFavoriteProps>) => {
            return (
                <View>
                    <FavoriteListItem
                        item={item}
                        isEdit={isEdit}
                        selected={selectedAddress}
                        animationState={AnimationState}
                        onSelect={handleSelect}
                        onRemove={setRemoveItem}
                        drag={drag}
                    />
                    <RemoveConfirmBox item={item} removeItem={removeItem} onRemove={removeFavorite} />
                </View>
            );
        },
        [isEdit, removeItem, selectedAddress]
    );

    return (
        <GestureHandlerRootView style={{ minHeight: 300, backgroundColor: BgColor }}>
            <DraggableFlatList
                data={data}
                style={{ maxHeight: 450 }}
                renderItem={ListItem}
                scrollEnabled={true}
                keyExtractor={item => item.address + item.name} //? Both address and name are unique
                onDragEnd={({ data }) => adjustFavoriteList(data)}
            />
        </GestureHandlerRootView>
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
