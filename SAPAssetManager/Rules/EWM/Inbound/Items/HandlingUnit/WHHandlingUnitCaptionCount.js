import ComLib from '../../../../Common/Library/CommonLibrary';
import { WHHandlingUnitFilterAndSearchQuery } from './WHHandlingUnitListQuery';

export default function WHHandlingUnitCaptionCount(context) {
    const totalCountQueryOptions = WHHandlingUnitFilterAndSearchQuery(context);
    const countQueryOptions = WHHandlingUnitFilterAndSearchQuery(context, true);

    const totalCountPromise = ComLib.getEntitySetCount(context, 'HandlingUnitItems', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(context, 'HandlingUnitItems', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return context.localizeText('items_x', [totalCount]);
        }
        return context.localizeText('items_x_x', [count, totalCount]);
    });   
}
