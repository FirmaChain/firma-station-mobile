import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SmallButton from "../../../components/button/smallButton";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";
import { BorderColor, BoxColor, ContainerColor, DisableColor, Lato, TextCatTitleColor, TextColor } from "../../../constants/theme";

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
        <View style={styles.rewardBox}>
            <View style={styles.divider}/>
            <View style={styles.boxH}>
                <Text style={styles.title}>{reward.title}</Text>
                <Text style={styles.desc}>{rewardData.toFixed(2)}
                    <Text style={[styles.title, {fontSize: 14}]}>  FCT</Text>
                </Text>
            </View>
            <View style={[styles.boxH, {paddingBottom: 20, justifyContent: "flex-end"}]}>
                <SmallButton
                    title={fromVD? "Withdraw" : "Withdraw All"}
                    size={fromVD? 100 : 150}
                    onPressEvent={() => handleWithdraw(true)}/>
            </View>
            <TransactionConfirmModal transactionHandler={transactionHandler} title={fromVD? "Withdraw" : "Withdraw All"} walletName={""} amount={rewardData} open={openModal} setOpenModal={handleWithdraw} />
        </View>
    )
}

const styles = StyleSheet.create({
    rewardBox: {
        paddingHorizontal: 20,
        alignItems: "center",
    },
    divider: {
        width: "100%",
        height: 1,
        marginBottom: 20,
        backgroundColor: DisableColor,
    },
    boxH: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
    },
    title: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor,
    },
    desc: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
    }
})

export default RewardBox;