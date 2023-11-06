import { FirmaUtil } from '@firmachain/firma-js';
import moment from 'moment';

export const wait = (timeout: number) => {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), timeout));
};

export const updateArray = (array: Array<any>, oldVal: any, newVal: any) => {
    const index = array.indexOf(oldVal);
    if (index !== -1) {
        array[index] = newVal;
    }
    return array;
};

export const convertNumber = (value: string | number | null | undefined) => {
    if (!Number(value)) return 0;
    return Number(value);
};

export const convertCurrent = (value: number | string) => {
    var val = value.toString().split('.');
    val[0] = val[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return val.join('.');
};

export const convertAmount = (value: string | number, isUfct: boolean = true, point: number = 2) => {
    if (isUfct) return convertCurrent(makeDecimalPoint(convertToFctNumber(value), point));
    return convertCurrent(makeDecimalPoint(value, point));
};

export const convertToFctNumberForInput = (value: number | string) => {
    return makeDecimalPoint(convertToFctNumber(value), 6);
};

export const convertToFctNumber = (value: string | number) => {
    return convertNumber(FirmaUtil.getFCTStringFromUFCT(Number(value)));
};

export const createOrdinal = (value: number) => {
    let number = String(value);
    let length = number.length;
    let end = number.substring(length - 1);
    let teen = length > 1 && number.substring(length - 2, length - 1) === '1';
    let ordinal = 'th';

    if (end === '1' && !teen) {
        ordinal = 'st';
    } else if (end === '2' && !teen) {
        ordinal = 'nd';
    } else if (end === '3' && !teen) {
        ordinal = 'rd';
    }
    return ordinal;
};

export const makeDecimalPoint = (value: string | number, point: number = 2) => {
    if (value === undefined) return '0';
    const val = convertNumber(value).toString();
    const pointPos = val.indexOf('.');

    if (pointPos === -1) return Number(val).toFixed(point);

    const splitValue = val.split('.');
    const belowDecimal = splitValue[1].substring(0, point);
    return Number(`${splitValue[0]}.${belowDecimal}`).toFixed(point);
};

export const handleDecimalPointLimit = (value: string) => {
    const val = value.toString().split('.');

    if (val[1] === undefined) val[1] = '0';
    if (val[1].length > 6) {
        val[1] = val[1].substring(0, 6);
        const result = val[0] + '.' + val[1];
        return result;
    }
    return value;
};

export const isValid = (data: any) => {
    if (typeof data === undefined) return false;
    return true;
};

export const convertTime = (time: string | number, fulltime: boolean, addTime?: boolean) => {
    if (time === undefined) return '';

    const GMT = getGMT();

    if (fulltime) return moment(moment.utc(time).toDate()).format('YYYY-MM-DD HH:mm:ss') + ` (${GMT})`;
    if (addTime) return moment(moment.utc(time).toDate()).format('YYYY-MM-DD HH:mm:ss');
    return moment(moment.utc(time).toDate()).format('YYYY-MM-DD');
};

export const convertTimerText = (time: string) => {
    if (time === '') return { diff: 0, time: '00:00:00' };
    const now = new Date();
    const diff = new Date(time).getTime() - now.getTime();

    let diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24);
    let diffMin = Math.floor((diff / (1000 * 60)) % 60);
    let diffSec = Math.floor((diff / 1000) % 60);

    diffHour = diffHour === -1 ? 0 : diffHour;
    diffMin = diffMin === -1 ? 0 : diffMin;
    diffSec = diffSec === -1 ? 0 : diffSec;

    let timeResult = '00:00:00';
    if (diff >= 0) {
        timeResult = `${('00' + diffHour).slice(-2)}:${('00' + diffMin).slice(-2)}:${('00' + diffSec).slice(-2)}`;
    }

    return {
        diff: diff,
        time: timeResult
    };
};

export const getGMT = () => {
    let date = new Date();
    const offset = date.getTimezoneOffset();
    const GMT = offset / 60 < 0 ? '+' + Math.abs(offset / 60) : (offset / 60) * -1;

    return 'GMT' + GMT;
};

export const createDecimalPoint = (value: number) => {
    if (value < 10) {
        return 6;
    } else if (value < 100) {
        return 5;
    } else if (value < 1000) {
        return 4;
    } else if (value < 10000) {
        return 3;
    } else if (value < 100000) {
        return 2;
    } else if (value < 1000000) {
        return 1;
    }
    return 0;
};

export const convertPercentage = (value: string | number) => {
    let percent = convertNumber(value) * 100;

    let result = convertCurrent(makeDecimalPoint(percent));
    if (percent >= 1e3 && percent < 1e6) {
        result = convertCurrent(makeDecimalPoint(percent / 1e3)) + 'K';
    } else if (percent >= 1e6 && percent < 1e9) {
        result = convertCurrent(makeDecimalPoint(percent / 1e6)) + 'M';
    } else if (percent >= 1e9 && percent < 1e12) {
        result = convertCurrent(makeDecimalPoint(percent / 1e9)) + 'B';
    } else if (percent >= 1e12 && percent < 1e15) {
        result = convertCurrent(makeDecimalPoint(percent / 1e12)) + 'T';
    } else if (percent >= 1e15 && percent < 1e18) {
        result = convertCurrent(makeDecimalPoint(percent / 1e15)) + 'q';
    } else if (percent >= 1e18) {
        result = convertCurrent(makeDecimalPoint(percent / 1e18)) + 'Q';
    }

    return result;
};

export const convertDelegateAmount = (amount: number) => {
    if (amount >= 10000) {
        return convertAmount(amount, true, 2);
    }
    if (amount >= 1000) {
        return convertAmount(amount, true, 3);
    }
    if (amount >= 100) {
        return convertAmount(amount, true, 4);
    }
    if (amount >= 10) {
        return convertAmount(amount, true, 5);
    }
    if (amount >= 0) {
        return convertAmount(amount, true, 6);
    }
};

export const resizeFontSize = (amount: number, reference: number, initSize: number) => {
    let fontSize = initSize;
    if (amount >= reference) fontSize = initSize - 2;
    if (amount >= reference * 10) fontSize = initSize - 3;
    if (amount >= reference * 100) fontSize = initSize - 4;
    if (amount >= reference * 1000) fontSize = initSize - 5;
    return fontSize;
};

export const getTimeStamp = () => {
    return Math.round(new Date().getTime() / 1000).toString();
};
