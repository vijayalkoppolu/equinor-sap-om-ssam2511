/**
* Checks if the current page is an overview tab page by examining if the page name contains '_tab'.
* @param {IClientAPI} clientAPI
* @returns {boolean} True if the page name contains '_tab', false otherwise
*/
export default function IsOverviewTabPage(clientAPI) {
    return clientAPI.getPageProxy().getName().includes('_tab');
}
