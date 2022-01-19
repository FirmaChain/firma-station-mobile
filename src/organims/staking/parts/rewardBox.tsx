import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SmallButton from "../../../components/button/smallButton";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";
import { ContainerColor } from "../../../constants/theme";

interface Props {
    reward: any;
    fromVD?: boolean;
    transactionHandler: Function;
}

const RewardBox = ({fromVD, reward, transactionHandler}:Props) => {
    const [openModal, setOpenModal] = useState(false);
    
    const rewardData = useMemo(() => {
        return reward.data;
    }, [reward]);
    
    const handleWithdraw = (open:boolean) => {
        setOpenModal(open);
    }

    return (
        <View>
            <View style={styles.rewardBox}>
                <View style={styles.boxH}>
                    <Text>{reward.title}</Text>
                    <Text>{rewardData.toFixed(2)} FCT</Text>
                </View>
                <SmallButton
                    title={fromVD? "Withdraw" : "Withdraw All"}
                    onPressEvent={handleWithdraw}/>
            </View>
            <TransactionConfirmModal transactionHandler={transactionHandler} title={fromVD? "Withdraw" : "Withdraw All"} walletName={""} amount={rewardData} open={openModal} setOpenModal={handleWithdraw} />
        </View>
    )
}

const styles = StyleSheet.create({
    rewardBox: {
        marginHorizontal: 20,
        borderColor: ContainerColor, 
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        alignItems: "flex-end",
    },
    boxH: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
    }
})

export default RewardBox;