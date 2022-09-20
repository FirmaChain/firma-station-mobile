import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNFT, useNFTTransaction } from '@/hooks/dapps/hooks';
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
}

const NFT = ({ data }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { getNFTMetaData } = useNFT();
    const { NFTTransactionsList } = useNFTTransaction();

    const [metaData, setMetaData] = useState<IMetaData>({
        name: '',
        description: '',
        attributes: []
    });
    const [information, setInformation] = useState({});

    const NFTData = useMemo(() => {
        return data.nft;
    }, [data]);

    const TxData = useMemo(() => {
        let transaction = NFTTransactionsList.find((value: any) => NFTData.id === value.nftId);
        return transaction;
    }, [NFTTransactionsList, NFTData]);

    const handleMetaData = async () => {
        try {
            let result = await getNFTMetaData(NFTData.metaURI);
            let name = result.name === undefined ? NFTData.name : result.name;
            let description = result.description === undefined ? NFTData.description : result.description;
            let attributes = result.attributes === undefined ? null : result.attributes;

            setMetaData({
                ...metaData,
                name: name,
                description: description,
                attributes: attributes
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setMetaData({
            name: NFTData.name,
            description: NFTData.description,
            attributes: []
        });
        handleMetaData();
    }, [NFTData]);

    useEffect(() => {
        const { name, description, metaURI, ...nftValues } = NFTData;
        setInformation({ ...information, ...nftValues, ...TxData, ...metaData });
    }, [TxData, metaData]);

    const handleMoveToWeb = (uri: string) => {
        navigation.navigate(Screens.WebScreen, { uri: uri });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container titleOn={false} backEvent={handleBack}>
            <ViewContainer>
                <React.Fragment>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                        <DescriptionBox data={information} />
                        <View style={styles.divider} />
                        <InfoBox data={information} handleExplorer={handleMoveToWeb} />
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

export default NFT;
