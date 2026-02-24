import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function MaterialsSearchQueryOptions(context, filterQueryString = false) {
    const expand = 'Material/MaterialPlants,MaterialPlant/MaterialBatch_Nav';
    const orderBy = 'Plant asc,StorageLocation asc';
    const filterTerms = [];

    const sectionedTable = context.getPageProxy().getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const tableFilter = CommonLibrary.GetSectionedTableFilterTerm(sectionedTable);
    if (tableFilter) {
        filterTerms.push(tableFilter);
    }
    if (EnableFieldServiceTechnician(context)) {
        filterTerms.push(`Plant eq '${CommonLibrary.getUserDefaultPlant()}' and StorageLocation eq '${CommonLibrary.getUserDefaultStorageLocation()}'`);
    }
    let searchString = context.searchString;
    if (searchString) {
        filterTerms.push(getSearchQuery(context, searchString.toLowerCase()));
    }

     const filterQuery = filterTerms.length ? `${filterTerms.join(' and ')}` : '';
    if (filterQueryString) {
        let expandQueryString = '$expand='.concat(expand);
        let orderByQueryString = '$orderby='.concat(orderBy);
        filterQueryString = '$filter='.concat(filterQuery);
        return [expandQueryString, filterQueryString, orderByQueryString].filter(i => !!i).join('&');
    } else {
        const queryBuilder = context.dataQueryBuilder();
        queryBuilder.expand(expand).orderBy(orderBy).filter(filterQuery);
        return queryBuilder;
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Plant', 'StorageLocation', 'Material/Description', 'StorageBin', 'MaterialNum', 'Material/ManufacturerPartNum'];
        ModifyListViewSearchCriteria(context, 'MaterialSLoc', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
