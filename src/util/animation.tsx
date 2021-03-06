import { Animated, LayoutAnimation, Platform, UIManager } from "react-native";

export const fadeIn = (animated:any, value:Animated.Value, duration:number, toValue:number = 1) => {
    animated.timing(value, {
        toValue: toValue,
        duration: duration,
        useNativeDriver: true,
    }).start();
};

export const fadeOut = (animated:any, value:Animated.Value, duration:number, toValue:number = 0) => {
    animated.timing(value, {
        toValue: toValue,
        duration: duration,
        useNativeDriver: true,
    }).start();
};

export const TurnToOpposite = (animated:any, value:Animated.Value) => {
    animated.timing(value, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
    }).start();
};

export const TurnToOriginal = (animated:any, value:Animated.Value) => {
    animated.timing(value, {
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
};

export const easeInAndOutAnim = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

export const easeInAndOutCustomAnim = (duration: number) => {
    var CustomAnimation = {
        duration: duration,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
          springDamping: 0.7
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
          springDamping: 0.7
        }
      }
    LayoutAnimation.configureNext(CustomAnimation);
}