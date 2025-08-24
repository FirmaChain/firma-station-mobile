import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { BoxDarkColor, DisableButtonColor, WhiteColor } from '@/constants/theme';
import { BackArrow, Close, ForwardArrow, RefreshIcon } from '@/components/icon/icon';
import WebView, { WebViewNavigation } from 'react-native-webview';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.WebScreen>;

interface IProps {
    uri: string;
}

const Web = ({ uri }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const webViewRef = useRef<WebView>(null);
    const [navState, setNavState] = useState<WebViewNavigation>();
    const [backArrowActive, setBackArrowActive] = useState(false);
    const [forwardArrowActive, setForwardArrowActive] = useState(false);
    const [messageFromWeb, setMessageFromWeb] = useState('');

    useEffect(() => {
        if (messageFromWeb === 'close') {
            return handleBack();
        }
    }, [messageFromWeb]);

    useEffect(() => {
        if (navState !== undefined) {
            const { canGoBack, canGoForward } = navState;

            setBackArrowActive(canGoBack);
            setForwardArrowActive(canGoForward);
        }
    }, [navState]);

    const onPressTools = (type: string) => {
        if (navState !== undefined) {
            const { canGoBack, canGoForward } = navState;
            if (type === 'back' && canGoBack) {
                webViewRef.current?.goBack();
            }
            if (type === 'forward' && canGoForward) {
                webViewRef.current?.goForward();
            }
        }
    };

    const onPressRefresh = () => {
        if (navState !== undefined) {
            webViewRef.current?.reload();
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const CloseButton = () => {
        return (
            <React.Fragment>
                <Pressable style={{ paddingHorizontal: 20 }} onPress={handleBack}>
                    <Close size={30} color={WhiteColor} />
                </Pressable>
            </React.Fragment>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: BoxDarkColor }]}>
            <View style={styles.box}>
                <CloseButton />
                <View style={[styles.box, { justifyContent: 'flex-end', paddingHorizontal: 20 }]}>
                    <TouchableOpacity
                        disabled={backArrowActive === false}
                        onPress={() => onPressTools('back')}
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        style={{ marginRight: 20 }}>
                        <BackArrow size={25} color={backArrowActive ? WhiteColor : DisableButtonColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={forwardArrowActive === false}
                        onPress={() => onPressTools('forward')}
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        style={{ marginRight: 20 }}>
                        <ForwardArrow size={25} color={forwardArrowActive ? WhiteColor : DisableButtonColor} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPressRefresh()}>
                        <RefreshIcon size={30} color={WhiteColor} />
                    </TouchableOpacity>
                </View>
            </View>
            <WebView
                ref={webViewRef}
                onNavigationStateChange={setNavState}
                source={{ uri: uri }}
                onMessage={message => {
                    setMessageFromWeb(message.nativeEvent.data);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    box: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default Web;
