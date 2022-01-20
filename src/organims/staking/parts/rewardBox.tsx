import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SmallButton from "../../../components/button/smallButton";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";
import { BorderColor, BoxColor, ContainerColor, DisableColor, Lato, PointColor, PointDarkColor, TextCatTitleColor, TextColor, TextLightGrayColor } from "../../../constants/theme";

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
            <View style={styles.boxV}>
                <Text style={[styles.title, {marginBottom: 6}]}>{reward.title}</Text>
                <Text style={styles.desc}>{rewardData.toFixed(2)}
                    <Text style={[styles.title, {fontSize: 14, fontWeight: "normal"}]}>  FCT</Text>
                </Text>
            </View>
            <SmallButton
                title={"Withdraw"}
                size={130}
                color={PointDarkColor}
                onPressEvent={() => handleWithdraw(true)}/>
            <TransactionConfirmModal transactionHandler={transactionHandler} title={fromVD? "Withdraw" : "Withdraw All"} walletName={""} amount={rewardData} open={openModal} setOpenModal={handleWithdraw} />
        </View>
    )
}

const styles = StyleSheet.create({
    rewardBox: {
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 22,
        marginBottom: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: PointColor,
    },
    divider: {
        width: "100%",
        height: 1,
        marginBottom: 20,
        backgroundColor: DisableColor,
    },
    boxV:{

    },
    boxH: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "600",
        color: TextLightGrayColor,
    },
    desc: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: "600",
        color: TextColor,
    }
})

export default RewardBox;