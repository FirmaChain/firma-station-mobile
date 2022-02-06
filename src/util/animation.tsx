import { Animated, LayoutAnimation, Platform, UIManager } from "react-native";

export const fadeIn = (value:Animated.Value) => {
    Animated.timing(value, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    }).start();
};

export const fadeOut = (value:Animated.Value) => {
    Animated.timing(value, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    }).start();
};

export const TurnToOpposite = (value:Animated.Value) => {
    Animated.timing(value, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
    }).start();
};

export const TurnToOriginal = (value:Animated.Value) => {
    Animated.timing(value, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
    }).start();
};

export const degree = (value:Animated.Value) => {
    return value.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    })
} 

export const LayoutAnim = () => {
    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
};