import React, { useState, useMemo, useEffect } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { BorderColor, BoxColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from "@/constants/theme";
import { MenuIcon, Radio } from "../icon/icon";

interface Props {
    initVal: number;
    data: any[];
    handleEditWalletList: (list:string, newIndex:number) => void;
    onPressEvent: (index:number) => void;
}

type Item = {
    key: number;
    label: string;
};

const ModalWalletList = ({initVal, data, handleEditWalletList, onPressEvent}:Props) => {
    const initialData = useMemo(() => {
        return data.map((item, index) => {
            return {
                key: index,
                label: item,
            };
        });
    }, [data]);

    const initValLabel = useMemo(() => {
        return data[initVal];
    }, [initVal]);

    const [selected, setSelected] = useState(initVal);
    const [isEdit, setIsEdit] = useState(false);
    const [listData, setListData] = useState(initialData);

    const handleSelect = (index:number) => {
        onPressEvent(index);
        setSelected(index);
    }

    const recreateList = () => {
        let result = "";
        let newIndex = -1;
        listData.map((item, index) => {
            if(reselectItem(item.label)) newIndex = index;
            return result += item.label + "/";
        })
        result = result.slice(0, -1);

        handleEditWalletList(result, newIndex);
        setSelected(newIndex);
    }

    const reselectItem = (label: string) => {
        if(initValLabel === label) return true;
        return false;
    }

    useEffect(() => {
        recreateList();
    }, [listData])

    const renderItem = ({ item, index = 0, drag }: RenderItemParams<Item>) => (
        <TouchableOpacity 
            key={index} 
            style={styles.modalContentBox} 
            onPress={() => {isEdit === false && handleSelect(index)}}>
            <Text style={styles.itemTitle}>{item.label}</Text>
            {isEdit?
            <TouchableOpacity
                onPressIn={drag}>
                <MenuIcon size={20} color={WhiteColor} />
            </TouchableOpacity>
            :
            <Radio size={20} color={WhiteColor} active={index === selected} />
            }
        </TouchableOpacity>
    );

    return (
        <View style={styles.modalContainer}>
            <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>Wallet list</Text>
                <TouchableOpacity style={styles.editButton} onPress={()=>setIsEdit(!isEdit)}>
                    <Text style={styles.headerEditButton}>{isEdit?"Done":"Edit"}</Text>
                </TouchableOpacity>
            </View>
            <GestureHandlerRootView>
                <DraggableFlatList
                    data={listData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onDragEnd={({ data }) => setListData(data)}
                />
            </GestureHandlerRootView>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        marginBottom: Platform.select({android: 0, ios: 20}),
        paddingBottom: Platform.select({android: 0, ios: 50}),
        maxHeight: 500,
    },
    headerBox: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        borderBottomWidth: .5,
        borderBottomColor: BorderColor,
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: "normal",
        color: TextColor,
    },
})

export default ModalWalletList;