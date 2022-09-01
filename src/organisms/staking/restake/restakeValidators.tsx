import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IStakingGrantState } from '@/hooks/staking/hooks';
import ValidatorSection from './validatorSection';
import Button from '@/components/button/button';
import { BgColor, BoxColor } from '@/constants/theme';

interface IProps {
    grantState: IStakingGrantState;
    minimumRewards: number;
    closeModal: () => void;
}

const RestakeValidators = ({ grantState, minimumRewards, closeModal }: IProps) => {
    const grantList = useMemo(() => {
        const list = grantState.list.sort((a: any, b: any) => b.stakingReward - a.stakingReward);
        return list;
    }, [grantState]);

    return (
        <React.Fragment>
            <ScrollView>
                <View>
                    {grantList.map((value, index) => {
                        return <ValidatorSection key={index} data={value} minimumRewards={minimumRewards} />;
                    })}
                </View>
            </ScrollView>
            <View style={styles.buttonBox}>
                <Button title={'Close'} active={true} onPressEvent={closeModal} />
            </View>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    buttonBox: {
        paddingTop: 20,
        paddingHorizontal: 20,
        backgroundColor: BgColor
    }
});

export default RestakeValidators;
