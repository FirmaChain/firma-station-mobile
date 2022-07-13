import React from "react";
import { View } from "react-native";
import Button from "@/components/button/button";

interface IProps {
    recoverViaSeed: () => void;
    recoverViaQR: (active:boolean) => void;
}

const RecoverMenus = ({recoverViaSeed, recoverViaQR}:IProps) => {
    return (
        <View>
            <View style={{paddingBottom: 20}}>
                <Button
                    title="Use seed phrase"
                    active={true}
                    border={true}
                    onPressEvent={recoverViaSeed}/>
            </View>
            <View style={{paddingBottom: 20}}>
                <Button
                    title="Scan QR code"
                    active={true}
                    border={true}
                    onPressEvent={() => recoverViaQR(true)}/>
            </View>
        </View>
    )
}

export default RecoverMenus;