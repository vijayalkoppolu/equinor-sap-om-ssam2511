/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import {FLTypeEntitySetMap} from '../Common/FLLibrary';
export default async function ReferenceDocPickerItems(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const entitySet = FLTypeEntitySetMap[type] || '';
    // Read the reference documents
    const referenceDocs = await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$orderby=ReferenceDocNumber');

    // Extract unique reference documents
    const uniqueReferenceDocs = [...new Set(referenceDocs.map(doc => doc.ReferenceDocNumber))];

    // Map unique reference documents to picker items
    return uniqueReferenceDocs.map(uniqueDoc => ({
        'DisplayValue': `${uniqueDoc}`,
        'ReturnValue': `${uniqueDoc}`,
    }));

}
