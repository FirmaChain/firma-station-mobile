import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNFT } from '@/hooks/dapps/hooks';
import { DividerColor } from '@/constants/theme';
import Button from '@/components/button/button';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import DescriptionBox from './descriptionBox';
import InfoBox from './infoBox';
import PropertiesBox from './propertiesBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.NFT>;

interface IProps {
    data: any;
}

interface IMetaData {
    name: string;
    description: string;
    attributes: Array<any>;
    collection: { name: string; icon: string };
    createdBy: string;
}

const NFT = ({ data }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { getNFTMetaData } = useNFT();

    const [metaData, setMetaData] = useState<IMetaData>({
        name: '',
        description: '',
        attributes: [],
        collection: { name: '', icon: '' },
        createdBy: ''
    });

    const NFTData = useMemo(() => {
        return data.nft;
    }, [data]);

    const NFTInformation = useMemo(() => {
        if (NFTData === undefined) return null;
        const { name, description, metaURI, ...nftValues } = NFTData;
        return { ...nftValues, ...metaData };
    }, [NFTData, metaData]);

    const handleMetaData = useCallback(async () => {
        try {
            if (NFTData === undefined) return;
            let result = await getNFTMetaData(NFTData.metaURI);

            metaData['name'] = result.name === undefined ? NFTData.name : result.name;
            metaData['description'] = result.description === undefined ? NFTData.description : result.description;
            metaData['attributes'] = result.attributes === undefined ? [] : result.attributes;
            metaData['collection'] = result.collection === undefined ? { name: '', icon: '' } : result.collection;
            metaData['createdBy'] = result.createdBy === undefined ? '' : result.createdBy;

            setMetaData({ ...metaData });
        } catch (error) {
            console.log(error);
        }
    }, [NFTData, metaData]);

    useEffect(() => {
        handleMetaData();
    }, [NFTData]);

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container titleOn={false} backEvent={handleBack}>
            <ViewContainer>
                <React.Fragment>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                        {NFTInformation !== null && <DescriptionBox data={NFTInformation} />}
                        <View style={styles.divider} />
                        {NFTInformation !== null && <InfoBox data={NFTInformation} />}
                        <PropertiesBox data={metaData.attributes} />
                    </ScrollView>
                    <View style={styles.buttonBox}>
                        <Button title={'Send'} active={false} onPressEvent={() => null} />
                    </View>
                </React.Fragment>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: DividerColor,
        marginBottom: 25
    },
    buttonBox: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    }
});

export default memo(NFT);
