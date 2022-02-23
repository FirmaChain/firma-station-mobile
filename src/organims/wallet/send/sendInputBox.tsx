import InputSetVerticalForAddress from "@/components/input/inputSetVerticalForAddress";
import InputSetVerticalForAmount from "@/components/input/inputSetVerticalForAmount";
import React from "react";
import { StyleSheet, View } from "react-native";
import InputSetVertical from "../../../components/input/inputSetVertical";

interface Props {
    address: any;
    amount: any;
    memo: any;
    limitAmount: number;
    reset: boolean;
}

const SendInputBox = ({address, amount, memo, limitAmount, reset}:Props) => {
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
        <>
        <InputSetVerticalForAddress
            title="To address"
            placeholder="Address"
            resetValues={reset}
            onChangeEvent={handleAddress}/>
        <InputSetVerticalForAmount
            title="Amount"
            placeholder="0 FCT"
            limitValue={limitAmount}
            resetValues={reset}
            onChangeEvent={handleAmount}/>
        <InputSetVertical
            title="Memo"
            message=""
            validation={true}
            placeholder="Memo"
            resetValues={reset}
            onChangeEvent={handleMemo}/>
        </>
    )
}

const style = StyleSheet.create({

})

export default SendInputBox;