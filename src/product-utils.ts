import { Price, Product, Type, ProductCreateInfo, ProductCreateInfoValidationResult, Dimensions, Category, Collection, Warehouse, OptionAttributeValue, SKUAttributeValue, SKUAttribute, Subtype, SKU, ProductInventory, AttributeValue } from './types';
import { isEmpty } from 'lodash';
import { PRODUCT_STATUS_STAGED } from "underk-types";


const createValidationErrorObject = (error: string) => {
    return { isValid: false, error: error }
}

//this function validates the price field
export const validatePriceInfo = (price: Price): ProductCreateInfoValidationResult => {
    if (isEmpty(price.currency)) {
        return createValidationErrorObject("Currency not provided")
    }
    if (isEmpty(price.listPrice) || isNaN(Number(price.listPrice))) {
        return createValidationErrorObject("Invalid list price provided")
    }
    if (isEmpty(price.salePrice) || isNaN(Number(price.salePrice))) {
        return createValidationErrorObject("Invalid sale price provided")
    }
    if (isEmpty(price.taxPercent) || isNaN(Number(price.taxPercent))) {
        return createValidationErrorObject("Invalid tax percent provided")
    }
    if (isEmpty(price.isInclusiveTax)) {
        return createValidationErrorObject("Please provide if the price is inclusive tax or not.")
    }

    return { isValid: true }
}

//this function validates the dimension info
export const validateDimensionsInfo = (dimensions: Dimensions): ProductCreateInfoValidationResult => {
    if (isEmpty(dimensions)) {
        return createValidationErrorObject('Dimension must be provided')
    }
    if (!isEmpty(dimensions.length)) {
        if (isNaN(Number(dimensions.length))) {
            return createValidationErrorObject("Invalid length dimension provided")
        }
    }
    if (!isEmpty(dimensions.breadth)) {
        if (isNaN(Number(dimensions.length))) {
            return createValidationErrorObject("Invalid length dimension provided")
        }
    }
    if (!isEmpty(dimensions.height)) {
        if (isNaN(Number(dimensions.length))) {
            return createValidationErrorObject("Invalid length dimension provided")
        }
    }
    if (isEmpty(dimensions.weight)) {
        return createValidationErrorObject("Product weight(in gm) should be compulsorily provided.")
    } else {
        if (isNaN(dimensions.weight)) {
            return createValidationErrorObject("Invalid product weight is given.")
        }
    }

    return { isValid: true }
}

