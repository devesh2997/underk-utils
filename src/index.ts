import {
  isPlainObject,
  isNull,
  isBoolean,
  isNumber,
  isString,
  isArray,
  isUndefined,
  isEmpty
} from "lodash";

import { MONTHS } from "./constants";
import { Address } from "types";

//get age from dob
export const getAge = (date: any) => {
  if (isEmpty(date)) return;
  let today = new Date();
  let birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const beautifyName = (firstName?: string, lastName?: string) => {
  let beauty = "";
  firstName = firstName as string;
  lastName = lastName as string;
  if (!isEmpty(firstName) && firstName.length > 0) {
    beauty += firstName[0].toUpperCase();
    if (firstName.length > 1) beauty += firstName.substring(1);
  }
  if (!isEmpty(lastName) && lastName.length > 0) {
    beauty += " ";
    beauty += lastName[0].toUpperCase();
    if (lastName.length > 1) beauty += lastName.substring(1);
  }
  return beauty;
};


export const beautifyAddress = (address: Address): string => {
  let add = ""
  add += address.building + ", "
  add += address.locality + ", "
  add += address.landmark + ", "
  add += address.city + ", "
  add += address.state + " - "
  add += address.pincode
  return add
}

export const isEmptyString = (value: string) => {
  return isNull(value) || isUndefined(value) || value.length === 0
}

export const isNotEmptyString = (value: string) => {
  return !isNull(value) && !isUndefined(value) && value.length !== 0
}

export const isNotEmpty = (value: any) => {
  return !isNull(value) && !isUndefined(value);
};

export const isPlainObjectWithKeys = (value: any) => {
  return isPlainObject(value) && !isNull(value);
};

export const boolify = (value: any, defaultValue = false) => {
  return isBoolean(value) ? value : defaultValue;
};

export const numify = (value: any, defaultValue = 0) => {
  return isNumber(Number(value)) ? Number(value) : defaultValue;
};

export const stringify = (value: any, defaultValue = "") => {
  return isString(value) ? value : defaultValue;
};

export const objectify = (value: any, defaultValue = {}): Object => {
  return isPlainObjectWithKeys(value) ? value : defaultValue;
};

export const arrify = (value: any, defaultValue = []) => {
  return isArray(value) ? value : defaultValue;
};


export const beautifyDate = (date: any) => {
  date = new Date(date);
  if (!date.getTime()) {
    return "unknown";
  }
  return (
    MONTHS[date.getMonth()].substring(0, 3) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear()
  );
};

export const prepareMultiOptsForRequest = (
  options: { label: string; value: string }[]
) => {
  return JSON.stringify(options.map((option) => option.value));
};


export const beautifyNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};



export const getResponseStatus = (status: number) => {
  return {
    isInformational: status >= 100 && status < 200,
    isSuccessful: status >= 200 && status < 300,
    isRedirect: status >= 300 && status < 400,
    isClientError: status >= 400 && status < 500,
    isServerError: status >= 500 && status < 600,

    isUnauthorized: status === 401,
  };
};


