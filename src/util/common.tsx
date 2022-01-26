import moment from "moment";

export const convertNumber = (value: string | number | undefined) => {
    if(!Number(value)) return 0;
    return Number(value);
}

export const convertCurrent = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const convertAmount = (value:string | number, isUfct:boolean = true) => {
    if(isUfct) return convertCurrent(make2DecimalPlace(convertToFctNumber(value)));
    return convertCurrent(make2DecimalPlace(value));
}

export const convertToFctNumber = (value: string | number) => {
    return Number(value) / 1000000;
}

export const make2DecimalPlace = (value: string | number) => {
    const val = convertNumber(value) * 100;
    const val2 = Math.floor(val);
    const result = val2 / 100;

    return result;
}

export const isValid = (data:any) => {
    if(typeof data === undefined) return false;
    return true;
}

export const convertTime = (time:string, fulltime:boolean) => {
    if(fulltime) return moment(time).format("YYYY-MM-DD HH:mm:ss (UTC+0)");

    return moment(time).format("YYYY-MM-DD");
}

export const convertPercentage = (value: string | number) => {
    let percent = Number(value) * 100;
    if(percent > 1000) return  convertCurrent(make2DecimalPlace(percent / 1000)) + "K";
    return  convertCurrent(make2DecimalPlace(Number(value) * 100));
}

export const resizeFontSize = (amount:number, reference:number, initSize:number) => {  
    let fontSize = initSize;
    if(amount >= reference) fontSize = initSize - 3;
    if(amount >= reference * 10) fontSize = initSize - 4;
    if(amount >= reference * 100) fontSize = initSize - 5;
    if(amount >= reference * 1000) fontSize = initSize - 7;
    if(amount >= reference * 10000) fontSize = initSize - 9;
    return fontSize;
}