//This does not check for uniqueness of product slug..
export const validateProductCreateInfo = (productInfo: ProductCreateInfo, types: Type[], categories: Category[], collections: Collection[], warehouses: Warehouse[]): ProductCreateInfoValidationResult => {
    if (isEmpty(productInfo.slug)) {
        return createValidationErrorObject("Product slug not provided")
    }
    if (isEmpty(productInfo.title)) {
        return createValidationErrorObject("Product title not provided")
    }
    if (isEmpty(productInfo.typeName)) {
        return createValidationErrorObject("Type Name not provided")

    }
    if (isEmpty(productInfo.subtypeName)) {
        return createValidationErrorObject("Type Name not provided")
    }
    if (isEmpty(productInfo.categorySlug)) {
        return createValidationErrorObject("Category Slug not provided")
    }

    const type = types.find(type => type.name === productInfo.typeName)
    if (typeof type === 'undefined') {
        return createValidationErrorObject("Type with given name not found.");
    }

    const subtypes = type.subtypes
    if (typeof subtypes === 'undefined') {
        return createValidationErrorObject(`Type ${type.name} does not have any subtypes.`)
    }
    const subtype = subtypes.find(subtype => subtype.name === productInfo.subtypeName)
    if (typeof subtype === 'undefined') {
        return createValidationErrorObject("Subtype with given name not found.");
    }

    const productCategory = categories.find(category => category.slug === productInfo.categorySlug)
    if (typeof productCategory === 'undefined') {
        return createValidationErrorObject("Category with given slug not found.")
    }

    const productInfoCollections = productInfo.collectionsSlugs.map(collectionSlug => collections.find(collection => collection.slug === collectionSlug))
    const productCollections: Collection[] = []
    for (let i = 0; i < productInfoCollections.length; i++) {
        const piCollection = productInfoCollections[i]
        if (typeof piCollection === 'undefined') {
            return createValidationErrorObject(`collection with slug ${productInfo.collectionsSlugs[i]} not found`)
        } else {
            productCollections.push(piCollection)
        }
    }

    let attributeValues: AttributeValue[] = []
    let optionAttributeValues: OptionAttributeValue[] = []
    let skuAttributeValues: SKUAttributeValue[] = []
    const { productAttributeValues, productSKUAttributeValues, productOptionAttributeValues } = productInfo
    if (isEmpty(productSKUAttributeValues)) {
        return createValidationErrorObject("SKU attribute values cannot be empty")
    }

    for (let i = 0; i < subtype.skuAttributes.length; i++) {
        const sa = subtype.skuAttributes[i]
        const productSKUAttribute = productSKUAttributeValues.find((psav) => psav.skuAttributeName === sa.name)
        if (typeof productSKUAttribute === 'undefined') {
            return createValidationErrorObject(`Value of sku attribute ${sa.name} not provided`)
        } else {
            const productSKUAttributeValue = sa.values.find((sav) => sav.name === productSKUAttribute.skuAttributeValueName)
            if (typeof productSKUAttributeValue === 'undefined') {
                return createValidationErrorObject(`Value for sku attribute ${sa.name} : ${productSKUAttribute.skuAttributeValueName} does not exist`)
            }
            skuAttributeValues.push(productSKUAttributeValue)
        }
    }
    let baseSKU: string
    try {
        baseSKU = createProductBaseSKU(type, subtype, skuAttributeValues)
    } catch (e) {
        return createValidationErrorObject(e.toString())
    }

    let productSKUs: SKU[] = []

    if (!isEmpty(subtype.optionAttribute)) {
        if (typeof productOptionAttributeValues !== 'undefined') {
            if (productOptionAttributeValues.length === 0) {
                return createValidationErrorObject("Atleast one option must be provided")
            }

            for (let i = 0; i < productOptionAttributeValues.length; i++) {
                const poav = productOptionAttributeValues[i]
                const subtypeOptionAttributeValue = subtype.optionAttribute?.values.find((v) => v.name === poav.optionAttributeValueName)
                if (typeof subtypeOptionAttributeValue === 'undefined') {
                    return createValidationErrorObject(`No subtype option attribute for ${subtype.optionAttribute?.name} exists named ${poav.optionAttributeValueName}`)
                }
                if (typeof poav.optionAttributeValuePrice === 'undefined') {
                    return createValidationErrorObject("Price not provided")
                } else {
                    const priceValidation = validatePriceInfo(poav.optionAttributeValuePrice)
                    if (!priceValidation.isValid) {
                        return priceValidation
                    }
                }

                const dimensionsValidation = validateDimensionsInfo(poav.optionAttributeValueDimensions)
                if (!dimensionsValidation.isValid) {
                    return dimensionsValidation
                }

                let inventory: ProductInventory[] = []
                if (typeof poav.optionAttributeValueInventory !== 'undefined') {
                    for (let j = 0; j < poav.optionAttributeValueInventory.length; j++) {
                        const productWarehouseInventory = poav.optionAttributeValueInventory[j]
                        const warehouse = warehouses.find(w => w.code === productWarehouseInventory.warehouseCode)
                        if (typeof warehouse === 'undefined') {
                            return createValidationErrorObject(`warehouse with code ${productWarehouseInventory.warehouseCode} does not exist`)
                        }
                        productWarehouseInventory.stock = Number(productWarehouseInventory.stock)
                        if (isNaN(productWarehouseInventory.stock)) {
                            return createValidationErrorObject(`Invalid stock given for warehouse ${productWarehouseInventory.warehouseCode}`)
                        }

                        inventory.push({
                            warehouse: warehouse,
                            stock: productWarehouseInventory.stock,
                            reserved: 0
                        })
                    }
                }
                optionAttributeValues.push(subtypeOptionAttributeValue)

                let sku: SKU = {
                    sku: baseSKU + "-" + subtypeOptionAttributeValue.sku,
                    price: poav.optionAttributeValuePrice,
                    dimensions: poav.optionAttributeValueDimensions,
                    inventory: inventory
                }
                productSKUs.push(sku)
            }

        } else {
            return createValidationErrorObject("Atleast one option must be provided")
        }

    } else {
        if (typeof productInfo.price === 'undefined') {
            return createValidationErrorObject('Price details are not provided')
        } else {
            const priceValidation = validatePriceInfo(productInfo.price)
            if (!priceValidation.isValid) {
                return priceValidation
            }

        }
        if (typeof productInfo.productDimensions === 'undefined') {
            return createValidationErrorObject('Product Dimesions must be given')
        } else {
            const dimensionsValidation = validateDimensionsInfo(productInfo.productDimensions)
            if (!dimensionsValidation.isValid) {
                return dimensionsValidation
            }
        }

        let inventory: ProductInventory[] = []
        if (typeof productInfo.productInventory !== 'undefined') {
            for (let j = 0; j < productInfo.productInventory.length; j++) {
                const productWarehouseInventory = productInfo.productInventory[j]
                const warehouse = warehouses.find(w => w.code === productWarehouseInventory.warehouseCode)
                if (typeof warehouse === 'undefined') {
                    return createValidationErrorObject(`warehouse with code ${productWarehouseInventory.warehouseCode} does not exist`)
                }
                productWarehouseInventory.stock = Number(productWarehouseInventory.stock)
                if (isNaN(productWarehouseInventory.stock)) {
                    return createValidationErrorObject(`Invalid stock given for warehouse ${productWarehouseInventory.warehouseCode}`)
                }
                inventory.push({ warehouse: warehouse, stock: productWarehouseInventory.stock, reserved: 0, })
            }
        }

        let sku: SKU = {
            sku: baseSKU,
            price: productInfo.price,
            dimensions: productInfo.productDimensions,
            inventory: inventory
        }

        productSKUs.push(sku)

    }

    if (typeof subtype.attributes !== 'undefined') {
        for (let i = 0; i < subtype.attributes.length; i++) {
            const subtypeAttribute = subtype.attributes[i]
            const a = productAttributeValues?.find(pattr => pattr.attributeName === subtypeAttribute.name)
            if (subtypeAttribute.isCompulsory) {
                if (subtypeAttribute.isMultiValued) {
                    if (typeof a === 'undefined' || typeof a.attributeValueNames === 'undefined' || a.attributeValueNames.length === 0) {
                        return createValidationErrorObject(`Atleast one value must be provided for compulsory attribute ${subtypeAttribute.name}`)
                    }
                } else {
                    if (typeof a === 'undefined' || typeof a.attributeValueName === undefined || a.attributeValueName?.length === 0) {
                        return createValidationErrorObject(`Value must be provided for compulsory attribute ${subtypeAttribute.name}`)
                    }
                }
            }
            let subtypeAttributeValue
            if (subtypeAttribute.isMultiValued) {
                if (typeof a !== 'undefined' && typeof a.attributeValueNames !== 'undefined') {
                    for (let i = 0; i < a.attributeValueNames.length; i++) {
                        const aValueName = a.attributeValueNames[i]
                        subtypeAttributeValue = subtypeAttribute.values.find((sav) => sav.name === aValueName)
                        if (typeof subtypeAttributeValue === 'undefined') {
                            return createValidationErrorObject(`Attribute value with name ${aValueName} not found for ${a.attributeName}`)
                        }
                        attributeValues.push(subtypeAttributeValue)
                    }
                }
            } else {
                if (typeof a !== 'undefined') {
                    subtypeAttributeValue = subtypeAttribute.values.find((sav) => sav.name === a.attributeValueName)
                    if (typeof subtypeAttributeValue === 'undefined') {
                        return createValidationErrorObject(`Attribute value with name ${a.attributeValueName} Not found for ${a.attributeName}`)
                    }
                    attributeValues.push(subtypeAttributeValue)
                }

            }




        }
    }

    let product: Product = {
        slug: productInfo.slug,
        title: productInfo.title,
        type: type,
        subtype: subtype,
        category: productCategory,
        collections: productCollections,
        skuAttributes: skuAttributeValues,
        attributes: attributeValues,
        skus: productSKUs,
        status: PRODUCT_STATUS_STAGED,
        baseSKU: baseSKU,
        optionAttributes: optionAttributeValues,
    }


    // for (let i = 0; i < productAttributeValues.length; i++) {
    //     const a = productAttributeValues[i]
    //     const subtypeAttribute = subtype.attributes.find((sa) => sa.name === a.attributeName)
    //     if (typeof subtypeAttribute === 'undefined') {
    //         return createValidationErrorObject(`Attribute with name ${a.attributeName} Not found`)
    //     } else {
    //         if (subtypeAttribute.isCompulsory) {
    //             if (subtypeAttribute.isMultiValued) {
    //                 if (typeof a.attributeValueNames === 'undefined' || a.attributeValueNames.length === 0) {
    //                     return createValidationErrorObject(`Atleast one value must be provided for compulsory attribute ${a.attributeName}`)
    //                 }
    //             } else {
    //                 if (typeof a.attributeValueName === undefined || a.attributeValueName?.length === 0) {
    //                     return createValidationErrorObject(`Value must be provided for compulsory attribute ${a.attributeName}`)
    //                 }
    //             }
    //         }
    //         if (subtypeAttribute.isMultiValued) {
    //             if (typeof a.attributeValueNames !== 'undefined') {
    //                 for (let i = 0; i < a.attributeValueNames.length; i++) {
    //                     const aValueName = a.attributeValueNames[i]
    //                     const subtypeAttributeValue = subtypeAttribute.values.find((sav) => sav.name === aValueName)
    //                     if (typeof subtypeAttributeValue === 'undefined') {
    //                         return createValidationErrorObject(`Attribute value with name ${aValueName} not found for ${a.attributeName}`)
    //                     }
    //                 }
    //             }
    //         } else {
    //             const subtypeAttributeValue = subtypeAttribute.values.find((sav) => sav.name === a.attributeValueName)
    //             if (typeof subtypeAttributeValue === 'undefined') {
    //                 return createValidationErrorObject(`Attribute value with name ${a.attributeValueName} Not found for ${a.attributeName}`)
    //             }
    //         }

    //     }
    // }

    return { isValid: true, product: product }

}



