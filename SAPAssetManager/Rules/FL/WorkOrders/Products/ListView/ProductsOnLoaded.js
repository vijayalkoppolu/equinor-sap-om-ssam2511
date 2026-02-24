import FilterSettings from '../../../../Filter/FilterSettings';

export default function ProductsOnLoaded(pageProxy) {
        FilterSettings.applySavedFilterOnList(pageProxy);
        pageProxy.getControl('SectionedTable').redraw(true);
}
