import { Price, Type, ProductCreateInfo, ProductCreateInfoValidationResult, Dimensions, Category, Collection, Warehouse } from './types';
export declare const validatePriceInfo: (price: Price) => ProductCreateInfoValidationResult;
export declare const validateDimensionsInfo: (dimensions: Dimensions) => ProductCreateInfoValidationResult;
export declare const validateProductCreateInfo: (productInfo: ProductCreateInfo, types: Type[], categories: Category[], collections: Collection[], warehouses: Warehouse[]) => ProductCreateInfoValidationResult;
