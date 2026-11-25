import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BgColor, BoxColor, BoxDarkColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from '@/constants/theme';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View, type LayoutChangeEvent } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReorderableList, { reorderItems, useReorderableDrag } from 'react-native-reorderable-list';

import { MenuIcon, Radio } from '../icon/icon';

interface IProps {
    initVal: number;
    data: any[] | null;
    handleEditWalletList: (list: string, newIndex: number) => void;
    onPressEvent: (index: number) => void;
}

type Item = {
    key: number;
    label: string;
};

interface WalletListItemProps {
    item: Item;
    index: number;
    isEdit: boolean;
    selected: number;
    onSelect: (index: number) => void;
    onLayout: (event: LayoutChangeEvent) => void;
}

const WalletListItem = ({ item, index, isEdit, selected, onSelect, onLayout }: WalletListItemProps) => {
    const drag = useReorderableDrag();

    return (
        <TouchableOpacity style={styles.modalContentBox} onLayout={onLayout} onPress={isEdit ? undefined : () => onSelect(index)}>
            <View style={styles.itemLabelBox}>
                <Text style={styles.itemTitle}>{item.label}</Text>
            </View>
            {isEdit ? (
                <TouchableOpacity style={{ paddingVertical: 15, paddingRight: 20, paddingLeft: 50 }} onLongPress={drag}>
                    <MenuIcon size={20} color={WhiteColor} />
                </TouchableOpacity>
            ) : (
                <View style={{ paddingHorizontal: 20 }}>
                    <Radio size={20} color={WhiteColor} active={index === selected} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const ModalWalletList = ({ initVal, data, handleEditWalletList, onPressEvent }: IProps) => {
    const listRef = useRef<FlatList<Item>>(null);
    const didInitialScroll = useRef(false);
    const initialData = useMemo(() => {
        if (data === null) {
            return [];
        }
        return data.map((item, index) => {
            return {
                key: index,
                label: item
            };
        });
    }, [data]);

    const initValLabel = useMemo(() => {
        if (data === null) {
            return '';
        }
        return data[initVal];
    }, [initVal]);

    const [selected, setSelected] = useState(initVal);
    const [isEdit, setIsEdit] = useState(false);
    const [listData, setListData] = useState(initialData);
    const [containerSize, setContainerSize] = useState(0);

    const handleSelect = (index: number) => {
        onPressEvent(index);
        setSelected(index);
    };

    const recreateList = () => {
        let result = '';
        let newIndex = -1;
        listData.map((item, index) => {
            if (reselectItem(item.label)) {
                newIndex = index;
            }
            return (result += item.label + '/');
        });
        result = result.slice(0, -1);

        handleEditWalletList(result, newIndex);
        setSelected(newIndex);
    };

    const reselectItem = (label: string) => {
        if (initValLabel === label) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        recreateList();
    }, [listData]);

    useEffect(() => {
        const list = listRef.current;
        if (!didInitialScroll.current && list && containerSize > 0 && initVal >= 0 && initVal < listData.length) {
            didInitialScroll.current = true;
            list.scrollToIndex({ index: initVal, animated: false });
        }
    }, [containerSize, initVal, listData.length]);

    const handleItemLayout = (event: LayoutChangeEvent) => {
        if (containerSize === 0) setContainerSize(event.nativeEvent.layout.height);
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>Wallet list</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEdit(!isEdit)}>
                    <Text style={styles.headerEditButton}>{isEdit ? 'Done' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>
            <GestureHandlerRootView style={{ backgroundColor: BgColor }}>
                <ReorderableList
                    ref={listRef}
                    data={listData}
                    style={{ maxHeight: 450 }}
                    renderItem={({ item, index }) => (
                        <WalletListItem
                            item={item}
                            index={index}
                            isEdit={isEdit}
                            selected={selected}
                            onSelect={handleSelect}
                            onLayout={handleItemLayout}
                        />
                    )}
                    scrollEnabled={true}
                    dragEnabled={isEdit}
                    getItemLayout={(_, index) => ({
                        length: containerSize,
                        offset: containerSize * index,
                        index
                    })}
                    keyExtractor={(item) => item.key.toString()}
                    onScrollToIndexFailed={() => listRef.current?.scrollToOffset({ offset: containerSize * initVal, animated: false })}
                    onReorder={({ from, to }) => {
                        if (from === to) return;
                        setListData(reorderItems(listData, from, to));
                    }}
                />
            </GestureHandlerRootView>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        marginBottom: Platform.select({ android: 0, ios: 25 }),
        maxHeight: 500,
        backgroundColor: BoxDarkColor
    },
    headerBox: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10
    },
    headerEditButton: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        paddingHorizontal: 10
    },
    editButton: {
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 3
    },
    modalContentBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 1,
        backgroundColor: BgColor
    },
    itemLabelBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: 'normal',
        color: TextColor,
        paddingVertical: 20,
        paddingLeft: 20,
        paddingRight: 8
    }
});

export default ModalWalletList;
