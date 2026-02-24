
export default class FastFiltersHelper {

    static getFilterItem(displayValue = '', returnValue = '', filterProperty = '', customQueryGroup = '') {
        return {
            'FilterType': 'Filter',
            'DisplayValue': displayValue,
            'ReturnValue': returnValue,
            'FilterProperty': filterProperty,
            'CustomQueryGroup': customQueryGroup,
        };
    }

    static getSorterItem(displayValue = '', returnValue = '', filterLabel = '') {
        return {
            'FilterType': 'Sorter',
            'DisplayValue': displayValue,
            'ReturnValue': returnValue,
            'Label': filterLabel,
        };
    }

    static getAppliedFastFiltersFromContext(context) {
        let fastFilters = [];
        let pageFilterObject = context.getFilter();

        if (pageFilterObject && pageFilterObject.getFilters) {
            let pageFilters = pageFilterObject.getFilters() || [];
            fastFilters = pageFilters.filter(filter => {
                return filter.filterItems.length;
            });
        }
        return fastFilters;
    }

    // during first enterance to the screen we have dates only in fast filter (cannot access it through clientData)
    // example of applicable date filter item "DueDate ge datetime'2025-01-22T00:00:00' and DueDate le datetime'2025-01-22T23:59:59'"
    static getAppliedDateFilterValueFromContext(context, filterLabel) {
        const appliedFilters = this.getAppliedFastFiltersFromContext(context);
        // Find the specific date fast filter based on the label
        const dateFastFilter = appliedFilters?.find(filter => filter.type === 1 && filter.filterItems[0].startsWith(filterLabel));
        if (dateFastFilter) {
            const filterString = dateFastFilter.filterItems[0];
            // Find the positions of the date parts in the filter string
            const startIndex1 = filterString.indexOf("datetime'") + 9; // Start of the first date (after "datetime'")
            const endIndex1 = filterString.indexOf("'", startIndex1); // End of the first date (before the next apostrophe)
            
            const startIndex2 = filterString.indexOf("datetime'", endIndex1) + 9; // Start of the second date (after "datetime'")
            const endIndex2 = filterString.indexOf("'", startIndex2); // End of the second date (before the next apostrophe)
    
    
            // Extract the dates using substring
            const date1 = filterString.substring(startIndex1, endIndex1);
            const date2 = filterString.substring(startIndex2, endIndex2);
    
            return [date1, date2];
        }
    
        return [];
    }

    static getFastFilterCriteria(context, caption = '', filterValues = [], displayValues = undefined) {
        if (displayValues) {
            return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, caption, filterValues, true, undefined, displayValues);
        }
        return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, caption, filterValues, true, undefined, [caption]);
    }

}
