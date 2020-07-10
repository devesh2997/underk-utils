import { Address } from "types";
import { validateProductCreateInfo, validatePriceInfo, validateDimensionsInfo } from "./product-utils";
export { validateProductCreateInfo, validatePriceInfo, validateDimensionsInfo };
export declare const getAge: (date: any) => number | undefined;
export declare const beautifyName: (firstName?: string | undefined, lastName?: string | undefined) => string;
export declare const beautifyAddress: (address: Address) => string;
export declare const isEmptyString: (value: string) => boolean;
export declare const isNotEmptyString: (value: string) => boolean;
export declare const isPlainObjectWithKeys: (value: any) => boolean;
export declare const boolify: (value: any, defaultValue?: boolean) => boolean;
export declare const numify: (value: any, defaultValue?: number) => number;
export declare const stringify: (value: any, defaultValue?: string) => string;
export declare const objectify: (value: any, defaultValue?: {}) => Object;
export declare const arrify: (value: any, defaultValue?: never[]) => any[];
export declare const beautifyDate: (date: any) => string;
export declare const prepareMultiOptsForRequest: (options: {
    label: string;
    value: string;
}[]) => string;
export declare const beautifyNumber: (num: number) => string;
export declare const getResponseStatus: (status: number) => {
    isInformational: boolean;
    isSuccessful: boolean;
    isRedirect: boolean;
    isClientError: boolean;
    isServerError: boolean;
    isUnauthorized: boolean;
};
export declare const maskEmail: (email: string) => string;
export declare const stringArrayToCommaSeparatedString: (arr: string[]) => string;
export declare const generateOtp: (numDigits?: number) => string;
export declare const addDays: (date: Date, days: number) => Date;
export declare const addMinutes: (date: Date, minutes: number) => Date;
