"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const constants_1 = require("./constants");
const bulk_upload_products_1 = require("./bulk-upload-products");
exports.validateProductCreateInfo = bulk_upload_products_1.validateProductCreateInfo;
exports.validatePriceInfo = bulk_upload_products_1.validatePriceInfo;
exports.validateDimensionsInfo = bulk_upload_products_1.validateDimensionsInfo;
exports.getAge = (date) => {
    if (lodash_1.isEmpty(date))
        return;
    let today = new Date();
    let birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
exports.beautifyName = (firstName, lastName) => {
    let beauty = "";
    firstName = firstName;
    lastName = lastName;
    if (!lodash_1.isEmpty(firstName) && firstName.length > 0) {
        beauty += firstName[0].toUpperCase();
        if (firstName.length > 1)
            beauty += firstName.substring(1);
    }
    if (!lodash_1.isEmpty(lastName) && lastName.length > 0) {
        beauty += " ";
        beauty += lastName[0].toUpperCase();
        if (lastName.length > 1)
            beauty += lastName.substring(1);
    }
    return beauty;
};
exports.beautifyAddress = (address) => {
    let add = "";
    add += address.building + ", ";
    add += address.locality + ", ";
    add += address.landmark + ", ";
    add += address.city + ", ";
    add += address.state + " - ";
    add += address.pincode;
    return add;
};
exports.isEmptyString = (value) => {
    return lodash_1.isNull(value) || lodash_1.isUndefined(value) || value.length === 0;
};
exports.isNotEmptyString = (value) => {
    return !lodash_1.isNull(value) && !lodash_1.isUndefined(value) && value.length !== 0;
};
exports.isPlainObjectWithKeys = (value) => {
    return lodash_1.isPlainObject(value) && !lodash_1.isNull(value);
};
exports.boolify = (value, defaultValue = false) => {
    return lodash_1.isBoolean(value) ? value : defaultValue;
};
exports.numify = (value, defaultValue = 0) => {
    return lodash_1.isNumber(Number(value)) ? Number(value) : defaultValue;
};
exports.stringify = (value, defaultValue = "") => {
    return lodash_1.isString(value) ? value : defaultValue;
};
exports.objectify = (value, defaultValue = {}) => {
    return exports.isPlainObjectWithKeys(value) ? value : defaultValue;
};
exports.arrify = (value, defaultValue = []) => {
    return lodash_1.isArray(value) ? value : defaultValue;
};
exports.beautifyDate = (date) => {
    date = new Date(date);
    if (!date.getTime()) {
        return "unknown";
    }
    return (constants_1.MONTHS[date.getMonth()].substring(0, 3) +
        " " +
        date.getDate() +
        ", " +
        date.getFullYear());
};
exports.prepareMultiOptsForRequest = (options) => {
    return JSON.stringify(options.map((option) => option.value));
};
exports.beautifyNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
exports.getResponseStatus = (status) => {
    return {
        isInformational: status >= 100 && status < 200,
        isSuccessful: status >= 200 && status < 300,
        isRedirect: status >= 300 && status < 400,
        isClientError: status >= 400 && status < 500,
        isServerError: status >= 500 && status < 600,
        isUnauthorized: status === 401,
    };
};
exports.maskEmail = (email) => {
    let str, parts;
    str = "";
    parts = email.split('@');
    const part = parts[0];
    for (let i = 0; i < part.length; i++) {
        if (i == 0 || i == part.length - 1) {
            str += part[i];
        }
        else {
            str += '*';
        }
    }
    return str + '@' + parts[1];
};
exports.stringArrayToCommaSeparatedString = (arr) => {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        str += arr[i];
        if (i !== arr.length - 1) {
            str += ',';
        }
    }
    return str;
};
exports.generateOtp = (numDigits = 4) => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < numDigits; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
exports.addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
exports.addMinutes = (date, minutes) => {
    let result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
};
//# sourceMappingURL=index.js.map