import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MnemonicItems from './mnemonicItems';
import QuestionItem from './questionItem';

interface IProps {
    mnemonic: string;
    handleConfirm: Function;
}

const MnemonicQuiz = ({ mnemonic, handleConfirm }: IProps) => {
    const [answer, setAnswer] = useState<String[]>([]);
    const [selectQuiz, setSelectQuiz] = useState(0);
    const [selectAnswer, setSelectAnswer] = useState({
        first: 'select',
        second: 'select'
    });

    const mnemonicArr = mnemonic.split(' ');
    const randomIndex = useMemo(() => {
        let result = [];
        let random = Math.round(Math.random() * (mnemonicArr.length - 1 - 0));

        result.push(random);

        while (result[0] === random) {
            random = Math.round(Math.random() * (mnemonicArr.length - 1 - 0));
        }
        result.push(random);

        const a: string[] = [mnemonicArr[result[0]], mnemonicArr[result[1]]];
        setAnswer(a);
        return result;
    }, []);

    const mnemonicItems = useMemo(() => {
        let result: string[] = [];
        randomIndex.map((item) => result.push(mnemonicArr[item]));

        do {
            let random = Math.round(Math.random() * (mnemonicArr.length - 1 - 0));
            if (!result.includes(mnemonicArr[random])) result.push(mnemonicArr[random]);
        } while (result.length < 6);
        result.sort(() => Math.random() - 0.5);

        return result;
    }, [randomIndex]);

    const getOrdinal = (number: Number) => {
        const numString = number.toString().split('');
        const lastNum = numString[numString.length - 1];

        if (Number(lastNum) === 1) return number + 'st';
        if (Number(lastNum) === 2) return number + 'nd';
        if (Number(lastNum) === 3) return number + 'rd';
        return number + 'th';
    };

    const handleAnswer = (index: number) => {
        if (selectQuiz === 0) {
            setSelectAnswer({
                ...selectAnswer,
                first: mnemonicItems[index]
            });
            setSelectQuiz(1);
        }

        if (selectQuiz === 1) {
            setSelectAnswer({
                ...selectAnswer,
                second: mnemonicItems[index]
            });
            setSelectQuiz(0);
        }
    };

    useEffect(() => {
        const compareAnswer = () => {
            if (answer[0] === selectAnswer.first && answer[1] === selectAnswer.second) {
                handleConfirm(true);
            } else {
                handleConfirm(false);
            }
        };
        compareAnswer();
    }, [selectAnswer]);

    // useEffect(() => {
    //     console.log(Platform.OS + ' answer -', answer);
    // }, [answer]);

    return (
        <View style={styles.conatainer}>
            <View style={styles.quizContainer}>
                <QuestionItem
                    title={getOrdinal(randomIndex[0] + 1) + ' word'}
                    value={selectAnswer.first}
                    focus={selectQuiz === 0}
                    onPressEvent={() => setSelectQuiz(0)}
                />
                <QuestionItem
                    title={getOrdinal(randomIndex[1] + 1) + ' word'}
                    value={selectAnswer.second}
                    focus={selectQuiz === 1}
                    onPressEvent={() => setSelectQuiz(1)}
                />
            </View>
            <View style={styles.quizContainer}>
                <MnemonicItems mnemonicItems={mnemonicItems} onPressEvent={handleAnswer} />
            </View>
        </View>
    );
};

export default MnemonicQuiz;

const styles = StyleSheet.create({
    conatainer: {},
    quizContainer: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20
    }
});
