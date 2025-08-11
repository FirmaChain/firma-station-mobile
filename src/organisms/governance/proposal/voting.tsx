import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions } from '@/redux/actions';
import { getEstimateGasVoting, getFeesFromGas, getFirmaConfig } from '@/util/firma';
import { BgColor, BoxColor, Lato, TextColor, TextDarkGrayColor, WhiteColor } from '@/constants/theme';
import Button from '@/components/button/button';
import CustomModal from '@/components/modal/customModal';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import AlertModal from '@/components/modal/alertModal';
import { wait } from '@/util/common';
import { VOTE_TYPE } from '@/constants/types';

interface IProps {
    isVotingPeriod: boolean;
    proposalId: number;
    transactionHandler: (password: string, gas: number, votingOpt: number) => void;
}

const cols = 2;
const marginHorizontal = 5;
const marginVertical = 5;
const width = (Dimensions.get('window').width - 20) / cols - marginHorizontal * (cols + 1);

const Voting = ({ isVotingPeriod, proposalId, transactionHandler }: IProps) => {
    const { wallet } = useAppSelector(state => state);
    const { requestIds, loading } = useAppSelector(state => state.common);

    //? Added this progress state to prevent button enabled when switching modals
    //? After clicking "next" button from vote modal, there is 100ms+ delay before tx modal opens.
    const [progress, setProgress] = useState(false);

    const [votingGas, setVotingGas] = useState(getFirmaConfig().defaultGas);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const [selectedVote, setSelectedVote] = useState('');
    const [openVoteModal, setOpenVoteModal] = useState(false);
    const [openTransactionModal, setOpenTransactionModal] = useState(false);

    const handleVoteModal = (open: boolean) => {
        if (open) setSelectedVote('');
        setOpenVoteModal(open);
    };

    const handleTransactionModal = (open: boolean) => {
        setOpenTransactionModal(open);
    };

    const handleTransaction = (password: string) => {
        if (alertDescription !== '') return handleModalOpen(true);
        transactionHandler(password, votingGas, getVotingOption(selectedVote));
    };

    const handleModalOpen = (open: boolean) => {
        setIsAlertModalOpen(open);
    };

    const getVotingOption = (vote: string) => {
        switch (vote) {
            case 'YES':
                return 1;
            case 'NO':
                return 3;
            case 'NoWithVeto':
                return 4;
            case 'Abstain':
                return 2;
            default:
                return 0;
        }
    };

    const handleVoting = async () => {
        handleVoteModal(false);
        CommonActions.handleLoadingProgress(true);
        try {
            const result = await getEstimateGasVoting(wallet.name, proposalId, getVotingOption(selectedVote));
            setVotingGas(result);
            setAlertDescription('');
            setProgress(true); // prevent modal transition gap makes vote button enabled
            CommonActions.handleLoadingProgress(false);
            wait(100).then(() => {
                handleTransactionModal(true);
                setProgress(false);
            });
        } catch (error) {
            console.log(error);
            setProgress(true);
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            wait(100).then(() => {
                handleModalOpen(true);
                setProgress(false);
            });
            throw error;
        } finally {
            if (progress) setProgress(false);
        }
    };

    const enableButton = useMemo(() => {
        // Enable button when
        // + period is voting
        // + any of modal is not open
        // + requestIds is empty
        // + loading is false
        // + progress is false
        return (
            isVotingPeriod &&
            !openVoteModal &&
            !openTransactionModal &&
            !isAlertModalOpen &&
            requestIds.length === 0 &&
            !loading &&
            !progress
        );
    }, [isVotingPeriod, openVoteModal, openTransactionModal, isAlertModalOpen, requestIds, loading, progress]);

    return (
        <React.Fragment>
            <View style={{ paddingHorizontal: 20, display: 'flex' }}>
                {isVotingPeriod && <Button title="Vote" active={enableButton} onPressEvent={() => handleVoteModal(true)} />}
            </View>
            <CustomModal visible={openVoteModal} handleOpen={handleVoteModal}>
                <View style={styles.modalTextContents}>
                    <Text style={styles.title}>Voting</Text>
                    <View style={styles.box}>
                        {VOTE_TYPE.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.borderBox,
                                        {
                                            borderColor: selectedVote === item ? WhiteColor : BoxColor,
                                            marginBottom: index < 2 ? marginVertical * 4 : 0,
                                            marginLeft: index % 2 === 0 ? 0 : marginHorizontal * 2,
                                        },
                                    ]}
                                    onPress={() => setSelectedVote(item)}>
                                    <Text
                                        style={[
                                            styles.vote,
                                            {
                                                color: selectedVote === item ? WhiteColor : TextDarkGrayColor,
                                                fontWeight: selectedVote === item ? '600' : 'normal',
                                            },
                                        ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <Button title="Next" active={selectedVote !== ''} onPressEvent={() => handleVoting()} />
                </View>
            </CustomModal>
            <TransactionConfirmModal
                transactionHandler={handleTransaction}
                title={'Voting'}
                amount={0}
                vote={selectedVote}
                fee={getFeesFromGas(votingGas)}
                open={openTransactionModal}
                setOpenModal={handleTransactionModal}
            />
            {isAlertModalOpen && (
                <AlertModal
                    visible={isAlertModalOpen}
                    handleOpen={handleModalOpen}
                    title={'Failed'}
                    desc={alertDescription}
                    confirmTitle={'OK'}
                    type={'ERROR'}
                />
            )}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    modalTextContents: {
        width: '100%',
        padding: 20,
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: 'bold',
        color: TextDarkGrayColor,
    },
    box: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 30,
    },
    borderBox: {
        width: width,
        height: 68,
        borderWidth: 2,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BgColor,
    },
    voteItem: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
    },
    vote: {
        width: 'auto',
        fontFamily: Lato,
        fontSize: 16,
    },
});

export default Voting;
