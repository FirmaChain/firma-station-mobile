import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BgColor, BoxColor, BoxDarkColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from '@/constants/theme';
import { isV2EncryptedEnvelope } from '@/util/keystore';
import { getChain } from '@/util/secureKeyChain';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
    const [walletVersions, setWalletVersions] = useState<Record<string, 'v1' | 'v2'>>({});

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
        let cancelled = false;

        const loadWalletVersions = async () => {
            if (data === null) {
                if (!cancelled) setWalletVersions({});
                return;
            }

            const pairs = await Promise.all(
                data.map(async (name) => {
                    try {
                        const result = await getChain(String(name));
                        const version = result !== false && isV2EncryptedEnvelope(result.password) ? 'v2' : 'v1';
                        return [String(name), version] as const;
                    } catch {
                        return [String(name), 'v1'] as const;
                    }
                })
            );

            if (!cancelled) {
                setWalletVersions(Object.fromEntries(pairs));
            }
        };

        loadWalletVersions();

        return () => {
            cancelled = true;
        };
    }, [data]);

    const canInitialScroll = containerSize > 0 && initVal >= 0 && listData.length > 0;

    const RenderListItem = useCallback(
        ({ item, drag }: RenderItemParams<Item>) => {
            const index = listData.findIndex((dataItem) => dataItem.key === item.key);
            const version = walletVersions[item.label]; // ?? 'v1';

            return (
                <TouchableOpacity
                    key={item.key}
                    style={styles.modalContentBox}
                    onLayout={(e) => {
                        if (containerSize === 0) setContainerSize(e.nativeEvent.layout.height);
                    }}
                    onPress={() => {
                        if (isEdit === false) handleSelect(index);
                    }}
                >
                    <View style={styles.itemLabelBox}>
                        <Text style={styles.itemTitle}>{item.label}</Text>
                        {version && (
                            <View style={styles.versionBadge}>
                                <Text style={styles.versionText}>{version}</Text>
                            </View>
                        )}
                    </View>
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
        [containerSize, isEdit, listData, selected, walletVersions]
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
                    data={listData}
                    style={{ maxHeight: 450 }}
                    renderItem={RenderListItem}
                    scrollEnabled={true}
                    initialScrollIndex={canInitialScroll ? initVal : undefined}
                    getItemLayout={(_, index) => ({
                        length: containerSize,
                        offset: containerSize * index,
                        index
                    })}
                    keyExtractor={(item) => item.key.toString()}
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
    },
    versionBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: BoxColor
    },
    versionText: {
        fontFamily: Lato,
        fontSize: 12,
        color: TextCatTitleColor
    }
});

export default ModalWalletList;
