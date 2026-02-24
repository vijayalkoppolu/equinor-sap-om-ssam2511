import ComLib from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import GetOutboundListQuery from './GetInboundOutboundListQuery';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function GetInboundOutboundItemsCount(context) {
    const totalCountQueryOptions = await GetOutboundListQuery(context,true);
    let countQueryOptions = await GetOutboundListQuery(context, false, true);
    const filterOption = getCurrentFilters(context);
    if (!ValidationLibrary.evalIsEmpty(filterOption)) {
         countQueryOptions = mergeFilters(countQueryOptions, filterOption);
    }
    const totalCountPromise = ComLib.getEntitySetCount(context, 'MyInventoryObjects', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(context, 'MyInventoryObjects', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return context.localizeText('all_caption', [totalCount]);
        }
        return context.localizeText('all_caption_double', [count, totalCount]);
    });
}

function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
       return '';     
    }
    return ComLib.getFormattedQueryOptionFromFilter(context);
}

function mergeFilters(queryOptions, newFilter) {
    const filterMatch = queryOptions.match(/\$filter=([^&]*)/);
    if (filterMatch && filterMatch[1]) {
        const existingFilter = filterMatch[1];
        // Combine with 'and' (change to 'or' if needed)
        const combinedFilter = `(${existingFilter}) and (${newFilter})`;
        return queryOptions.replace(/\$filter=[^&]*/, `$filter=${combinedFilter}`);
    } else {
        // No existing filter, just add it
        return queryOptions.replace('$filter=', `$filter=${newFilter}`);
    }
}

