import { FailedColor, RestakeActiveColor } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

interface IProps {
    title: string;
}

const NetworkBadge = ({ title }: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: { backgroundColor: title === 'TestNet' ? FailedColor : RestakeActiveColor }
    } as const;

    return <View style={[styles.dot, inlineStyles1.inlineStyle1]} pointerEvents="none" accessibilityLabel={`${title} network`} />;
};

const styles = StyleSheet.create({
    dot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4
    }
});

export default NetworkBadge;
