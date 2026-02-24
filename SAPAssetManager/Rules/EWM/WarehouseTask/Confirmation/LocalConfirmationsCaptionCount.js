import { LocalConfirmationFilterAndSearchQuery } from './LocalConfirmationsQueryOptions';
import ComLib from '../../../Common/Library/CommonLibrary';

function getLocalConfirmationCounts(context, binding) {
    const totalCountQueryOptions = LocalConfirmationFilterAndSearchQuery(context, false, binding);
    const countQueryOptions = LocalConfirmationFilterAndSearchQuery(context, true, binding);
    
    const totalCountPromise = ComLib.getEntitySetCount(context, 'WarehouseTaskConfirmations', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(context, 'WarehouseTaskConfirmations', countQueryOptions);
    
    return Promise.all([countPromise, totalCountPromise]);
}

export default function LocalConfirmationCaptionCount(context, binding = context.getPageProxy().binding) {
    return getLocalConfirmationCounts(context, binding)
        .then(([count, totalCount]) => {
            if (count === totalCount) {
                return context.localizeText('items_x', [totalCount]);
            }
            return context.localizeText('items_x_x', [count, totalCount]);
        });
}
