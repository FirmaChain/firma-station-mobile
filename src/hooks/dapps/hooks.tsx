import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { getNFTIdListOfOwner, getNFTItemFromId, INftItemType } from '@/util/firma';

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
    const [NFTIdList, setNFTIdLIst] = useState<Array<string>>([]);
    const [NFTS, setNFTS] = useState<Array<INftItemType>>([]);
    const [MyNFTS, setMyNFTS] = useState<Array<INFTProps> | null>(null);
    const [identity, setIdentity] = useState<string>('');

    const handleIdentity = (id: string) => {
        setIdentity(id);
    };

    const handleNFTIdList = useCallback(async () => {
        try {
            let list = await getNFTIdListOfOwner(wallet.address);
            if (NFTIdList.length === 0) {
                setNFTIdLIst(list.nftIdList);
            } else {
                list.nftIdList
                    .filter((id) => NFTIdList.includes(id) === false)
                    .map((id) => {
                        NFTIdList.concat(id);
                    });
                setNFTIdLIst(NFTIdList);
            }
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
                const myNftList: Array<INFTProps> = await getMyNFTList(NFTS, identity);
                setMyNFTS(myNftList);
            } catch (error) {
                console.log(error);
            }
        };
        handleMyNFTList();
    }, [NFTS, identity]);

    return { MyNFTS, NFTIdList, handleNFTIdList, handleIdentity, getNFTMetaData };
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
