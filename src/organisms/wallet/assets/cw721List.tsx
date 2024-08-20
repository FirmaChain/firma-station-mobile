import React, { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { BgColor, BorderColor, BoxColor, DarkGrayColor, FailedColor, Lato, PointLightColor, TextColor, TextDisableColor, TextGrayColor, TextWarnColor, WhiteColor } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { rootState } from "@/redux/reducers";
import { ICW721ContractState, useCWContext } from "@/context/cwContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ForwardArrow, MenuIcon, RemoveIcon } from "@/components/icon/icon";
import { Animated } from "react-native";
import { easeInAndOutCustomAnim, fadeIn, fadeOut, LayoutAnim } from "@/util/animation";
import { CW721_NOT_EXIST, CW721_REMOVE_SUCCESS, CW_REMOVE_WARN_TEXT } from "@/constants/common";
import { StorageActions } from "@/redux/actions";
import { ICWContractsState } from "@/redux/types";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import FastImage, { Source } from "react-native-fast-image";
import DataSection from "./common/dataSection";
import Toast from "react-native-toast-message";
import NoticeItem from "./common/noticeItem";
import { useNavigation } from "@react-navigation/native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";

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
    const { cw721Contracts } = useSelector((state: rootState) => state.storage);
    const { handleUpdateCW721WholeData } = useCWContext();
    const nonExistStoreValue = Boolean(cw721Contracts === undefined || cw721Contracts[address] === undefined)

    const [removeItemIndex, setRemoveItemIndex] = useState(-1);

    const initialData = useCallback(() => {
        return data.map((item, index) => {
            return {
                key: index,
                ...item
            };
        });
    }, [data]);

    const removeContract = (key: number) => {
        const newData: ICW721ContractState[] = initialData().filter((_item, index) => index !== key);
        handleUpdateCW721WholeData(newData);
        const _newData = nonExistStoreValue ? [] : cw721Contracts[address].filter((_item, index) => index !== key);
        StorageActions.handleCW721Contracts({ ...cw721Contracts, [address]: [..._newData] });

        setRemoveItemIndex(-1);

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
            setRemoveItemIndex(-1);
            fadeOut(Animated, fadeAnim, 300);
            return { iconWidth: 0, iconMargin: 0 };
        }
    }, [isEdit, fadeAnim]);

    const handleRemoveItemSelect = (index: number) => {
        setRemoveItemIndex(index === removeItemIndex ? -1 : index);
    };

    const CW721Item = useCallback(({ item, index = 0, drag }: RenderItemParams<ICW721ContractState>) => {
        const isLastItem = index >= initialData().length - 1;
        const fadeAnimForRemove = useRef(new Animated.Value(0)).current;

        const AnimationStateForRemoveBox = useMemo(() => {
            LayoutAnim();
            easeInAndOutCustomAnim(150);
            if (index === removeItemIndex) {
                fadeIn(Animated, fadeAnimForRemove, 300);
                return { height: 'auto', padding: 10, buttonPadding: 4 };
            } else {
                fadeOut(Animated, fadeAnimForRemove, 150);
                return { height: 0.1, padding: 0, buttonPadding: 0 };
            }
        }, [removeItemIndex, fadeAnimForRemove, index]);

        const getImageSource = (value: string | Source): Source => {
            return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))
                ? { uri: value, priority: FastImage.priority.low }
                : value as Source;
        };

        const DisplayNFTCount = useCallback(() => {
            const { totalSupply, images } = item;

            if (totalSupply === 0) {
                return <View style={styles.nftsCountBox}><Text style={styles.valueText}>{'No NFTs minted yet.'}</Text></View>;
            }

            const count = totalSupply > 999 ? '+999' : `+${totalSupply}`;

            if (images.every((value) => value === "")) {
                return <View style={styles.nftsCountBox}><Text style={styles.valueText}>{`Total NFTs: ${count}`}</Text></View>;
            }

            return (
                <View style={styles.nftsCountBox}>
                    <View style={styles.thumbnailWrap}>
                        {images.filter((value) => value !== "").map((value, idx) => (
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
        }, [item]);

        const moveToCW721Detail = () => {
            navigation.navigate(Screens.CW721, { data: { cw721Contract: item.address } });
        }

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
                                isEdit && handleRemoveItemSelect(index);
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
                            <Animated.View
                            >
                                {isEdit ?
                                    <TouchableOpacity onPressIn={drag}>
                                        <MenuIcon size={24} color={WhiteColor} />
                                    </TouchableOpacity>
                                    :
                                    <ForwardArrow size={24} color={DarkGrayColor} />
                                }
                            </Animated.View>
                        </View>
                        <DataSection title={'Symbol'} data={item.symbol} />
                        <DataSection title={'Label'} data={item.label} label={true} />
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
                            opacity: fadeAnimForRemove,
                            height: AnimationStateForRemoveBox.height,
                            paddingBottom: AnimationStateForRemoveBox.padding,
                            paddingHorizontal: 20,
                            paddingTop: 3,
                        }
                    ]}
                >
                    <Text style={styles.removeNotice}>{CW_REMOVE_WARN_TEXT}</Text>
                    <TouchableOpacity onPress={() => removeContract(index)}>
                        <Animated.Text
                            style={[
                                styles.removeButton,
                                {
                                    opacity: fadeAnimForRemove,
                                    height: AnimationStateForRemoveBox.height,
                                    paddingVertical: AnimationStateForRemoveBox.buttonPadding
                                }
                            ]}
                        >
                            {'Remove'}
                        </Animated.Text>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        );
    }, [isEdit, removeItemIndex, initialData, AnimationState]);

    const recreateList = useCallback((data: ICW721ContractState[]) => {
        const newCWData = data.map(item => ({ ...item }));
        handleUpdateCW721WholeData(newCWData);
        const newData: ICWContractsState[] = data.map(item => ({ address: item.address, type: 'CW721' }));
        StorageActions.handleCW721Contracts({ ...cw721Contracts, [address]: [...newData] });
    }, [handleUpdateCW721WholeData]);

    return (
        <View style={styles.container}>
            {nonExistStoreValue || cw721Contracts[address].length === 0 ?
                <NoticeItem notification={CW721_NOT_EXIST} />
                :
                <Fragment>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {'List'}
                            <Text style={{ color: PointLightColor }}> {cw721Contracts[address].length}</Text>
                        </Text>
                    </View>
                    <GestureHandlerRootView style={{ backgroundColor: BgColor, paddingBottom: 80 }}>
                        <DraggableFlatList
                            ref={flatListRef}
                            data={initialData()}
                            style={{ maxHeight: 99999 }}
                            renderItem={CW721Item}
                            scrollEnabled={true}
                            keyExtractor={(_item, index) => index.toString()}
                            onScrollToIndexFailed={() => { }}
                            onDragEnd={({ data }) => recreateList(data)}
                        />
                    </GestureHandlerRootView>
                </Fragment>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        overflow: 'hidden',
        backgroundColor: BgColor,
    },
    header: {
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
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
        justifyContent: 'space-between',
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
        height: 30,
    },
    thumbnailWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 4,
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
})

export default React.memo(CW721List);