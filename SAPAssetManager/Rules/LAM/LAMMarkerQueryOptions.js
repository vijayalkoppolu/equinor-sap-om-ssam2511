import QueryBuilder from '../Common/Query/QueryBuilder';
import LAMLinearReferencePatternValue from './LAMLinearReferencePatternValue';

export default async function LAMMarkerQueryOptions(controlProxy) {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addExtra('orderby=Marker');

    const selectedLrpId = await LAMLinearReferencePatternValue(controlProxy);
    if (selectedLrpId) {
        queryBuilder.addFilter(`LRPId eq '${selectedLrpId}'`);
    }

    return queryBuilder.build();
}
