import { InputBgColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
    title: string;
    value: string;
    focus: boolean;
    onPressEvent: () => void;
}

const QuestionItem = ({ title, value, focus, onPressEvent }: IProps) => {
    const val = value;
    const bc = focus ? WhiteColor : 'transparent';

    const inlineStyles1 = {
        inlineStyle1: { borderColor: bc, color: val === 'select' ? InputPlaceholderColor : TextColor }
    } as const;

    return (
        <View style={styles.viewContainer}>
            <Text style={styles.text}>{title}</Text>
            <TouchableOpacity onPress={() => onPressEvent()}>
                <Text style={[styles.quiz, inlineStyles1.inlineStyle1]}>{val}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 20
    },
    text: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        marginBottom: 5
    },
    quiz: {
        width: 160,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        color: InputPlaceholderColor,
        overflow: 'hidden'
    }
});

export default QuestionItem;
