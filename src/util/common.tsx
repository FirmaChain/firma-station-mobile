import moment from "moment";

export const wait = (timeout:number) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export const convertNumber = (value: string | number | undefined) => {
    if(!Number(value)) return 0;
    return Number(value);
}

export const convertCurrent = (value: number | string) => {
    var val = value.toString().split(".");
    val[0] = val[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return val.join(".");
}

export const convertAmount = (value:string | number, isUfct:boolean = true, point: number = 2) => {
    if(isUfct) return convertCurrent(makeDecimalPoint(convertToFctNumber(value), point));
    return convertCurrent(makeDecimalPoint(value, point));
}

export const convertToFctNumberForInput = (value: number | string) => {
    return makeDecimalPoint(convertToFctNumber(value), 6);
}

export const convertToFctNumber = (value: string | number) => {
    return Number(value) / 1000000;
}

export const makeDecimalPoint = (value: string | number, point: number = 2) => {
    if(value === undefined) return 0;
    const val = convertNumber(value).toString();
    const pointPos = val.indexOf(".");

    if(pointPos === -1) return Number(val).toFixed(point);

    const splitValue = val.split(".");
    const belowDecimal = splitValue[1].substring(0, point);
    return Number(`${splitValue[0]}.${belowDecimal}`).toFixed(point);
}

export const isValid = (data:any) => {
    if(typeof data === undefined) return false;
    return true;
}

export const convertTime = (time:string, fulltime:boolean, addTime?:boolean) => {
    if(time === undefined) return '';
    if(fulltime) return moment(time).format("YYYY-MM-DD HH:mm:ss (UTC+0)");
    if(addTime)return moment(time).format("YYYY-MM-DD HH:mm:ss");
    return moment(time).format("YYYY-MM-DD");
}

export const convertPercentage = (value: string | number) => {
    let percent = Number(value) * 100;
    
    let result = convertCurrent(makeDecimalPoint(percent));
    if (percent >= 1e3 && percent < 1e6) {
        result = convertCurrent(makeDecimalPoint(percent / 1e3)) + "K";
    } else if (percent >= 1e6 && percent < 1e9) {
        result = convertCurrent(makeDecimalPoint(percent / 1e6)) + "M";
    } else if (percent >= 1e9 && percent < 1e12) {
        result = convertCurrent(makeDecimalPoint(percent / 1e9)) + "B";
    } else if (percent >= 1e12) {
        result = convertCurrent(makeDecimalPoint(percent / 1e12)) + "T";
    }
    
    return  result;
}

export const resizeFontSize = (amount:number, reference:number, initSize:number) => {  
    let fontSize = initSize;
    if(amount >= reference) fontSize = initSize - 2;
    if(amount >= reference * 10) fontSize = initSize - 3;
    if(amount >= reference * 100) fontSize = initSize - 4;
    if(amount >= reference * 1000) fontSize = initSize - 5;
    return fontSize;
}