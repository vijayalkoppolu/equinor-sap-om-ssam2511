import CommonLibrary from '../../../../Common/Library/CommonLibrary';
const PRODUCTS_ARRAY = 'PRODUCTS_ARRAY';


/**
 * Is the product first in the list
 * @param {IClientAPI}context 
 * @param {string} productId 
 * @returns 
 */
export function IsFirst(context, productId) {
    const productArray = CommonLibrary.getStateVariable(context, PRODUCTS_ARRAY);
    if (productArray && productArray.length > 0) {
        return productArray.at(0).Product === productId;
    }
    return true;
}

/**
 * Is the product last in the list
 * @param {IClientAPI}context 
 * @param {string} productId 
 * @returns 
 */
export function IsLast(context, productId) {
    const productArray = CommonLibrary.getStateVariable(context, PRODUCTS_ARRAY);
    if (productArray && productArray.length > 0) {
        return productArray.at(productArray.length - 1).Product === productId;
    }
    return true;
}

/**
 * Get the next or previous product from the array
 * @param {IClientAPI}context 
 * @param {string} productId 
 * @param {boolean} next 
 * @returns 
 */
export default function GetNextPreviousProduct(context, productId, next = true) {
    const productArray = CommonLibrary.getStateVariable(context, PRODUCTS_ARRAY);
    if (!productArray || productArray.length === 0) {
        return undefined;
    }
    const index = productArray.findIndex(element => element.Product === productId);
    if (index === -1) {
        return undefined;
    }
    return productArray.at(index + (next ? 1 : -1));
}
