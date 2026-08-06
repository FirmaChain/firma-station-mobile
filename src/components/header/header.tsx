import { BorderColor, BoxDarkColor, Lato, PointColor, TextColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { ScreenWidth } from '@/util/getScreenSize';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import ArrowButton from '../button/arrowButton';
import NetworkBadge from '../parts/networkBadge';

interface IProps {
    step: number;
    bgColor?: string;
    onPressEvent: () => void;
}

const Header = ({ step, bgColor = BoxDarkColor, onPressEvent }: IProps) => {
    const { network } = useAppSelector((state) => state.storage);

    const inlineStyles1 = {
        inlineStyle1: { backgroundColor: bgColor }
    } as const;

    return (
        <Pressable style={[styles.container, inlineStyles1.inlineStyle1]} onPress={() => Keyboard.dismiss()}>
            <ArrowButton onPressEvent={onPressEvent} />
            {step > 0 ? (
                <View style={styles.stepBox}>
                    <View style={step === 1 ? styles.step : styles.stepNone}>
                        <Text style={[styles.stepText, step === 1 && styles.inlineStyle1]}>{step}</Text>
                    </View>
                    <View style={styles.divier} />
                    <View style={step === 2 ? styles.step : styles.stepNone}>
                        <Text style={[styles.stepText, step === 2 && styles.inlineStyle2]}>{step}</Text>
                    </View>
                    <View style={styles.divier} />
                    <View style={step === 3 ? styles.step : styles.stepNone}>
                        <Text style={[styles.stepText, step === 3 && styles.inlineStyle3]}>{step}</Text>
                    </View>
                </View>
            ) : (
                network !== 'MainNet' && <NetworkBadge top={-5} title={network} />
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { opacity: 1 },
    inlineStyle2: { opacity: 1 },
    inlineStyle3: { opacity: 1 },
    container: {
        height: 50,
        width: ScreenWidth(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    stepBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    stepText: {
        fontFamily: Lato,
        fontWeight: '700',
        color: TextColor,
        fontSize: 14,
        textAlign: 'center',
        opacity: 0
    },
    step: {
        backgroundColor: PointColor,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    stepNone: {
        backgroundColor: BorderColor,
        width: 12,
        height: 12,
        borderRadius: 50
    },
    divier: {
        width: 16,
        height: 0.5,
        backgroundColor: BorderColor
    }
});

export default Header;
