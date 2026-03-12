import React, { useRef } from 'react';
import { isMainTabScreen, Screens } from '@/navigators/appRoutes';
import Home from '@/organisms/home';
import { useAppSelector } from '@/redux/hooks';

const HomeScreen = () => {
    const { currentRoute } = useAppSelector((state) => state.common);
    const lastMainRouteRef = useRef<Screens>(Screens.Wallet);

    if (isMainTabScreen(currentRoute)) {
        lastMainRouteRef.current = currentRoute as Screens;
    }

    return <Home title={lastMainRouteRef.current} />;
};

export default React.memo(HomeScreen);
