import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { DAPP_LOADING_NFT, DAPP_NO_NFT } from '@/constants/common';
import { BgColor, Lato, TextGrayColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';

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

    const isCW721 = !(!cw721Contract || cw721Contract === '0x');

    const [containerSize, setContainerSize] = useState(0);
    const [NFTList, setNFTList] = useState<Array<INFTProps> | null>(null);

    const fetchNFTs = useCallback(() => {
        if (!cw721Contract || cw721Contract === '0x') {
            if (!isFetching && MyNFTS) {
                setNFTList((prevList) => {
                    if (prevList) {
                        const newList = MyNFTS.filter((nft) => !prevList.some((existingNFT) => existingNFT.id === nft.id));
                        return [...prevList, ...newList];
                    } else {
                        return MyNFTS;
                    }
                });
            }
        } else {
            if (!isCW721Fetching && MyCW721NFTS) {
                setNFTList((prevList) => {
                    if (prevList) {
                        const newList = MyCW721NFTS.filter((nft) => !prevList.some((existingNFT) => existingNFT.id === nft.id));
                        return [...prevList, ...newList];
                    } else {
                        return MyCW721NFTS;
                    }
                });
            }
        }
    }, [MyNFTS, MyCW721NFTS, isFetching, isCW721Fetching, NFTList]);

    const RefreshNFTs = () => {
        if (NFTList === null || NFTList.length === 0) {
            handleCW721NFTIdList('0');
        } else {
            handleCW721NFTIdList(NFTList[NFTList.length - 1].id);
        }
    };

    useEffect(() => {
        fetchNFTs();
    }, [isFetching, isCW721Fetching]);

    useEffect(() => {
        if (cw721Contract && cw721Contract !== '0x' && isScrollEnd) {
            RefreshNFTs();
        }
    }, [isScrollEnd, cw721Contract]);

    useEffect(() => {
        if (isFocused) {
            if (cw721Contract && cw721Contract !== '0x') {
                RefreshNFTs();
            } else {
                handleNFTIdList();
            }
        }
    }, [cw721Contract, isFocused]);

    useEffect(() => {
        if (isRefresh) {
            if (cw721Contract && cw721Contract !== '0x') {
                RefreshNFTs();
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
        // FIXME: NFT identifiers are supplied by external contracts without a stable schema.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (id: any) => {
            if (NFTList !== null) {
                // FIXME: NFT records are supplied by external contracts without a stable schema.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const nft = NFTList.find((value: any) => id === value.id);
                navigation.navigate(Screens.NFT, { data: { nft: nft, cw721Contract: cw721Contract } });
            }
        },
        [NFTList]
    );

    const NFTTable = () => {
        const renderTable = useCallback(() => {
            const inlineStyles1 = {
                inlineStyle1: { opacity: isCW721 && isCW721Fetching ? 1 : 0 },
                inlineStyle2: {
                    flex: 1,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 30
                },
                inlineStyle3: {
                    flex: 1,
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            } as const;

            return (
                <Fragment>
                    <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                        {NFTList !== null ? (
                            NFTList.length > 0 ? (
                                <Fragment>
                                    {NFTList.map((value, key) => {
                                        return (
                                            <NftItem
                                                key={key}
                                                item={value}
                                                size={(containerSize - 20) / itemCountPerLine}
                                                moveToNFTDetail={moveToNFTDetail}
                                            />
                                        );
                                    })}
                                    <View style={[styles.moreWrap, inlineStyles1.inlineStyle1]}>
                                        <SmallProgress />
                                        <Text style={styles.notice}>{DAPP_LOADING_NFT}</Text>
                                    </View>
                                </Fragment>
                            ) : (
                                <View style={inlineStyles1.inlineStyle2}>
                                    <Text style={styles.notice}>{DAPP_NO_NFT}</Text>
                                </View>
                            )
                        ) : (
                            <View style={inlineStyles1.inlineStyle3}>
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

    const inlineStyles2 = {
        inlineStyle1: { display: visible ? 'flex' : 'none' },
        inlineStyle2: { height: '100%' }
    } as const;

    return (
        <View style={[styles.container, inlineStyles2.inlineStyle1]}>
            <View style={styles.box}>
                <View style={[styles.infoBox, inlineStyles2.inlineStyle2]}>
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
    notice: {
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
    }
});

export default memo(NFTsBox);