const findSKUOrderforSKUAttributeValue = (skuAttributes: SKUAttribute[], skuAttributeValue: SKUAttributeValue): number => {
    const skuAttribute = skuAttributes.find(sa => typeof sa.values.find(val => val == skuAttributeValue) !== 'undefined')
    if (typeof skuAttribute === 'undefined') {
        throw new Error(`No skuAttribute found which has value ${skuAttributeValue.name}`)
    } return skuAttribute?.skuOrdering as number
}
const createProductBaseSKU = (type: Type, subtype: Subtype, skuAttributeValues: SKUAttributeValue[]): string => {
    if (typeof type === 'undefined' || typeof subtype === 'undefined' || typeof skuAttributeValues === 'undefined') {
        throw new Error("type, subtype or skuAttributeValues not provided")
    }
    if (typeof subtype.skuAttributes === 'undefined') {
        throw new Error("subtype must contain skuAttributes")
    }
    let baseSKU = ""
    baseSKU += type.sku
    baseSKU += `-${subtype.sku}`
    skuAttributeValues.sort((a, b) => findSKUOrderforSKUAttributeValue(subtype.skuAttributes, a) - findSKUOrderforSKUAttributeValue(subtype.skuAttributes, b))
    for (let i = 0; i < skuAttributeValues.length; i++) {
        baseSKU += `-${skuAttributeValues[i].sku}`
    }
    return baseSKU
}
