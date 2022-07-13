import React from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { PLACEHOLDER_FOR_PASSWORD } from "@/constants/common";
import InputSetVertical from "@/components/input/inputSetVertical";

interface IProps {
    resetValues: boolean;
    handlePassword: (value:string) => void;
}

const InputBox = ({resetValues, handlePassword}:IProps) => {
    const currentPasswordTextObj = {
        title: "Current password",
        placeholder: PLACEHOLDER_FOR_PASSWORD,
    }

    return (
        <Pressable style={styles.contents} onPress={()=>Keyboard.dismiss()}>
            <InputSetVertical
                title={currentPasswordTextObj.title}
                placeholder={currentPasswordTextObj.placeholder} 
                validation={true}
                secure={true}
                resetValues={resetValues}
                onChangeEvent={handlePassword} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    contents: {
        flex: 2,
        paddingVertical: 20,
    },
    wallet:{
        paddingVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#aaa',
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
    }
})


export default InputBox;