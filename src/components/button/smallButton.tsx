import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BgColor, DisableButtonColor, FailedColor, Lato, PointColor, TextColor, TextDarkGrayColor, WhiteColor } from "@/constants/theme";

interface IProps {
    title: string;
    onPressEvent: Function;
    size?: number;
    height?: number;
    color?: string;
    active?: boolean;
    border?: boolean;
    disableColor?: string;
    disableTextColor?: string;
}

const SmallButton = ({title, onPressEvent, size = 100, height = 42, color = PointColor, active = true, border = false, disableColor = DisableButtonColor, disableTextColor = TextDarkGrayColor}:IProps) => {
    const [buttonHeight, setButtonHeight] = useState(height);

    const handleOnPress = (value?:any) => {
        if(active === false) return;
        onPressEvent && onPressEvent(value);
    }

    const buttonColor = useMemo(() => {
        if(active){
            if(border){
                return {
                    background: BgColor,
                    textColor: TextColor,
                }
            } else {
                return {
                    background: color,
                    textColor: TextColor,
                }
            }
        } else {
            return {
                background: disableColor,
                textColor: disableTextColor,
            }
        }
    }, [active, active, border, color])

    useEffect(() => {
        if(height === 0) return setButtonHeight(0);
        return setButtonHeight(42);
    }, [height]);

    return (
        <View>
            <TouchableOpacity 
                disabled={!active}
                style={[styles.button, 
                    {width: size, 
                    height: buttonHeight, 
                    borderWidth: (border && active)? 1:0,
                    borderColor: WhiteColor,
                    backgroundColor: buttonColor.background}]} 
                onPress={()=>handleOnPress()}>
                    <Text style={[styles.buttonText, {color: buttonColor.textColor}]}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SmallButton;

const styles = StyleSheet.create({
    button: {
        height: 42,
        overflow: "hidden",
        borderRadius: 4,
        justifyContent: "center",
    },
    buttonText: {
        fontFamily: Lato,
        color: TextColor,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "normal",
    },
})