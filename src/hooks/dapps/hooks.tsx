import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { getCW721NftIdList, getCW721NFTItemFromId, getNFTIdListOfOwner, getNFTItemFromId, INftItemType } from '@/util/firma';
import { Cw721NftInfo } from '@firmachain/firma-js';
import { ICON_CW_NFT_THUMBNAIL } from '@/constants/images';

export interface INFTTransctionState {
    height: number;
    transaction_hash: string;
    nftId: string;
    from: string;
    timestamp: string;
}

export interface INFTProps {
    id: string;
    name: string;
    image: string;
    description: string;
    identity: string;
    metaURI: string;
}

export const useNFT = () => {
    const { wallet } = useAppSelector((state) => state);
    const [NFTIdList, setNFTIdLIst] = useState<Array<string> | null>(null);
    const [NFTS, setNFTS] = useState<Array<INftItemType> | null>(null);
    const [MyNFTS, setMyNFTS] = useState<Array<INFTProps> | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [identity, setIdentity] = useState<string>('');

    const handleIdentity = (id: string) => {
        setIdentity(id);
    };

    const handleNFTIdList = useCallback(async () => {
        try {
            let list = await getNFTIdListOfOwner(wallet.address);
            setNFTIdLIst(list.nftIdList);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, [wallet.address, NFTIdList]);

    const getNFTMetaData = async (uri: string) => {
        try {
            const res = await fetch(uri);
            const json = await res.json();
            return json;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const handleNFTList = useCallback(async () => {
        try {
            if (NFTIdList === null) return;
            const nftList = await getNFTSList(NFTIdList);
            setNFTS(nftList);
        } catch (error) {
            console.log(error);
        }
    }, [NFTIdList]);

    useEffect(() => {
        handleNFTList();
    }, [NFTIdList]);

    useEffect(() => {
        const handleMyNFTList = async () => {
            try {
                if (NFTS === null) return;
                setIsFetching(true);
                const myNftList: Array<INFTProps> = await getMyNFTList(NFTS, identity);
                setMyNFTS(myNftList);
                setIsFetching(false);
            } catch (error) {
                console.log(error);
                setIsFetching(false);
            }
        };
        handleMyNFTList();
    }, [NFTS, identity]);

    return { MyNFTS, NFTIdList, isFetching, handleNFTIdList, handleIdentity, getNFTMetaData };
};


export const useCW721NFT = ({ contractAddress }: { contractAddress: string | null }) => {
    const { wallet } = useAppSelector((state) => state);
    const [CW721NFTIdList, setCW721NFTIdLIst] = useState<Array<string> | null>(null);
    const [CW721NFTS, setCW721NFTS] = useState<Array<INftItemType> | null>(null);
    const [MyCW721NFTS, setMyCW721NFTS] = useState<Array<INFTProps> | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    const handleCW721NFTIdList = useCallback(async (startId: string) => {
        try {
            if (contractAddress === null) return;
            setIsFetching(true);
            let list = await getCW721NftIdList(contractAddress, wallet.address, startId);
            setCW721NFTIdLIst(list);
        } catch (error) {
            setIsFetching(false);
            throw error;
        }
    }, [wallet.address, CW721NFTIdList]);

    const getCW721NFTMetaData = async (uri: string) => {
        try {
            const res = await fetch(uri);
            const json = await res.json();
            return json;
        } catch (error) {
            throw error;
        }
    };

    const handleCW721NFTList = useCallback(async () => {
        try {
            if (contractAddress === null) return;
            if (CW721NFTIdList === null) return;
            const nftList = await getCW721NFTSList(contractAddress, CW721NFTIdList);
            setCW721NFTS(nftList);
        } catch (error) {
            setIsFetching(false);
            console.log(error);
        }
    }, [CW721NFTIdList, contractAddress]);

    useEffect(() => {
        handleCW721NFTList();
    }, [CW721NFTIdList]);

    useEffect(() => {
        const handleMyNFTList = async () => {
            try {
                if (CW721NFTS === null) return;
                const myNftList: Array<INFTProps> = await getMyCW721NFTList(CW721NFTS);
                setMyCW721NFTS(myNftList);
                setIsFetching(false);
            } catch (error) {
                console.log(error);
                setIsFetching(false);
            }
        };
        handleMyNFTList();
    }, [CW721NFTS]);

    return { MyCW721NFTS, CW721NFTIdList, isFetching, handleCW721NFTIdList, getCW721NFTMetaData };
};

const getNFTSList = async (idList: Array<string>) => {
    try {
        if (idList.length > 0) {
            let list: Array<INftItemType> = [];
            for (let i = 0; i < idList.length; i++) {
                let nft = await getNFTItemFromId(idList[i]);
                if (nft) {
                    list.push(nft);
                }
            }
            return list;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};

const getCW721NFTSList = async (contract: string, idList: Array<string>) => {
    try {
        if (idList.length > 0) {
            let list: Array<INftItemType> = [];
            for (let i = 0; i < idList.length; i++) {
                let nft: Cw721NftInfo | null = await getCW721NFTItemFromId(contract, idList[i]);
                if (nft) {
                    list.push({
                        id: idList[i],
                        owner: nft.access.owner,
                        tokenURI: nft.info.token_uri
                    });
                }
            }
            return list;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};

const getMyNFTList = async (nfts: Array<INftItemType>, identity: string) => {
    try {
        if (nfts.length > 0 && identity !== '') {
            let list: INFTProps[] = [];
            for (let i = 0; i < nfts.length; i++) {
                let NFT = nfts[i];
                const res = await fetch(NFT.tokenURI);
                const json = await res.json();
                const image = json.imageURI;
                const metaURI = json.metaURI !== undefined ? json.metaURI : '';

                if (identity === json.identity) {
                    list = list.concat({
                        id: NFT.id,
                        name: json.name,
                        image: image,
                        description: json.description,
                        identity: json.identity,
                        metaURI: metaURI
                    });
                }
            }

            return list;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};


const getMyCW721NFTList = async (nfts: Array<INftItemType>) => {
    try {
        if (nfts.length > 0) {
            let list: INFTProps[] = [];
            for (let i = 0; i < nfts.length; i++) {
                let NFT = nfts[i];

                try {
                    const res = await fetch(NFT.tokenURI);
                    const json = await res.json();
                    const name = json.name !== undefined ? json.name : NFT.id;
                    const image = json.imageURI !== undefined ? json.imageURI : ICON_CW_NFT_THUMBNAIL;
                    const metaURI = json.metaURI !== undefined ? json.metaURI : '';
                    const description = json.description !== undefined ? json.description : '';
                    const identity = json.identity !== undefined ? json.identity : '';

                    list = list.concat({
                        id: NFT.id,
                        name: name,
                        image: image,
                        description: description,
                        identity: identity,
                        metaURI: metaURI
                    });
                } catch (error) {
                    console.log(`Error fetching data for NFT with id ${NFT.id}:`, error);

                    list = list.concat({
                        id: NFT.id,
                        name: NFT.id,
                        image: ICON_CW_NFT_THUMBNAIL,
                        description: '',
                        identity: '',
                        metaURI: ''
                    });
                }
            }

            return list;
        } else {
            return [];
        }
    } catch (error) {
        console.log('getMyCW721NFTList', error);
        return [];
    }
};

export const useDappCertified = () => {
    const Certified = (metaData: any | null | undefined) => {
        let certified = 0;
        if (metaData === null || metaData === undefined) return 0;
        if (metaData.url.includes('https://')) certified = 1;
        if (metaData.isCertified) certified = 2;

        return certified;
    };

    return { Certified };
};
