import moment from "moment";

export const convertNumber = (data: string | number | undefined) => {
    if(!Number(data)) return 0;
    return Number(data);
}

export const convertCurrent = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const ConvertAmount = (amount:string | number, isUfct:boolean = true) => {
    if(isUfct) return convertCurrent(Number(convertToFctNumber(amount).toFixed(2)));
    return convertCurrent(Number(Number(amount).toFixed(2)));
}

export const convertToFctNumber = (ufct: string | number) => {
    return Number(ufct) / 1000000;
}

export const isValid = (data:any) => {
    if(typeof data === undefined) return false;
    return true;
}

export const convertTime = (time:string) => {
    return moment(time).format("YYYY-MM-DD HH:mm:ss (UTC+0)");
}

export const convertPercentage = (data: string | number) => {
    let percent = Number(data) * 100;
    if(percent > 1000) return  convertCurrent(Number(Number(percent / 1000).toFixed(2))) + "K";
    return  convertCurrent(Number((Number(data) * 100).toFixed(2)));
}

export const resizeFontSize = (amount:number, reference:number, initSize:number) => {  
    let fontSize = initSize;
    if(amount >= reference) fontSize = initSize - 3;
    if(amount >= reference * 10) fontSize = initSize - 4;
    if(amount >= reference * 100) fontSize = initSize - 5;
    return fontSize;
}