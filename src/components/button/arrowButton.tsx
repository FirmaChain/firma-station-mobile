import { WhiteColor } from '@/constants/theme';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { BackArrow } from '../icon/icon';

interface IProps {
    onPressEvent: () => void;
}

const ArrowButton = ({ onPressEvent }: IProps) => {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={() => onPressEvent()} style={styles.inlineStyle1}>
            <BackArrow size={25} color={WhiteColor} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingHorizontal: 20, paddingVertical: 10 }
});

export default ArrowButton;
