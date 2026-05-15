import { ReactNode } from 'react';
import { BgColor, BoxDarkColor } from '@/constants/theme';
import { isMainTabScreen } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: bgColor,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }
            ]}
        >
            {children}
            <View
                style={[
                    styles.bottomView,
                    {
                        height: insets.bottom,
                        backgroundColor: bottomViewBg
                    }
                ]}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bottomView: {
        width: '100%',
        position: 'absolute',
        bottom: 0
    }
});

export default RootView;
