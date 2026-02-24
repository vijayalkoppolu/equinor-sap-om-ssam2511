
export default async function GetTemplatesCategories(context) {
    const listItems = [];
    const binding = context.getPageProxy().binding;

    const s4Flag = binding['@odata.type'] === '#sap_mobile.S4ServiceItem' || binding['@odata.type'] === '#sap_mobile.S4ServiceOrder';
    let queryOptions = `$orderby=ChecklistCategoryName&$filter=S4Flag eq '${s4Flag ? 'X' : ''}' and Status eq 'ACTIVE'`;

    if (context.searchString) {
        queryOptions += ` and substringof('${context.searchString.toLowerCase()}', tolower(ChecklistCategoryName))`;
    }

    const templates = await context.read('/SAPAssetManager/Services/AssetManager.service', 'FSMFormTemplates', [], queryOptions);
    const categories = {};

    templates.forEach(template => {
        if (categories[template.ChecklistCategoryName]) {
            categories[template.ChecklistCategoryName] += 1;
        } else {
            categories[template.ChecklistCategoryName] = 1;
        }
    });
    
    Object.keys(categories).forEach((category, index) => {
        listItems[index] = {
            'ChecklistCategoryName': category,
            'Count': categories[category],
            'S4Flag': s4Flag,
        };
    });

    return listItems;
}
