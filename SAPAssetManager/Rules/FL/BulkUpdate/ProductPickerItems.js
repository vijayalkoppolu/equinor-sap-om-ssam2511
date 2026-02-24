/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import {FLTypeEntitySetMap} from '../Common/FLLibrary';
export default async function ProductPickerItems(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const entitySet = FLTypeEntitySetMap[type] || '';
     // Read the materials
     const materials = await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$orderby=Material');

     // Extract unique materials
     const uniqueMaterials = [...new Set(materials.map(c => c.Material))];

     // Create a filter string with OR conditions
    const filterString = uniqueMaterials.map(material => `MaterialNum eq '${material}'`).join(' or ');
 
    // Read material descriptions using the filter string
    const materialDescriptions = await context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], `$filter=${filterString}`);

    // Create a map of material to description
    const materialDescriptionMap = materialDescriptions.reduce((map, item) => {
        map[item.MaterialNum] = item.Description;
        return map;
    }, {});
 
     // Map unique materials to picker items with descriptions
     return uniqueMaterials.map(uniqueMaterial => ({
         'DisplayValue': materialDescriptionMap[uniqueMaterial] ? `${uniqueMaterial} - ${materialDescriptionMap[uniqueMaterial]}` : `${uniqueMaterial}`,
         'ReturnValue': `${uniqueMaterial}`,
     }));
}
