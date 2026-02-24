import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsOnlinePRT from './IsOnlinePRT';
/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function PRTTotalCount(context) {
    let queryStrings = [
        '$filter=(PRTCategory eq \'E\')',
        '$filter=(PRTCategory eq \'M\')',
        '$filter=(PRTCategory eq \'O\')',
        '$filter=(PRTCategory eq \'D\')',
        '$filter=(PRTCategory eq \'P\')',
    ];
    let promises = [];
    for (let item of queryStrings) {
        const service = IsOnlinePRT(context) ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
        promises.push(CommonLibrary.getEntitySetCount(context, context.getPageProxy().binding['@odata.readLink'] + '/Tools', item, service));
    }
    return Promise.all(promises).then((counts) => {
        return counts.reduce(add, 0);
    });
    
}

function add(a,b) {
    return a + b;
}
