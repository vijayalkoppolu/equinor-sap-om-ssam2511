/**
 * Find the entity binding type of the current page by checking the parent page
 * @param {IClientAPI} context 
 * @param {Array} pages - array of pages to search through
 * @returns 
 */
export default function GetEntityBindingByParent(context, pages) {
    const parentPageName = context.getPageProxy()._page.parent.id;
    const page = pages.find(p => parentPageName.startsWith(p));
    return (context.binding['@odata.type'] ? context.binding['@odata.type'] : context.getPageProxy().evaluateTargetPath(`#Page:${page}`).context.binding['@odata.type']).substring('#sap_mobile.'.length);
}
