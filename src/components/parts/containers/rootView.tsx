import { ReactNode } from 'react';
import { BgColor, BoxDarkColor } from '@/constants/theme';
import { isMainTabScreen } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
    children: ReactNode;
    bgColor?: string;
}

const RootView = ({ children, bgColor = BgColor }: IProps) => {
    const { name } = useAppSelector((state) => state.wallet);
    const { loggedIn, currentRoute, lockStation, isBioAuthInProgress, appState, appPausedTime } = useAppSelector((state) => state.common);
    const modal = useAppSelector((state) => state.modal);

    const insets = useSafeAreaInsets();

    const isMainPage = isMainTabScreen(currentRoute);
    const isModalOpen = Object.values(modal).some((value) => value === true);

    const chkLoginStatus = name !== '' && loggedIn;
    const isLockStation = chkLoginStatus && lockStation;
    const isDim = chkLoginStatus && isBioAuthInProgress === false && appState !== 'active' && appPausedTime !== '';
    const isDim2 = chkLoginStatus && isBioAuthInProgress === false && appPausedTime !== '';

    const bottomViewBg = isMainPage && !isModalOpen && !isLockStation && !isDim && !isDim2 ? BoxDarkColor : 'transparent';

    const inlineStyles1 = {
        inlineStyle1: {
            backgroundColor: bgColor,
            paddingLeft: insets.left,
            paddingRight: insets.right
        },
        inlineStyle2: { height: insets.top },
        inlineStyle3: {
            height: insets.bottom,
            backgroundColor: bottomViewBg
        }
    } as const;

    return (
        <View style={[styles.container, inlineStyles1.inlineStyle1]}>
            <View style={inlineStyles1.inlineStyle2} />
            {children}
            <View style={[styles.bottomView, inlineStyles1.inlineStyle3]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bottomView: {
        width: '100%',
        bottom: 0
    }
});

export default RootView;
