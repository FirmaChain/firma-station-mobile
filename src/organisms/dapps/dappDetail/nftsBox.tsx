import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BgColor, Lato, TextGrayColor } from '@/constants/theme';
import { DAPP_LOADING_NFT, DAPP_NO_NFT } from '@/constants/common';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { INFTProps, useCW721NFT, useNFT } from '@/hooks/dapps/hooks';
import SmallProgress from '@/components/parts/smallProgress';
import NftItem from './nftItem';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.DappDetail>;

interface IProps {
    visible: boolean;
    identity: string;
    cw721Contract: string | null;
    isScrollEnd: boolean;
    isRefresh: boolean;
    handleRefresh: (refresh: boolean) => void;
}

const itemCountPerLine = 3;

const NFTsBox = ({ visible, identity, cw721Contract, isScrollEnd, isRefresh, handleRefresh }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { MyNFTS, handleNFTIdList, handleIdentity, isFetching } = useNFT();
    const { MyCW721NFTS, handleCW721NFTIdList, isFetching: isCW721Fetching } = useCW721NFT({ contractAddress: cw721Contract });

    const isCW721 = !Boolean(!cw721Contract || cw721Contract === '0x')

    const [containerSize, setContainerSize] = useState(0);
    const [NFTList, setNFTList] = useState<Array<INFTProps> | null>(null);

    const fetchNFTs = useCallback(() => {
        if (!cw721Contract || cw721Contract === '0x') {
            if (!isFetching && MyNFTS) {
                setNFTList(prevList => {
                    if (prevList) {
                        const newList = MyNFTS.filter(nft => !prevList.some(existingNFT => existingNFT.id === nft.id));
                        return [...prevList, ...newList];
                    } else {
                        return MyNFTS
                    }
                });
            }
        } else {
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
        }
    }, [MyNFTS, MyCW721NFTS, isFetching, isCW721Fetching, NFTList]);

    useEffect(() => {
        fetchNFTs();
    }, [isFetching, isCW721Fetching]);

    useEffect(() => {
        if (cw721Contract && cw721Contract !== '0x' && isScrollEnd) {
            handleCW721NFTIdList(NFTList === null ? '0' : NFTList[NFTList.length - 1].id)
        }
    }, [isScrollEnd, cw721Contract])

    useEffect(() => {
        if (isFocused) {
            if (cw721Contract && cw721Contract !== '0x') {
                handleCW721NFTIdList(NFTList === null ? '0' : NFTList[NFTList.length - 1].id);
            } else {
                handleNFTIdList();
            }
        }
    }, [cw721Contract, isFocused]);

    useEffect(() => {
        if (isRefresh) {
            if (cw721Contract && cw721Contract !== '0x') {
                handleCW721NFTIdList(NFTList === null ? '0' : NFTList[NFTList.length - 1].id);
            } else {
                handleNFTIdList();
            }
            handleRefresh(false);
        }
    }, [isRefresh, cw721Contract]);

    useEffect(() => {
        if (isFocused) {
            if (cw721Contract === null) {
                handleIdentity(identity);
            }
        }
    }, [isFocused, identity, cw721Contract]);


    const moveToNFTDetail = useCallback(
        (id: any) => {
            if (NFTList !== null) {
                const nft = NFTList.find((value: any) => id === value.id);
                navigation.navigate(Screens.NFT, { data: { nft: nft, cw721Contract: cw721Contract } });
            }
        },
        [NFTList]
    );

    const NFTTable = () => {
        const renderTable = useCallback(() => {
            return (
                <Fragment>
                    <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                        {NFTList !== null ? (
                            NFTList.length > 0 ?
                                <Fragment>
                                    {NFTList.map((value, key) => {
                                        return <NftItem key={key} item={value} size={(containerSize - 20) / itemCountPerLine} moveToNFTDetail={moveToNFTDetail} />
                                    })}
                                    <View style={[styles.moreWrap, { opacity: isCW721 && isCW721Fetching ? 1 : 0 }]}>
                                        <SmallProgress />
                                        <Text style={styles.notice}>{DAPP_LOADING_NFT}</Text>
                                    </View>
                                </Fragment>
                                :
                                <View
                                    style={{
                                        flex: 1,
                                        height: '100%',
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
                                    height: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <SmallProgress />
                                <Text style={styles.notice}>{DAPP_LOADING_NFT}</Text>
                            </View>
                        )}
                    </View>
                </Fragment>
            );
        }, [NFTList, containerSize]);
        return renderTable();
    };

    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
            <View style={styles.box}>
                <View style={[styles.infoBox, { height: '100%' }]}>
                    <NFTTable />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: BgColor,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    box: {
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    infoBox: {
        width: '100%',
        paddingVertical: 20
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    notice: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    wrapBox: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 10
    },
    moreWrap: {
        width: '100%',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default memo(NFTsBox);
