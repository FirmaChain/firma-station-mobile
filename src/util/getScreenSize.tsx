import { Dimensions } from 'react-native';

export const ScreenWidth = () => {
    const width = Dimensions.get('window').width;

    return width;
};

export const ScreenHeight = () => {
    const height = Dimensions.get('window').height;

    return height;
};
