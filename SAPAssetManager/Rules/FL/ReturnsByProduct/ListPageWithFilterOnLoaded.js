import FilterSettings from '../../Filter/FilterSettings';

/**
* Saves initial filters set for page
* Applies filter criteria saved in 'UserPreferences' table for current page to sectionedTable filters, if there are any
*/
export default function ListPageWithFilterOnLoaded(context) {
    FilterSettings.applySavedFilterOnList(context);
    context.getControl('SectionedTable').redraw(true);
}
