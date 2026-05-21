import { Fragment, useMemo } from 'react';
import { BgColor } from '@/constants/theme';
import { ScrollView, StyleSheet, View } from 'react-native';

import { IStakingGrantState } from '@/hooks/staking/hooks';
import Button from '@/components/button/button';

import ValidatorSection from './validatorSection';

interface IProps {
    grantState: IStakingGrantState;
    minimumRewards: number;
    closeModal: () => void;
}

const RestakeValidators = ({ grantState, minimumRewards, closeModal }: IProps) => {
    const grantList = useMemo(() => {
        return grantState.list.sort((a, b) => b.stakingReward - a.stakingReward);
    }, [grantState]);

    return (
        <Fragment>
            <ScrollView>
                {grantList.map((value, index) => {
                    return <ValidatorSection key={index} data={value} minimumRewards={minimumRewards} />;
                })}
            </ScrollView>
            <View style={styles.buttonBox}>
                <Button title={'Close'} active={true} onPressEvent={closeModal} />
            </View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    buttonBox: {
        padding: 20,
        backgroundColor: BgColor
    }
});

export default RestakeValidators;
