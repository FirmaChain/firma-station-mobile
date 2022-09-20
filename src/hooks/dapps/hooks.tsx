import { useEffect, useState } from 'react';
import { useNFTTransactionQuery } from '@/apollo/gqls';
import { FIRMA_LOGO } from '@/constants/images';
import { useAppSelector } from '@/redux/hooks';
import { getNFTIdListOfOwner, getNFTItemFromId, INftItemType } from '@/util/firma';

export interface INFTTransctionState {
    height: number;
    transaction_hash: string;
    nftId: string;
    from: string;
    timestamp: string;
}

export const useNFT = () => {
    const { wallet } = useAppSelector((state) => state);
    const [NFTIdList, setNFTIdLIst] = useState<Array<string>>([]);
    const [NFTS, setNFTS] = useState<Array<INftItemType>>([]);
    const [MyNFTS, setMyNFTS] = useState<Array<any>>([]);
    const [identity, setIdentity] = useState<string>('');

    const initValues = () => {
        setIdentity('');
        setNFTIdLIst([]);
        setNFTS([]);
        setMyNFTS([]);
    };

    const handleIdentity = (id: string) => {
        setIdentity(id);
    };

    const handleNFTIdList = async () => {
        try {
            let list = await getNFTIdListOfOwner(wallet.address);
            setNFTIdLIst(list);
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const handleNFTSList = async () => {
        try {
            let list: Array<INftItemType> = [];
            for (let i = 0; i < NFTIdList.length; i++) {
                let nft = await getNFTItemFromId(NFTIdList[i]);
                list.push(nft);
            }
            setNFTS(list);
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const handleMyNFTList = async () => {
        try {
            let list: any[] = [];
            for (let i = 0; i < NFTS.length; i++) {
                let NFT = NFTS[i];
                const res = await fetch(NFT.tokenURI);
                const json = await res.json();
                const image = await checkImageFile(json.imageURI);
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
            setMyNFTS(list);
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

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

    const checkImageFile = async (uri: string) => {
        try {
            const file_res = await fetch(uri);
            const file_blob = await file_res.blob();
            return file_blob.type.includes('image') ? uri : FIRMA_LOGO;
        } catch (error) {
            return FIRMA_LOGO;
        }
    };

    useEffect(() => {
        if (NFTIdList.length > 0) {
            handleNFTSList();
        }
    }, [NFTIdList]);

    useEffect(() => {
        if (NFTS.length > 0 && identity !== '') {
            handleMyNFTList();
        }
    }, [NFTIdList, NFTS]);

    useEffect(() => {
        initValues();
    }, []);

    return { MyNFTS, handleNFTIdList, handleIdentity, getNFTMetaData };
};

export const useNFTTransaction = () => {
    const { wallet } = useAppSelector((state) => state);

    const [NFTTransactionsList, setNFTTransactionsList] = useState<Array<INFTTransctionState>>([]);

    const { refetch, loading, data } = useNFTTransactionQuery({ address: `{${wallet.address}}` });

    const handleRefetchNFTTransaction = async () => {
        try {
            await refetch();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (loading === false) {
            if (data?.messagesByAddress !== undefined) {
                const list = data.messagesByAddress.map((value: any) => {
                    let height = value.height;
                    let hash = value.transaction_hash;
                    let nftId = value.value.nftId;
                    let from = value.value.owner;
                    let to = value.value.toAddress;
                    let timestamp = value.transaction.block.timestamp;

                    return {
                        height: height,
                        hash: hash,
                        nftId: nftId,
                        from: from,
                        to: to,
                        timestamp: timestamp
                    };
                });
                setNFTTransactionsList(list);
            }
        }
    }, [loading, data]);

    return { NFTTransactionsList, handleRefetchNFTTransaction };
};
