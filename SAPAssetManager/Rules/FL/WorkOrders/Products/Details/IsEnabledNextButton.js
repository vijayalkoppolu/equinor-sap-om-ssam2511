import { IsLast } from './GetNextPreviousProduct';
import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function IsEnabledNextButton(context) {
    const currentProductId = context.binding.Product;
    const productArray = CommonLibrary.getStateVariable(context, 'PRODUCTS_ARRAY') || [];

    if (!context.filters || context.filters.length === 0) {
        return !IsLast(context, currentProductId);
    }
    const currentIndex = productArray.findIndex(item => item.Product === currentProductId);
    return currentIndex !== -1 && currentIndex < productArray.length - 1;
}
