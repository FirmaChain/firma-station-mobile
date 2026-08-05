import { BoxColor, Lato, TextWarnColor } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

import { ExclamationCircle, QuestionCircle } from '@/components/icon/icon';

interface IProps {
    text: string;
    textColor?: string;
    bgColor?: string;
    align?: string;
    paddingVertical?: number;
    question?: boolean;
    paddingHorizontal?: number;
}

const WarnContainer = ({
    bgColor = BoxColor,
    paddingVertical = 15,
    paddingHorizontal = 20,
    text,
    textColor = TextWarnColor,
    question = false
}: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: { backgroundColor: bgColor, paddingVertical, paddingHorizontal },
        inlineStyle2: { height: 20, justifyContent: 'center' },
        inlineStyle3: { color: textColor }
    } as const;

    return (
        <View style={[styles.wranContainer, inlineStyles1.inlineStyle1]}>
            <View style={styles.box}>
                <View style={inlineStyles1.inlineStyle2}>
                    {question ? <QuestionCircle size={15} color={textColor} /> : <ExclamationCircle size={15} color={textColor} />}
                </View>
                <Text style={[styles.warnText, inlineStyles1.inlineStyle3]}>{text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wranContainer: {
        flexGrow: 1,
        fontFamily: Lato,
        backgroundColor: BoxColor,
        borderRadius: 4,
        overflow: 'hidden'
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    warnText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        paddingLeft: 10
    }
});

export default WarnContainer;
