import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BgColor, BoxColor, BoxDarkColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from '@/constants/theme';
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

const ModalWalletList = ({ initVal, data, handleEditWalletList, onPressEvent }: IProps) => {
    const flatListRef = useRef<any>(null);
    const initialData = useMemo(() => {
        if (data === null) {
            return [];
        }
        return data.map((item, index) => {
            return {
                key: index,
                label: item,
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

    const handleScrollInitValue = useCallback(() => {
        if (flatListRef !== null && listData.length > 0 && initVal >= 0) {
            let scrollPosition = containerSize * initVal;
            flatListRef.current._listRef._scrollRef.scrollTo({ y: scrollPosition, animated: true });
        }
    }, [flatListRef, containerSize, initVal, isEdit]);

    useEffect(() => {
        handleScrollInitValue();
    }, [flatListRef, containerSize, initVal]);

    const RenderListItem = useCallback(
        ({ item, drag }: RenderItemParams<Item>) => {
            const index = listData.findIndex(dataItem => dataItem.key === item.key);
            return (
                <TouchableOpacity
                    key={item.key}
                    style={styles.modalContentBox}
                    onLayout={e => setContainerSize(e.nativeEvent.layout.height)}
                    onPress={() => {
                        isEdit === false && handleSelect(index);
                    }}>
                    <Text style={styles.itemTitle}>{item.label}</Text>
                    {isEdit ? (
                        <TouchableOpacity style={{ paddingVertical: 15, paddingRight: 20, paddingLeft: 50 }} onPressIn={drag}>
                            <MenuIcon size={20} color={WhiteColor} />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ paddingHorizontal: 20 }}>
                            <Radio size={20} color={WhiteColor} active={index === selected} />
                        </View>
                    )}
                </TouchableOpacity>
            );
        },
        [isEdit, selected]
    );

    return (
        <View style={styles.modalContainer}>
            <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>Wallet list</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEdit(!isEdit)}>
                    <Text style={styles.headerEditButton}>{isEdit ? 'Done' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>
            <GestureHandlerRootView style={{ backgroundColor: BgColor }}>
                <DraggableFlatList
                    ref={flatListRef}
                    data={listData}
                    style={{ maxHeight: 450 }}
                    renderItem={RenderListItem}
                    scrollEnabled={true}
                    keyExtractor={item => item.key.toString()}
                    onScrollToIndexFailed={() => {}}
                    onDragEnd={({ data }) => setListData(data)}
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
        backgroundColor: BoxDarkColor,
    },
    headerBox: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor,
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
    },
    headerEditButton: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
    },
    editButton: {
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 3,
    },
    modalContentBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 1,
        backgroundColor: BgColor,
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: 'normal',
        color: TextColor,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
});

export default ModalWalletList;
