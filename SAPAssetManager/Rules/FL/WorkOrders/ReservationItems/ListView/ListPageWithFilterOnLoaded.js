import ListPageWithFilterOnLoaded from  '../../Products/ListView/ListPageWithFilterOnLoaded';
/**
* Saves initial filters set for page
* Applies filter criteria saved in 'UserPreferences' table for current page to sectionedTable filters, if there are any
* @param {IClientAPI} context
*/
export default function ListResvPageWithFilterOnLoaded(context) {
   return  ListPageWithFilterOnLoaded(context, 'FLWOResvItemsList', 'SectionObjectTable0');
}
