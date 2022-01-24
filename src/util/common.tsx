import moment from "moment";

export const convertNumber = (data: string | number | undefined) => {
    if(!Number(data)) return 0;
    return Number(data);
}

export const ConvertAmount = (amount:string | number, isUfct:boolean = true) => {
    if(isUfct) return Number(convertToFctNumber(amount).toFixed(2)).toLocaleString(undefined, {minimumFractionDigits: 2});
    return Number(Number(amount).toFixed(2)).toLocaleString(undefined, {minimumFractionDigits: 2});
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
    return  Number((Number(data) * 100).toFixed(2)).toLocaleString(undefined, {minimumFractionDigits: 2});
}

export const resizeFontSize = (amount:number, initSize:number) => {  
    let fontSize = initSize;
    if(amount >= 10000) fontSize = initSize - 3;
    if(amount >= 100000) fontSize = initSize - 4;
    if(amount >= 1000000) fontSize = initSize - 5;
    return fontSize;
}