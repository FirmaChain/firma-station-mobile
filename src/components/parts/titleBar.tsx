import { GrayColor, InputPlaceholderColor, Lato, TextColor } from '@/constants/theme';
import { ScreenWidth } from '@/util/getScreenSize';
import { Keyboard, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { QuestionFilledCircle } from '../icon/icon';

interface IProps {
    title: string;
    subTitle?: string;
    handleGuide?: () => void;
}

const TitleBar = ({ title, subTitle = '', handleGuide }: IProps) => {
    return (
        <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
            <Text style={styles.title}>
                {title}
                {subTitle !== '' && <Text style={[styles.title, styles.inlineStyle1]}>{` ${subTitle}`}</Text>}
            </Text>
            {handleGuide && (
                <TouchableOpacity style={styles.guide} onPress={() => handleGuide()}>
                    <QuestionFilledCircle size={18} color={GrayColor} />
                </TouchableOpacity>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { fontSize: 14, color: InputPlaceholderColor },
    container: {
        height: 50,
        width: ScreenWidth(),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        // paddingBottom: 18
    },
    title: {
        fontFamily: Lato,
        fontSize: 24,
        fontWeight: '700',
        color: TextColor
    },
    guide: {
        paddingLeft: 5,
        paddingRight: 10,
        paddingVertical: 5,
        marginTop: 3
    }
});

export default TitleBar;
