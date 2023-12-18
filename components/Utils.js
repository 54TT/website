const axios = require('axios');
const dayjs = require('dayjs');
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
const dotenv = require('dotenv');
dotenv.config();


const formatDecimal = (number, count) => {
    const getSubscript = (number) => {
        // 定义下标字符的 Unicode 起始值（0 对应 U+2080）
        const subscriptStart = 0x2080;
        // 将数字转换为字符串
        const numberString = number.toString();
        // 初始化一个空字符串来存储下标字符
        let subscript = '';

        // 遍历数字字符串中的每个数字
        for (let i = 0; i < numberString.length; i++) {
            const digit = numberString.charAt(i);
            if (/[0-9]/.test(digit)) {
                // 如果字符是数字，则计算 Unicode 下标字符并追加到结果中
                const unicodeValue = subscriptStart + parseInt(digit, 10);
                subscript += String.fromCharCode(unicodeValue);
            } else {
                // 如果字符不是数字，则直接追加到结果中
                subscript += digit;
            }
        }
        return subscript;
    }
    let numberStr = (number.toString().split(".")[1]).toString();
    let count0 = 0;
    for (let i = 0; i < numberStr.length; i++) {
        let str = numberStr[i];
        if (str === "0") {
            count0++;
        } else {
            break;
        }
    }
    let newNumber = numberStr.slice(count0, numberStr.length);
    if (count0 >= count) {
        const subscript = getSubscript(count0);
        newNumber = `0.0${subscript}${newNumber}`;
        return newNumber
    } else {
        return number;
    }
}
function formatDateTime(dateTime, format = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs.unix(dateTime).format(format);
}
function getRelativeTimeDifference(dateTime) {
    const now = dayjs();
    const targetDateTime = dayjs(dateTime)
    if (targetDateTime.isSame(now)) {
        return 'Just now';
    } else if (targetDateTime.isAfter(now)) {
        const duration = dayjs.duration(targetDateTime.diff(now));
        if (duration.asYears() >= 1) {
            return `${Math.floor(duration.asYears())} years after`;
        } else if (duration.asMonths() >= 1) {
            return `${Math.floor(duration.asMonths())} months after`;
        } else if (duration.asDays() >= 1) {
            return `${Math.floor(duration.asDays())} days after`;
        } else if (duration.asHours() >= 1) {
            return `${Math.floor(duration.asHours())} hours after`;
        } else if (duration.asMinutes() >= 1) {
            return `${Math.floor(duration.asMinutes())} minutes after`;
        } else {
            return 'Just now';
        }
    } else {
        const duration = dayjs.duration(now.diff(targetDateTime));
        if (duration.asYears() >= 1) {
            return `${Math.floor(duration.asYears())} years ago`;
        } else if (duration.asMonths() >= 1) {
            return `${Math.floor(duration.asMonths())} months ago`;
        } else if (duration.asDays() >= 1) {
            return `${Math.floor(duration.asDays())} days ago`;
        } else if (duration.asHours() >= 1) {
            return `${Math.floor(duration.asHours())} hours ago`;
        } else if (duration.asMinutes() >= 1) {
            return `${Math.floor(duration.asMinutes())} minutes ago`;
        } else {
            return 'Just now';
        }
    }
}

module.exports = {
    formatDecimal,
    getRelativeTimeDifference,
    formatDateTime,

}