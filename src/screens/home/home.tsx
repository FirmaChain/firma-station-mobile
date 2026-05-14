import React, { useRef } from 'react';
import { isMainTabScreen, Screens, StackParamList } from '@/navigators/appRoutes';
import Home from '@/organisms/home';
import { useAppSelector } from '@/redux/hooks';

import { RouteProp } from '@react-navigation/native';

type HomeScreenRouteProp = RouteProp<StackParamList, Screens.Home>;

interface IProps {
    route: HomeScreenRouteProp;
}

const HomeScreen = ({ route }: IProps) => {
    const { currentRoute } = useAppSelector((state) => state.common);
    const lastMainRouteRef = useRef<Screens>(Screens.Wallet);

    if (isMainTabScreen(currentRoute)) {
        lastMainRouteRef.current = currentRoute as Screens;
    }

    return <Home title={lastMainRouteRef.current} loadingRequestId={route.params?.loadingRequestId} />;
};

export default React.memo(HomeScreen);
