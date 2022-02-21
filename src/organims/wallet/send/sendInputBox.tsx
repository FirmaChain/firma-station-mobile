import InputSetVerticalForAddress from "@/components/input/inputSetVerticalForAddress";
import React from "react";
import { StyleSheet, View } from "react-native";
import InputSetVertical from "../../../components/input/inputSetVertical";

interface Props {
    address: any;
    amount: any;
    memo: any;
    reset: boolean;
}

const SendInputBox = ({address, amount, memo, reset}:Props) => {
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
            <InputSetVerticalForAddress
                title="To address"
                message=""
                validation={true}
                placeholder="Address"
                resetValues={reset}
                onChangeEvent={handleAddress}/>
            <InputSetVertical
                title="Amount"
                message=""
                numberOnly={true}
                validation={true}
                placeholder="0 FCT"
                resetValues={reset}
                onChangeEvent={handleAmount}/>
            <InputSetVertical
                title="Memo"
                message=""
                validation={true}
                placeholder="Memo"
                resetValues={reset}
                onChangeEvent={handleMemo}/>
        </View>
    )
}

const style = StyleSheet.create({

})

export default SendInputBox;