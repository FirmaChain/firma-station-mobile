import { StyleSheet, View } from 'react-native';

import Button from '@/components/button/button';

interface IProps {
    active: boolean;
    rejectTitle: string;
    confirmTitle: string;
    handleReject: () => void;
    handleConfirm: () => void;
}

const DappButtonBox = ({ active, rejectTitle, confirmTitle, handleReject, handleConfirm }: IProps) => {
    return (
        <View style={styles.modalButtonBox}>
            <View style={styles.inlineStyle1}>
                <Button title={rejectTitle} active={active} border={true} onPressEvent={() => handleReject()} />
            </View>
            <View style={styles.inlineStyle2} />
            <View style={styles.inlineStyle3}>
                <Button title={confirmTitle} active={active} onPressEvent={() => handleConfirm()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { flex: 1 },
    inlineStyle2: { width: 10 },
    inlineStyle3: { flex: 1 },
    modalButtonBox: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default DappButtonBox;
