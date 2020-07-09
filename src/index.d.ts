import { Price, ProductCreateInfoValidationResult, Dimensions, ProductCreateInfo, Type, Category, Collection, Warehouse, Address } from './types';
// export { Price, ProductCreateInfoValidationResult, Dimensions }

export const validatePriceInfo: (price: Price) => ProductCreateInfoValidationResult

export const validateDimensionsInfo: (dimensions: Dimensions) => ProductCreateInfoValidationResult

export const validateProductCreateInfo: (productInfo: ProductCreateInfo, types: Type[], categories: Category[], collections: Collection[], warehouses: Warehouse[]) => ProductCreateInfoValidationResult

export const getAge: (date: any) => number | undefined

export const beautifyName: (firstName?: string | undefined, lastName?: string | undefined) => string

export const beautifyAddress: (address: Address) => string

export const isEmptyString: (value: string) => boolean

export const isNotEmptyString: (value: string) => boolean

export const isPlainObjectWithKeys: (value: any) => boolean

export const boolify: (value: any, defaultValue?: boolean) => boolean

export const numify: (value: any, defaultValue?: number) => number

export const stringify: (value: any, defaultValue?: string) => string

export const objectify: (value: any, defaultValue?: {}) => object

export const arrify: (value: any, defaultValue?: never[]) => any[]

export const beautifyDate: (date: any) => string

export const prepareMultiOptsForRequest: (options: {
    label: string;
    value: string;
}[]) => string

export const beautifyNumber: (num: number) => string

export const getResponseStatus: (status: number) => {
    isInformational: boolean;
    isSuccessful: boolean;
    isRedirect: boolean;
    isClientError: boolean;
    isServerError: boolean;
    isUnauthorized: boolean;
}





