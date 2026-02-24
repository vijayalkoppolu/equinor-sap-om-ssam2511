import { getStatusFilterQueryOptions } from '../SearchCriteria/StatusFilterOptions';

/**
 * Return statuses filter
 * @returns 
 */
export default function FilterQueryOptions(context) {
    return getStatusFilterQueryOptions(context);
}
