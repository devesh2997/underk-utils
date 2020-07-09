export type Dimensions = {
    id?: number
    length: number
    breadth: number
    height: number
    weight: number
}


export type Price = {
    id?: number
    currency: string
    listPrice: number
    salePrice: number
    taxPercent: number
    isInclusiveTax: boolean
}

export type Warehouse = {
    id?: number
    code: string
    name: string
    address: Address
    created_at?: Date
    updated_at?: Date
}

export type Address = {
    id?: number
    building: string
    locality: string
    landmark: string
    city: string
    state: string
    pincode: number
}

export type Subtype = {
    id: number,
    sku: string,
    name: string,
    attributes?: Attribute[],
    skuAttributes: SKUAttribute[],
    optionAttribute?: OptionAttribute
}

export type Attribute = {
    id?: number,
    name: string,
    isMultiValued: boolean,
    isCompulsory: boolean,
    isFilterable: boolean,
    values: AttributeValue[]
}

export type AttributeValue = {
    id?: number,
    name: string,
    valueType: string,
    value: string
}

export type SKUAttribute = {
    id?: number,
    name: string,
    skuOrdering: number,
    variantsBasis: boolean,
    isFilterable: boolean,
    values: SKUAttributeValue[]
}

export type SKUAttributeValue = {
    id?: number,
    sku: string,
    name: string,
    valueType: string,
    value: string
}

export type OptionAttribute = {
    id?: number,
    name: string,
    values: OptionAttributeValue[]
}

export type OptionAttributeValue = {
    id?: number,
    sku: string,
    name: string,
    valueType: string,
    value: string
}

export type Collection = {
    id: number,
    slug: string,
    name: string,
}

export type Category = {
    id?: number,
    slug: string,
    sku: string,
    name: string,
    children?: Category[]
}


export type Type = {
    id: number,
    sku: string,
    name: string,
    subtypes: Subtype[]
}

export type ProductCreateInfoValidationResult = {
    isValid: boolean
    error?: string
    // product?: Product
}

export type ProductCreateInfo = {
    title: string
    slug: string
    typeName: string
    subtypeName: string
    categorySlug: string
    collectionsSlugs: string[]
    productAttributeValues?: {
        attributeName: string,
        attributeValueName?: string
        attributeValueNames?: string[]
    }[]
    productSKUAttributeValues: {
        skuAttributeName: string,
        skuAttributeValueName: string
    }[]
    productOptionAttributeValues?: {
        optionAttributeValueName: string,
        optionAttributeValueDimensions: Dimensions,
        optionAttributeValuePrice: Price,
        optionAttributeValueInventory?: {
            warehouseCode: string,
            stock: number
        }[]
    }[],
    price?: Price,
    productDimensions?: Dimensions,
    productInventory?: {
        warehouseCode: string,
        stock: number
    }[]
};