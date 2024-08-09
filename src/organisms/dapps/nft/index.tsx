import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { INFTProps, useNFT } from '@/hooks/dapps/hooks';
import { DividerColor } from '@/constants/theme';
import Button from '@/components/button/button';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import DescriptionBox from './descriptionBox';
import InfoBox from './infoBox';
import PropertiesBox from './propertiesBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.NFT>;

interface IProps {
    data: {
        nft: INFTProps | undefined;
        cw721Contract: string | null;
    };
}

interface IMetaData {
    name: string;
    description: string;
    attributes: Array<any>;
    collection: { name: string | null; icon: string };
    createdBy: string;
    tokenId: string;
}

const NFT = ({ data }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const isCW721 = !Boolean(data.cw721Contract === '' || data.cw721Contract === '0x' || data.cw721Contract === null);
    const cw721Contract = isCW721 ? data.cw721Contract : "";

    const { getNFTMetaData } = useNFT();

    const [metaData, setMetaData] = useState<IMetaData>({
        name: '',
        description: '',
        attributes: [],
        collection: { name: null, icon: '' },
        createdBy: '',
        tokenId: ''
    });

    const NFTData = useMemo(() => {
        console.log(data);

        return data.nft;
    }, [data]);

    const NFTInformation = useMemo(() => {
        if (NFTData === undefined) return null;
        const mergedMetaData = {
            name: metaData.name || NFTData.name,
            description: metaData.description || NFTData.description,
            tokenId: metaData.tokenId || NFTData.id
        };

        return { ...NFTData, ...metaData, ...mergedMetaData, cw721Contract: cw721Contract };
    }, [NFTData, metaData, cw721Contract]);

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

    const onClickSend = useCallback(() => {
        if (isCW721) {
            if (data.nft === undefined || data.cw721Contract === null) return;
            return navigation.navigate(Screens.SendCW721, { imageURL: data.nft.image, tokenId: data.nft.id, nftName: data.nft.name, contract: data.cw721Contract });
        }
    }, [isCW721, data])

    return (
        <Container titleOn={false} backEvent={handleBack}>
            <ViewContainer>
                <React.Fragment>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                        {NFTInformation !== null && <DescriptionBox data={NFTInformation} isCW721={isCW721} />}
                        <View style={styles.divider} />
                        {NFTInformation !== null && <InfoBox data={NFTInformation} />}
                        <PropertiesBox data={metaData.attributes} />
                    </ScrollView>
                    <View style={styles.buttonBox}>
                        <Button title={'Send'} active={isCW721} onPressEvent={onClickSend} />
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
