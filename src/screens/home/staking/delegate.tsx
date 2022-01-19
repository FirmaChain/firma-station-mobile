import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "../../../components/parts/containers/conatainer";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import InputSetVertical from "../../../components/input/inputSetVertical";
import Button from "../../../components/button/button";
import ViewContainer from "../../../components/parts/containers/viewContainer";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";
import { ContainerColor } from "../../../constants/theme";
import Icon from "react-native-vector-icons/AntDesign";
import ValidatorSelectModal from "../../../organims/staking/delegate/validatorSelectModal";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Delegate>;

export type DelegateParams = {
    type: string;
}

interface DelegateScreenProps {
    route: {params: DelegateParams};
    navigation: ScreenNavgationProps;
}

const DelegateScreen: React.FunctionComponent<DelegateScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {type} = params;

    const [amount, setAmount] = useState(0);
    const [status, setStatus] = useState(0);
    const [openSignModal, setOpenSignModal] = useState(false);

    const [selectVD, setSelectVD] = useState("");
    const [openSelectModal, setOpenSelectModal] = useState(false);

    const dummyValList = [
        "VALIDATOR 1",
        "VALIDATOR 2",
        "VALIDATOR 3",
    ]

    const handleTransaction = () => {
        navigation.navigate(Screens.Transaction);
    }

    const handleAmount = (value:number) => {
        setStatus(0);
        setAmount(value);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    const ClassifyByType = () => {
        switch (type) {
            case "Delegate":
            case "Undelegate":
                return delegate();
            case "Redelegate":
                return redelegate();
        }
    }

    const delegate = () => {
        return (
            <View style={styles.conatainer}>
                <View style={[styles.boxH, {paddingVertical: 20}]}>
                    <Text>Available</Text>
                    <Text>123.00 FCT</Text>
                </View>
                <InputSetVertical
                    title="Amount"
                    numberOnly={true}
                    placeholder="0"
                    validation={true}
                    onChangeEvent={handleAmount}/>
            </View>
        )
    }

    const redelegate = () => {
        return (
            <View>
                <View style={styles.conatainer}>
                    <View style={[styles.boxH, {paddingVertical: 20}]}>
                        <View style={styles.selectBox}>
                            <Text style={styles.title}>Source Validator</Text>
                            <TouchableOpacity style={styles.select} onPress={()=>handleSelectModal(true)}>
                                <Text style={[styles.selectTitle]}>{selectVD === ""? "Select..." : selectVD}</Text>
                                <Icon name="caretdown" size={15} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {selectVD !== "" && delegate()}
            </View>
        )
    }

    const handleNext = () => {
        if(status > 0) return; 
        setStatus(status + 1);
    }

    const handleSignModal = (open:boolean) => {
        setOpenSignModal(open);
        if(open === false) setStatus(status - 1);
    }

    const handleSelectValidator = (value:number) => {
        setSelectVD(dummyValList[value]);
    }

    const handleSelectModal = (open:boolean) => {
        setOpenSelectModal(open);
    }

    useEffect(() => {
        setOpenSignModal(status > 0);
    }, [status])

    return (
        <Container
            title={type}
            backEvent={handleBack}>
                <ViewContainer>
                    <>
                    {ClassifyByType()}
                    <TransactionConfirmModal transactionHandler={handleTransaction} title={type} walletName={""} amount={amount} open={openSignModal} setOpenModal={handleSignModal} />
                    <ValidatorSelectModal list={dummyValList} open={openSelectModal} setOpenModal={handleSelectModal} setValue={handleSelectValidator}/> 
                    <View style={styles.buttonBox}>
                        <Button
                            title={"Next"}
                            active={Number(amount) > 0}
                            onPressEvent={handleNext}/>
                    </View>
                    </>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    conatainer: {
        paddingHorizontal: 20,
    },
    boxH: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
    },

    selectBox: {
        width: "100%",
    },
    title: {
        color: ContainerColor,
        fontSize:16,
        marginBottom: 5,
    },
    select: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: ContainerColor,
        backgroundColor: '#fff',
        marginBottom: 5,
    },
    selectTitle: {
        fontSize:14,
    },
})

export default DelegateScreen;