/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ValuationTypeQuery(context) {

    return `$filter=Material eq '${context.binding.Product}' and ValuationArea eq '${context.binding.Plant}'&$orderby=ValuationType`;
}
