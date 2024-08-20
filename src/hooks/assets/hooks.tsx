import { ICON_CW_NFT_THUMBNAIL } from "@/constants/images";
import { useCWContext } from "@/context/cwContext";
import { rootState } from "@/redux/reducers";
import { getCW20Balance, getCW20ExtraInfo, getCW20TokenInfo, getCW721ContractInfo, getCW721NFTImage, getCW721TotalNFTs, getCWContractInfo } from "@/util/firma";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export const useCW721 = () => {
    const { address } = useSelector((state: rootState) => state.wallet);
    const { cw721Contracts } = useSelector((state: rootState) => state.storage);
    const nonExist20StoreValue = Boolean(cw721Contracts === undefined || cw721Contracts[address] === undefined)
    const { handleUpdateCW721WholeData } = useCWContext();

    const handleCW721ContractsInfo = useCallback(async () => {
        try {
            if (nonExist20StoreValue) return;

            const list = await Promise.all(cw721Contracts[address].map(async (contract) => {
                const [cwInfo, cw721Info, totalInfo] = await Promise.all([
                    getCWContractInfo(contract.address),
                    getCW721ContractInfo(contract.address),
                    getCW721TotalNFTs(contract.address)
                ]);

                const images = await handleThumbnail(contract.address, totalInfo.totalNFTIds);

                return {
                    address: contract.address,
                    name: cw721Info.name,
                    symbol: cw721Info.symbol,
                    label: cwInfo.contract_info.label,
                    totalSupply: totalInfo.totalSupply,
                    totalNFTIds: totalInfo.totalNFTIds,
                    images: images
                };
            }));
            handleUpdateCW721WholeData(list);
        } catch (error) {
            console.log(error);
        }
    }, [cw721Contracts, nonExist20StoreValue, handleUpdateCW721WholeData]);


    const handleThumbnail = async (contract: string, totalNFTIds: string[]) => {
        try {
            const images = [];
            for (let i = 0; i < Math.min(3, totalNFTIds.length); i++) {
                const id = totalNFTIds[i];
                try {
                    const image = await getCW721NFTImage({ contractAddress: contract, tokenId: id });
                    if (image === "") {
                        images.push(ICON_CW_NFT_THUMBNAIL);
                    } else {
                        images.push(image);
                    }
                } catch (error) {
                    console.error(`Failed to fetch image for NFT ID: ${id}`, error);
                }
            }

            return images;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    return {
        handleCW721ContractsInfo
    }

}


export const useCW20 = () => {
    const { address } = useSelector((state: rootState) => state.wallet);
    const { cw20Contracts } = useSelector((state: rootState) => state.storage);
    const nonExist20StoreValue = Boolean(cw20Contracts === undefined || cw20Contracts[address] === undefined)
    const { handleUpdateCW20WholeData } = useCWContext();

    const handleCW20ContractsInfo = useCallback(async () => {
        try {
            if (nonExist20StoreValue) return;
            const list = await Promise.all(cw20Contracts[address].map(async (contract) => {
                const [cwInfo, cw20Info, cw20ExtraInfo, cw20Balance] = await Promise.all([
                    getCWContractInfo(contract.address),
                    getCW20TokenInfo(contract.address),
                    getCW20ExtraInfo(contract.address),
                    getCW20Balance(contract.address, address)
                ]);

                return {
                    address: contract.address,
                    name: cw20Info.name,
                    symbol: cw20Info.symbol,
                    decimal: cw20Info.decimals,
                    totalSupply: cw20Info.total_supply,
                    marketing: cw20ExtraInfo.marketing,
                    label: cwInfo.contract_info.label,
                    imgURI: cw20ExtraInfo.marketing.logo === null ? ICON_CW_NFT_THUMBNAIL : cw20ExtraInfo.marketing.logo.url,
                    available: cw20Balance
                }

            }));
            handleUpdateCW20WholeData(list)
        } catch (error) {
            console.log(error);
        }
    }, [cw20Contracts, nonExist20StoreValue, handleUpdateCW20WholeData])

    return {
        handleCW20ContractsInfo
    }
}
