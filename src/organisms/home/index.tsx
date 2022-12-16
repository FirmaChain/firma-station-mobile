import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { GUIDE_URI } from '@/../config';
import { Linking } from 'react-native';
import TabContainer from '@/components/parts/containers/tabContainer';
import TabNavigators from '@/navigators/tabNavigators';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

interface IProps {
    title: string;
}

const Home = ({ title }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const key = title.toLowerCase();

    const moveToSetting = () => {
        navigation.navigate(Screens.Setting);
    };

    const moveToHistory = () => {
        navigation.navigate(Screens.History);
    };

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[key]});
        Linking.openURL(GUIDE_URI[key]);
    };

    useEffect(() => {
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime('');
        CommonActions.handleLoggedIn(true);
        CommonActions.handleLoadingProgress(false);
    }, []);

    return (
        <TabContainer
            title={title}
            handleGuide={key === 'dapps' ? undefined : handleMoveToWeb}
            settingNavEvent={moveToSetting}
            historyNavEvent={moveToHistory}
        >
            <TabNavigators />
        </TabContainer>
    );
};

export default Home;
