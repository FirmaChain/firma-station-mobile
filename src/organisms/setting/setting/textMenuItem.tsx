import { ReactNode } from 'react';
import { BgColor, BoxColor, Lato, TextColor } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
    title: string;
    content: string;
    bgColor?: string;
    titleColor?: string;
    contentColor?: string;
    icon?: ReactNode;
    onPressEvent?: () => void;
}

const TextMenuItem = ({
    title,
    content,
    bgColor = BoxColor,
    titleColor = TextColor,
    contentColor = TextColor,
    icon,
    onPressEvent
}: IProps) => {
    return (
        <View style={[styles.listItem, { backgroundColor: bgColor }]}>
            <Text style={[styles.itemTitle, { color: titleColor }]}>{title}</Text>
            <View style={styles.contentWrapper}>
                <Text style={[styles.content, { color: contentColor, paddingRight: 0 }]}>{content}</Text>
                {icon && (
                    <TouchableOpacity
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        onPress={() => onPressEvent?.()}
                        style={{ marginLeft: 8 }}
                    >
                        <View style={{ paddingTop: 1 }}>{icon}</View>
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
