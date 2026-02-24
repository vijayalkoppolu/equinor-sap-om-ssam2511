import S4ServiceLibrary from '../S4ServiceLibrary';

export default function IsServiceItemCategory(context) {
    const serviceItemCategories = S4ServiceLibrary.getServiceProductItemCategories(context);
    let binding = context.binding;
    if ((!binding || binding['@odata.type'] !== '#sap_mobile.S4ServiceItem') && context.getPageProxy().getActionBinding()) {
        binding = context.getPageProxy().getActionBinding();
    }
    return serviceItemCategories.includes(binding.ItemObjectType);
}
