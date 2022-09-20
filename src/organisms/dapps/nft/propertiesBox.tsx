import { BgColor, BoxColor, DividerColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor, TextGrayColor } from '@/constants/theme';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    data: any;
}

const itemCountPerLine = 2;

const PropertiesBox = ({ data }: IProps) => {
    const [containerSize, setContainerSize] = useState(0);

    const attributesData = useMemo(() => {
        if (data !== null && data !== undefined && data.length > 0) {
            return data.filter((value: any) => value.key !== 'character_type' && value.key !== 'special');
        }
        return [];
    }, [data]);

    const dataKeys = useMemo(() => {
        if (attributesData.length > 0) {
            let keyArray: any = [];
            for (let key in attributesData) {
                keyArray = keyArray.concat(key);
            }
            return keyArray;
        }
        return [];
    }, [attributesData]);

    const handleCapitalize = (value: string | number) => {
        let values = value.toString().split('_');
        let result = '';
        for (var i = 0; i < values.length; i++) {
            result = result + values[i].charAt(0).toUpperCase() + values[i].slice(1);
            if (i !== values.length - 1) result = result + ' ';
        }
        return result;
    };

    const PropertiesItem = ({ item, size }: any) => {
        return (
            <View style={[styles.itemBox, { width: size }]}>
                <View style={[styles.itemWrapper]}>
                    <Text style={[styles.key]}>{handleCapitalize(item.key)}</Text>
                    <View style={styles.divider} />
                    <View style={styles.valueWapper}>
                        <Text style={[styles.value]}>{handleCapitalize(item.value)}</Text>
                        {item.description && <Text style={[styles.description]}>{handleCapitalize(item.description)}</Text>}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { display: dataKeys.length > 0 ? 'flex' : 'none' }]}>
            <Text style={styles.title}>Properties</Text>
            <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                {dataKeys.map((value: any, index: any) => {
                    return <PropertiesItem key={index} item={attributesData[value]} size={containerSize / itemCountPerLine} />;
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 20,
        borderRadius: 8,
        backgroundColor: BoxColor
    },
    wrapBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    itemBox: {
        marginBottom: 10
    },
    itemWrapper: {
        marginHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: BgColor,
        borderRadius: 8
    },
    title: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 15,
        fontFamily: Lato,
        fontSize: 16,
        color: TextDarkGrayColor
    },
    key: {
        width: '100%',
        fontFamily: Lato,
        fontSize: 12,
        textAlign: 'center',
        color: TextCatTitleColor,
        paddingHorizontal: 10
    },
    valueWapper: {
        alignItems: 'center',
        paddingVertical: 10
    },
    value: {
        width: '100%',
        fontFamily: Lato,
        fontSize: 14,
        textAlign: 'center',
        color: TextColor,
        paddingHorizontal: 10
    },
    description: {
        width: '100%',
        fontFamily: Lato,
        fontSize: 12,
        textAlign: 'center',
        color: TextGrayColor,
        paddingTop: 5,
        paddingHorizontal: 10
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: DividerColor,
        marginVertical: 10
    }
});

export default PropertiesBox;
