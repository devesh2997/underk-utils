export declare type Dimensions = {
    id?: number;
    length: number;
    breadth: number;
    height: number;
    weight: number;
};
export declare type Price = {
    id?: number;
    currency: string;
    listPrice: number;
    salePrice: number;
    taxPercent: number;
    isInclusiveTax: boolean;
};
export declare type Warehouse = {
    id?: number;
    code: string;
    name: string;
    address: Address;
    created_at?: Date;
    updated_at?: Date;
};
export declare type Address = {
    id?: number;
    building: string;
    locality: string;
    landmark: string;
    city: string;
    state: string;
    pincode: number;
};
export declare type Subtype = {
    id: number;
    sku: string;
    name: string;
    attributes?: Attribute[];
    skuAttributes: SKUAttribute[];
    optionAttribute?: OptionAttribute;
};
export declare type Attribute = {
    id?: number;
    name: string;
    isMultiValued: boolean;
    isCompulsory: boolean;
    isFilterable: boolean;
    values: AttributeValue[];
};
export declare type AttributeValue = {
    id?: number;
    name: string;
    valueType: string;
    value: string;
};
export declare type SKUAttribute = {
    id?: number;
    name: string;
    skuOrdering: number;
    variantsBasis: boolean;
    isFilterable: boolean;
    values: SKUAttributeValue[];
};
export declare type SKUAttributeValue = {
    id?: number;
    sku: string;
    name: string;
    valueType: string;
    value: string;
};
export declare type OptionAttribute = {
    id?: number;
    name: string;
    values: OptionAttributeValue[];
};
export declare type OptionAttributeValue = {
    id?: number;
    sku: string;
    name: string;
    valueType: string;
    value: string;
};
export declare type Collection = {
    id: number;
    slug: string;
    name: string;
};
export declare type Category = {
    id?: number;
    slug: string;
    name: string;
    children?: Category[];
};
export declare type Type = {
    id: number;
    sku: string;
    name: string;
    subtypes: Subtype[];
};
export declare type ProductCreateInfoValidationResult = {
    isValid: boolean;
    error?: string;
};
export declare type ProductCreateInfo = {
    title: string;
    slug: string;
    typeName: string;
    subtypeName: string;
    categorySlug: string;
    collectionsSlugs: string[];
    productAttributeValues?: {
        attributeName: string;
        attributeValueName?: string;
        attributeValueNames?: string[];
    }[];
    productSKUAttributeValues: {
        skuAttributeName: string;
        skuAttributeValueName: string;
    }[];
    productOptionAttributeValues?: {
        optionAttributeValueName: string;
        optionAttributeValueDimensions: Dimensions;
        optionAttributeValuePrice: Price;
        optionAttributeValueInventory?: {
            warehouseCode: string;
            stock: number;
        }[];
    }[];
    price?: Price;
    productDimensions?: Dimensions;
    productInventory?: {
        warehouseCode: string;
        stock: number;
    }[];
};
