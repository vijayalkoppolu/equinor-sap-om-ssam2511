
export default function GetTemplatesByCategoriesQueryOptions(context) {
    const binding = context.getPageProxy().binding;
    let queryOptions = '$orderby=Name,Description';
    
    if (binding.S4Flag !== undefined && binding.ChecklistCategoryName !== undefined) {
        queryOptions += `&$filter=S4Flag eq '${binding.S4Flag ? 'X' : ''}' and ChecklistCategoryName eq '${binding.ChecklistCategoryName}' and Status eq 'ACTIVE'`;
    }

    return queryOptions;
}
