import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, BoxColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

interface IProps {
    title: string;
    content: string;
    bgColor?: string;
    titleColor?: string;
    contentColor?: string;
    icon?: boolean;
    iconColor?: string;
    iconType?: string;
    iconName?: string;
    iconSize?: number;
    onPressEvent?: () => void;
}

const TextMenuItem = ({
    title,
    content,
    bgColor = BoxColor,
    titleColor = TextColor,
    contentColor = TextColor,
    icon = false,
    iconColor = WhiteColor,
    iconType = '',
    iconName = '',
    iconSize = 15,
    onPressEvent
}: IProps) => {
    const Icon = () => {
        switch (iconType) {
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />;
            case 'MaterialIcons':
                return <MaterialIcons name={iconName} size={iconSize} color={iconColor} />;
            case 'AntDesign':
                return <AntDesignIcons name={iconName} size={iconSize} color={iconColor} />;
            case 'FontAwesome5':
                return <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />;
            case 'Ionicons':
                return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
            case 'Feather':
                return <Feather name={iconName} size={iconSize} color={iconColor} />;
            case 'SimpleLineIcons':
                return <SimpleLineIcons name={iconName} size={iconSize} color={iconColor} />;
            default:
                break;
        }
    };

    return (
        <View style={[styles.listItem, { backgroundColor: bgColor }]}>
            <Text style={[styles.itemTitle, { color: titleColor }]}>{title}</Text>
            <View style={styles.contentWrapper}>
                <Text style={[styles.content, { color: contentColor, paddingRight: icon ? 5 : 0 }]}>{content}</Text>
                {icon && (
                    <TouchableOpacity
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        onPress={() => {
                            onPressEvent && onPressEvent();
                        }}
                    >
                        <View style={{ paddingTop: 1 }}>{Icon()}</View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listItem: {
        paddingHorizontal: 20,
        height: 58.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: BgColor
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    content: {
        fontFamily: Lato,
        fontSize: 16
    }
});

export default TextMenuItem;