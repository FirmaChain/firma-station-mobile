import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ContainerColor, TextColor } from "../../constants/theme";
import { ScreenWidth } from "../../util/getScreenSize";

const InputDropboxVertical: React.FC<{
    title: string;
    items: string[];
    onChangeEvent: Function;
}> = ({title, items, onChangeEvent}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const [item, setItem]:any[] = useState(items);

    useEffect(() => {
        onChangeEvent && onChangeEvent(selected);
    }, [selected])

    return (
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
            </View>
            <DropDownPicker
                style={styles.dropdownContainer}
                dropDownContainerStyle={{borderColor: 'dodgerblue'}}
                placeholder="Select"
                placeholderStyle={{
                    color: "grey",
                    fontWeight: "300"
                }}
                mode="SIMPLE"
                dropDownDirection="AUTO"
                open={open}
                value={selected}
                items={item}
                setOpen={setOpen}
                setValue={setSelected}
                setItems={setItem} />
        </View>
    )
}

export default InputDropboxVertical;

const styles = StyleSheet.create({
    viewContainer: {
        width: ScreenWidth(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        zIndex: 10,
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 5,
    },
    text: {
        flex: 1,
        fontSize: 16,
        color: TextColor,
    },
    dropdownContainer: {
        width: 'auto',
        borderColor: 'dodgerblue',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
})
