"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const createValidationErrorObject = (error) => {
    return { isValid: false, error: error };
};
exports.validatePriceInfo = (price) => {
    if (lodash_1.isEmpty(price.currency)) {
        return createValidationErrorObject("Currency not provided");
    }
    if (lodash_1.isEmpty(price.listPrice) || isNaN(Number(price.listPrice))) {
        return createValidationErrorObject("Invalid list price provided");
    }
    if (lodash_1.isEmpty(price.salePrice) || isNaN(Number(price.salePrice))) {
        return createValidationErrorObject("Invalid sale price provided");
    }
    if (lodash_1.isEmpty(price.taxPercent) || isNaN(Number(price.taxPercent))) {
        return createValidationErrorObject("Invalid tax percent provided");
    }
    if (lodash_1.isEmpty(price.isInclusiveTax)) {
        return createValidationErrorObject("Please provide if the price is inclusive tax or not.");
    }
    return { isValid: true };
};
exports.validateDimensionsInfo = (dimensions) => {
    if (lodash_1.isEmpty(dimensions)) {
        return createValidationErrorObject('Dimension must be provided');
    }
    if (!lodash_1.isEmpty(dimensions.length)) {
        if (isNaN(Number(dimensions.length))) {
            return createValidationErrorObject("Invalid length dimension provided");
        }
    }
    if (!lodash_1.isEmpty(dimensions.breadth)) {
        if (isNaN(Number(dimensions.length))) {
            return createValidationErrorObject("Invalid length dimension provided");
        }
    }
    if (!lodash_1.isEmpty(dimensions.height)) {
        if (isNaN(Number(dimensions.length))) {
            return createValidationErrorObject("Invalid length dimension provided");
        }
    }
    if (lodash_1.isEmpty(dimensions.weight)) {
        return createValidationErrorObject("Product weight(in gm) should be compulsorily provided.");
    }
    else {
        if (isNaN(dimensions.weight)) {
            return createValidationErrorObject("Invalid product weight is given.");
        }
    }
    return { isValid: true };
};
exports.validateProductCreateInfo = (productInfo, types, categories, collections, warehouses) => {
    var _a, _b, _c;
    if (lodash_1.isEmpty(productInfo.slug)) {
        return createValidationErrorObject("Product slug not provided");
    }
    if (lodash_1.isEmpty(productInfo.title)) {
        return createValidationErrorObject("Product title not provided");
    }
    if (lodash_1.isEmpty(productInfo.typeName)) {
        return createValidationErrorObject("Type Name not provided");
    }
    if (lodash_1.isEmpty(productInfo.subtypeName)) {
        return createValidationErrorObject("Type Name not provided");
    }
    if (lodash_1.isEmpty(productInfo.categorySlug)) {
        return createValidationErrorObject("Category Slug not provided");
    }
    const type = types.find(type => type.name === productInfo.typeName);
    if (typeof type === 'undefined') {
        return createValidationErrorObject("Type with given name not found.");
    }
    const subtypes = type.subtypes;
    if (typeof subtypes === 'undefined') {
        return createValidationErrorObject(`Type ${type.name} does not have any subtypes.`);
    }
    const subtype = subtypes.find(subtype => subtype.name === productInfo.subtypeName);
    if (typeof subtype === 'undefined') {
        return createValidationErrorObject("Subtype with given name not found.");
    }
    const productCategory = categories.find(category => category.slug === productInfo.categorySlug);
    if (typeof productCategory === 'undefined') {
        return createValidationErrorObject("Category with given slug not found.");
    }
    const productInfoCollections = productInfo.collectionsSlugs.map(collectionSlug => collections.find(collection => collection.slug === collectionSlug));
    for (let i = 0; i < productInfoCollections.length; i++) {
        if (typeof productInfoCollections[i] === 'undefined') {
            return createValidationErrorObject(`collection with slug ${productInfo.collectionsSlugs[i]} not found`);
        }
    }
    let optionAttributeValues = [];
    let skuAttributeValues = [];
    const { productAttributeValues, productSKUAttributeValues, productOptionAttributeValues } = productInfo;
    if (lodash_1.isEmpty(productSKUAttributeValues)) {
        return createValidationErrorObject("SKU attribute values cannot be empty");
    }
    for (let i = 0; i < subtype.skuAttributes.length; i++) {
        const sa = subtype.skuAttributes[i];
        const productSKUAttribute = productSKUAttributeValues.find((psav) => psav.skuAttributeName === sa.name);
        if (typeof productSKUAttribute === 'undefined') {
            return createValidationErrorObject(`Value of sku attribute ${sa.name} not provided`);
        }
        else {
            const productSKUAttributeValue = sa.values.find((sav) => sav.name === productSKUAttribute.skuAttributeValueName);
            if (typeof productSKUAttributeValue === 'undefined') {
                return createValidationErrorObject(`Value for sku attribute ${sa.name} : ${productSKUAttribute.skuAttributeValueName} does not exist`);
            }
            skuAttributeValues.push(productSKUAttributeValue);
        }
    }
    if (!lodash_1.isEmpty(subtype.optionAttribute)) {
        if (typeof productOptionAttributeValues !== 'undefined') {
            if (productOptionAttributeValues.length === 0) {
                return createValidationErrorObject("Atleast one option must be provided");
            }
            for (let i = 0; i < productOptionAttributeValues.length; i++) {
                const poav = productOptionAttributeValues[i];
                const subtypeOptionAttributeValue = (_a = subtype.optionAttribute) === null || _a === void 0 ? void 0 : _a.values.find((v) => v.name === poav.optionAttributeValueName);
                if (typeof subtypeOptionAttributeValue === 'undefined') {
                    return createValidationErrorObject(`No subtype option attribute for ${(_b = subtype.optionAttribute) === null || _b === void 0 ? void 0 : _b.name} exists named ${poav.optionAttributeValueName}`);
                }
                if (typeof poav.optionAttributeValuePrice === 'undefined') {
                    return createValidationErrorObject("Price not provided");
                }
                else {
                    const priceValidation = exports.validatePriceInfo(poav.optionAttributeValuePrice);
                    if (!priceValidation.isValid) {
                        return priceValidation;
                    }
                }
                const dimensionsValidation = exports.validateDimensionsInfo(poav.optionAttributeValueDimensions);
                if (!dimensionsValidation.isValid) {
                    return dimensionsValidation;
                }
                if (typeof poav.optionAttributeValueInventory !== 'undefined') {
                    for (let j = 0; j < poav.optionAttributeValueInventory.length; j++) {
                        const productWarehouseInventory = poav.optionAttributeValueInventory[j];
                        const warehouse = warehouses.find(w => w.code === productWarehouseInventory.warehouseCode);
                        if (typeof warehouse === 'undefined') {
                            return createValidationErrorObject(`warehouse with code ${productWarehouseInventory.warehouseCode} does not exist`);
                        }
                        productWarehouseInventory.stock = Number(productWarehouseInventory.stock);
                        if (isNaN(productWarehouseInventory.stock)) {
                            return createValidationErrorObject(`Invalid stock given for warehouse ${productWarehouseInventory.warehouseCode}`);
                        }
                    }
                }
                optionAttributeValues.push(subtypeOptionAttributeValue);
            }
        }
        else {
            return createValidationErrorObject("Atleast one option must be provided");
        }
    }
    else {
        if (typeof productInfo.price === 'undefined') {
            return createValidationErrorObject('Price details are not provided');
        }
        else {
            const priceValidation = exports.validatePriceInfo(productInfo.price);
            if (!priceValidation.isValid) {
                return priceValidation;
            }
        }
        if (typeof productInfo.productDimensions === 'undefined') {
            return createValidationErrorObject('Product Dimesions must be given');
        }
        else {
            const dimensionsValidation = exports.validateDimensionsInfo(productInfo.productDimensions);
            if (!dimensionsValidation.isValid) {
                return dimensionsValidation;
            }
        }
        if (typeof productInfo.productInventory !== 'undefined') {
            for (let j = 0; j < productInfo.productInventory.length; j++) {
                const productWarehouseInventory = productInfo.productInventory[j];
                const warehouse = warehouses.find(w => w.code === productWarehouseInventory.warehouseCode);
                if (typeof warehouse === 'undefined') {
                    return createValidationErrorObject(`warehouse with code ${productWarehouseInventory.warehouseCode} does not exist`);
                }
                productWarehouseInventory.stock = Number(productWarehouseInventory.stock);
                if (isNaN(productWarehouseInventory.stock)) {
                    return createValidationErrorObject(`Invalid stock given for warehouse ${productWarehouseInventory.warehouseCode}`);
                }
            }
        }
    }
    if (typeof subtype.attributes !== 'undefined') {
        for (let i = 0; i < subtype.attributes.length; i++) {
            const subtypeAttribute = subtype.attributes[i];
            const a = productAttributeValues === null || productAttributeValues === void 0 ? void 0 : productAttributeValues.find(pattr => pattr.attributeName === subtypeAttribute.name);
            if (subtypeAttribute.isCompulsory) {
                if (subtypeAttribute.isMultiValued) {
                    if (typeof a === 'undefined' || typeof a.attributeValueNames === 'undefined' || a.attributeValueNames.length === 0) {
                        return createValidationErrorObject(`Atleast one value must be provided for compulsory attribute ${subtypeAttribute.name}`);
                    }
                }
                else {
                    if (typeof a === 'undefined' || typeof a.attributeValueName === undefined || ((_c = a.attributeValueName) === null || _c === void 0 ? void 0 : _c.length) === 0) {
                        return createValidationErrorObject(`Value must be provided for compulsory attribute ${subtypeAttribute.name}`);
                    }
                }
            }
            if (subtypeAttribute.isMultiValued) {
                if (typeof a !== 'undefined' && typeof a.attributeValueNames !== 'undefined') {
                    for (let i = 0; i < a.attributeValueNames.length; i++) {
                        const aValueName = a.attributeValueNames[i];
                        const subtypeAttributeValue = subtypeAttribute.values.find((sav) => sav.name === aValueName);
                        if (typeof subtypeAttributeValue === 'undefined') {
                            return createValidationErrorObject(`Attribute value with name ${aValueName} not found for ${a.attributeName}`);
                        }
                    }
                }
            }
            else {
                if (typeof a !== 'undefined') {
                    const subtypeAttributeValue = subtypeAttribute.values.find((sav) => sav.name === a.attributeValueName);
                    if (typeof subtypeAttributeValue === 'undefined') {
                        return createValidationErrorObject(`Attribute value with name ${a.attributeValueName} Not found for ${a.attributeName}`);
                    }
                }
            }
        }
    }
    return { isValid: true };
};
//# sourceMappingURL=bulk-upload-products.js.map