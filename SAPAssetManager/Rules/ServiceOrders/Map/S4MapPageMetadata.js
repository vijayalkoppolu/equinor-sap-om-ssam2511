import IsS4ServiceOrderFeatureDisabled from '../IsS4ServiceOrderFeatureDisabled';

export default function S4MapPageMetadata(context) {
    const page = context.getPageDefinition('/SAPAssetManager/Pages/FieldService/FSMS4Map.page');
    if (IsS4ServiceOrderFeatureDisabled(context)) {
        page.Controls[0].ExtensionProperties.BusinessObjects = [];
    } 

   return page;
}
