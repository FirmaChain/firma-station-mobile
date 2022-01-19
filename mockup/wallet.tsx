const Wallet = () => {
    const newWallet = (): Promise<object> =>
        new Promise<object>((resolve, reject) => {
            const w = {
                mnemonic: 'quote vocal hawk sudden include nest know easily pulp omit mass black start wealth gown industry robot frequent pizza love lottery elevator outdoor garlic',
                privateKey: '0x65fe30f824c69759d2d29a7058326f4c4473eda8d5974d5dee1b323e45997684',
                address: 'firma1gvns0jpssfu35wvy43wnun65qtf99pydpqudp4',
            }

            resolve(w)
        });
    
    const getBalance = (address:string): Promise<string> => 
        new Promise<string>((resolve, reject) => {
            resolve('0')
        });

    const getAddressFromMnemonic = (mnemonic:string): Promise<string> => 
        new Promise<string>((resolve, reject) => {
            const mn = 'quote vocal hawk sudden include nest know easily pulp omit mass black start wealth gown industry robot frequent pizza love lottery elevator outdoor garlic'
            if(mnemonic === mn){ resolve('firma1gvns0jpssfu35wvy43wnun65qtf99pydpqudp4'); }
            else { reject(null);}
        });

    return { newWallet, getBalance, getAddressFromMnemonic }

}

export default Wallet;