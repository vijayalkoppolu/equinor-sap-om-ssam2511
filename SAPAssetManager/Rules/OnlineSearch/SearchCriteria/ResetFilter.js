import libCom from '../../Common/Library/CommonLibrary';
import libSearch from '../OnlineSearchLibrary';
import FilterReset from '../../Filter/FilterReset';

/**
* Clears client data properties that were set for simple property controls default values and resets filter
* @param {IControlProxy} control
*/
export default function ResetFilter(control) {
    const pageProxy = control.getPageProxy();
    const activeTab = libSearch.getCurrentTabName(control);
    resetClientData(pageProxy, activeTab);
    FilterReset(control);
    setTabToEmptyState(pageProxy, activeTab);
}

function resetClientData(pageProxy, activeTab) {
    const controlNames = libSearch.getSimplePropertyControls(pageProxy).map(c => c.getName());
    libCom.removeStateVariable(pageProxy, controlNames, libSearch.getPageNameByTabName(pageProxy, activeTab));

    const workOrdersTabName = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    if (workOrdersTabName === activeTab) {
        let clientData = pageProxy.evaluateTargetPath('#Page:OnlineSearchWorkOrdersList/#ClientData');
        clientData.StartDateSwitch = undefined;
        clientData.AssignFilterButtons = undefined;
    }
}

function setTabToEmptyState(pageProxy, activeTab) {
    const listPageProxy = libSearch.getCurrentTabPage(pageProxy, activeTab);
    const onlineSection = listPageProxy.getControls()[0].getSections()[0];
    const emptySearchSection = listPageProxy.getControls()[0].getSections()[1];
    libSearch.setSearchCriteriaCount(pageProxy, activeTab, 0);
    libSearch.executeSearchOrHideSection(pageProxy, onlineSection, emptySearchSection, 0);
}   
