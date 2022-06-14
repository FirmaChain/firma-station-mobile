import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Home from "@/organisms/home";

interface Props {
    route: {}
}

const HomeScreen = (props:Props) => {
    const routeName = getFocusedRouteNameFromRoute(props.route);
    return (
        <Home title={routeName === undefined? "Wallet" : routeName} />
    )
}

export default React.memo(HomeScreen);