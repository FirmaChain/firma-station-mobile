import React from "react";
import { StyleSheet, View } from "react-native";
import InputSetVertical from "../../../components/input/inputSetVertical";

interface Props {
    address: any;
    amount: any;
    memo: any;
}

const SendInputBox = ({address, amount, memo}:Props) => {

    const handleAddress = (value:string) => {
        address(value);
    }

    const handleAmount = (value:number) => {
        amount(value);
    }

    const handleMemo = (value:string) => {
        memo(value);
    }
    return (
        <View>
            <InputSetVertical
                title="To address"
                message=""
                validation={true}
                placeholder="Address"
                onChangeEvent={handleAddress}/>
            <InputSetVertical
                title="Amount"
                message=""
                validation={true}
                placeholder="0 FCT"
                onChangeEvent={handleAmount}/>
            <InputSetVertical
                title="Memo"
                message=""
                validation={true}
                placeholder="Memo"
                onChangeEvent={handleMemo}/>
        </View>
    )
}

const style = StyleSheet.create({

})

export default SendInputBox;