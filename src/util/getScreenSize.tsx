import { Dimensions } from "react-native"

export const ScreenWidth = () => {
    var width = Dimensions.get('window').width;

    return width;
}

export const ScreenHeight = () => {
    var height = Dimensions.get('window').height;

    return height;
}