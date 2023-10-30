const axios = require('axios');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();

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


const formatDecimal = (number, count) => {
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

/**
 * 发送 GET 请求并隐藏敏感信息
 * @param {string} url - 请求的URL
 * @param {object} sensitiveData - 包含敏感信息的对象
 * @param {object} params - 请求参数
 * @param {object} options - 其他 Axios 选项
 * @returns {Promise} 包含响应数据的 Promise
 */
async function sendGetRequestWithSensitiveData(url, sensitiveData, params = {}, options = {}) {
  // 创建 Axios 实例
  const instance = axios.create();

  // 请求拦截器：在发送请求之前隐藏敏感信息
  instance.interceptors.request.use(config => {
    // 删除或替换敏感信息
    config.headers = {
      ...config.headers,
      ...sensitiveData,
    };
    return config;
  }, error => {
    return Promise.reject(error);
  });

  try {
    // 发送 GET 请求
    const response = await instance.get(url, {
      params: params,
      ...options,
    });

    // 响应拦截器：在处理响应之前检查响应数据并隐藏敏感信息
    const responseData = response.data;
    // 这里可以检查和处理 responseData 中的敏感信息

    return responseData;
  } catch (error) {
    // 处理请求错误
    throw error;
  }
}

/**
 * 发送 POST 请求并隐藏敏感信息
 * @param {string} url - 请求的URL
 * @param {object} sensitiveData - 包含敏感信息的对象
 * @param {object} data - POST 请求的数据
 * @param {object} options - 其他 Axios 选项
 * @returns {Promise} 包含响应数据的 Promise
 */
async function sendPostRequestWithSensitiveData(url, sensitiveData, data = {}, options = {}) {
  // 创建 Axios 实例
  const instance = axios.create();

  // 请求拦截器：在发送请求之前隐藏敏感信息
  instance.interceptors.request.use(config => {
    // 删除或替换敏感信息
    config.headers = {
      ...config.headers,
      ...sensitiveData,
    };
    return config;
  }, error => {
    return Promise.reject(error);
  });

  try {
    // 发送 POST 请求
    const response = await instance.post(url, data, options);

    // 响应拦截器：在处理响应之前检查响应数据并隐藏敏感信息
    const responseData = response.data;
    // 这里可以检查和处理 responseData 中的敏感信息

    return responseData;
  } catch (error) {
    // 处理请求错误
    throw error;
  }
}



// // 发起 GET 请求
// sendGetRequestWithSensitiveData('http://localhost:3001/queryPairInfoByPairAddress', sensitiveData, getRequestParams)
//   .then(responseData => {
//     console.log('GET 请求处理后的响应数据:', responseData);
//   })
//   .catch(error => {
//     console.error('GET 请求错误:', error);
//   });

// // 发起 POST 请求
// sendPostRequestWithSensitiveData('http://localhost:3001/postDataEndpoint', sensitiveData, postData)
//   .then(responseData => {
//     console.log('POST 请求处理后的响应数据:', responseData);
//   })
//   .catch(error => {
//     console.error('POST 请求错误:', error);
//   });

function formatDateTime(dateTime, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dateTime).format(format);
}

function getRelativeTimeDifference(dateTime) {
  const now = moment();
  const targetDateTime = moment(dateTime);

  if (targetDateTime.isSame(now)) {
    return 'Just now';
  } else if (targetDateTime.isAfter(now)) {
    const duration = moment.duration(targetDateTime.diff(now));
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
    const duration = moment.duration(now.diff(targetDateTime));
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
  sendGetRequestWithSensitiveData,
  sendPostRequestWithSensitiveData,
  getRelativeTimeDifference,
  formatDateTime,
}