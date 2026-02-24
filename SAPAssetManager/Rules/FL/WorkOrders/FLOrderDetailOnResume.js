
import FilterSettings from '../../Filter/FilterSettings';

export default function FLOrderDetailOnResume(clientAPI) {
     clientAPI.getControls()[0].redraw();   
    const sectionHeader = clientAPI.getPageProxy().getControl('SectionedTable').getSection('SectionObjectHeader');
    sectionHeader.redraw();
    const tabs = clientAPI.getPageProxy().getControl('TabsControl');
    const idx = tabs.getSelectedTabItemIndex();
    const tabItem = tabs.tabItems[idx];
    const tabPageProxy = tabItem.getPageProxy();

    const sectionedTableProxy = tabPageProxy.getControls()[0];
    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;
    const section = sectionedTableProxy.getSection('SectionObjectTable');
    FilterSettings.applySavedFilterOnList(clientAPI);

        if (section) {
            
            return section.redraw(true).then(() => {
                return Promise.resolve();
            });
        } 
}
