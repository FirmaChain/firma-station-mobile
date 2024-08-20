import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BoxColor, BoxDarkColor, CW721BackgroundColor, CW721Color, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import { useCWContext } from "@/context/cwContext";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import AddressBox from "@/organisms/staking/validator/addressBox";
import { ValidCWType } from "@/util/firma";
import { ScreenWidth } from "@/util/getScreenSize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from "react-native";
import DataSection from "../assets/common/dataSection";
import { INFTProps, useCW721NFT, useNFT } from "@/hooks/dapps/hooks";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import NftItem from "@/organisms/dapps/dappDetail/nftItem";
import SmallProgress from "@/components/parts/smallProgress";
import { DAPP_LOADING_NFT, DAPP_NO_NFT } from "@/constants/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.CW721>;

interface IProps {
    contract: string;
}

const itemCountPerLine = 3;

const CW721 = ({ contract }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { cw721Data } = useCWContext();
    const { MyCW721NFTS, handleCW721NFTIdList, isFetching: isCW721Fetching } = useCW721NFT({ contractAddress: contract });

    const [containerSize, setContainerSize] = useState(0);
    const [isBottom, setIsBottom] = useState(false);
    const [NFTList, setNFTList] = useState<Array<INFTProps> | null>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isScrolledToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
        setIsBottom(isScrolledToBottom);
    };

    const ContractInfo = useMemo(() => {
        const result = cw721Data.find((item) => item.address === contract);
        if (result === undefined) return null;
        return result;
    }, [cw721Data, contract])

    const fetchNFTs = useCallback(() => {
        if (!isCW721Fetching && MyCW721NFTS) {
            setNFTList(prevList => {
                if (prevList) {
                    const newList = MyCW721NFTS.filter(nft => !prevList.some(existingNFT => existingNFT.id === nft.id));
                    return [...prevList, ...newList];
                } else {
                    return MyCW721NFTS
                }
            });
        }
    }, [MyCW721NFTS, isCW721Fetching, NFTList]);

    const RefreshNFTs = () => {
        if (NFTList === null || NFTList.length === 0) { handleCW721NFTIdList('0'); }
        else { handleCW721NFTIdList(NFTList[NFTList.length - 1].id); }
    }

    useEffect(() => {
        fetchNFTs();
    }, [isCW721Fetching]);

    useEffect(() => {
        if (isBottom) {
            RefreshNFTs();
        }
    }, [isBottom])


    useFocusEffect(
        useCallback(() => {
            RefreshNFTs();
        }, [])
    )


    const handleBack = () => {
        navigation.goBack();
    };

    const handleMoveToWeb = (uri: string) => {
        navigation.navigate(Screens.WebScreen, { uri: uri });
    };

    return (
        <Container titleOn={false} backEvent={handleBack}>
            <ViewContainer>
                <RefreshScrollView refreshFunc={RefreshNFTs} scrollToTop={true} scrollEndFunc={handleScroll}>
                    <Fragment>

                        {ContractInfo &&
                            <Fragment>
                                <View style={styles.titleBox}>
                                    <Text style={[styles.label, { color: CW721Color, backgroundColor: CW721BackgroundColor }]}>{'CW721'}</Text>
                                    <Text numberOfLines={1} style={styles.title} ellipsizeMode={"tail"}>{ContractInfo.name}</Text>
                                </View>
                                <AddressBox
                                    title={'Contract address'}
                                    path={'accounts'}
                                    address={ContractInfo.address}
                                    handleExplorer={handleMoveToWeb}
                                />
                                <View style={styles.box}>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.contentTitle}>{'Contract Information'}</Text>
                                        <DataSection title={'Symbol'} data={ContractInfo.symbol} />
                                        <DataSection title={'Label'} data={ContractInfo.label} label={true} />
                                        <DataSection title={'Total Supply'} data={`${ContractInfo.totalSupply} NFT`} />
                                    </View>
                                </View>
                                <View style={styles.nftBox}>
                                    <View style={styles.box}>
                                        <View style={[styles.infoBox, { backgroundColor: BoxDarkColor, height: '100%' }]}>
                                            <Text style={[styles.contentTitle, { paddingVertical: 12 }]}>{'My NFTs'}</Text>
                                            <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                                                {NFTList !== null ? (
                                                    NFTList.length > 0 ?
                                                        <Fragment>
                                                            {NFTList.map((value, key) => {
                                                                return <NftItem key={key} item={value} size={(containerSize - 20) / itemCountPerLine} moveToNFTDetail={() => null} />
                                                            })}
                                                            <View style={[styles.moreWrap, { opacity: isCW721Fetching ? 1 : 0 }]}>
                                                                <SmallProgress />
                                                                <Text style={styles.notice}>{DAPP_LOADING_NFT}</Text>
                                                            </View>
                                                        </Fragment>
                                                        :
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                paddingVertical: 30
                                                            }}
                                                        >
                                                            <Text style={styles.notice}>{DAPP_NO_NFT}</Text>
                                                        </View>
                                                ) : (
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexDirection: 'row',
                                                            paddingVertical: 30
                                                        }}
                                                    >
                                                        <SmallProgress />
                                                        <Text style={styles.notice}>{DAPP_LOADING_NFT}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Fragment>
                        }
                    </Fragment>
                </RefreshScrollView>
            </ViewContainer>
        </Container>
    )
}


const styles = StyleSheet.create({
    titleBox: {
        height: 50,
        width: ScreenWidth(),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 18,
        paddingHorizontal: 20,
    },
    title: {
        flexShrink: 1,
        fontFamily: Lato,
        fontSize: 24,
        fontWeight: 'bold',
        color: TextColor,
    },
    contentTitle: {
        flexShrink: 1,
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'bold',
        color: TextColor,
        paddingVertical: 6
    },
    label: {
        flexShrink: 1,
        fontFamily: Lato,
        fontSize: 12,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 3,
        marginRight: 5
    },
    box: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    infoBox: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: BoxColor,
    },
    nftBox: {
        paddingBottom: 18,
        paddingTop: 20,
        backgroundColor: BoxColor,
    },
    wrapBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 10
    },
    notice: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    moreWrap: {
        width: '100%',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default CW721;