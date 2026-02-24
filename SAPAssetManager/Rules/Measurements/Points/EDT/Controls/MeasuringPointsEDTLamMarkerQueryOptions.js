import QueryBuilder from '../../../../Common/Query/QueryBuilder';
import MeasuringPointsEDTLinearReferencePatternIdValue from './Values/LAM/MeasuringPointsEDTLinearReferencePatternIdValue';

export default function MeasuringPointsEDTLamMarkerQueryOptions(context) {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addExtra('orderby=Marker');

    const lrpId = MeasuringPointsEDTLinearReferencePatternIdValue(context);
    if (lrpId) {
        queryBuilder.addFilter(`LRPId eq '${lrpId}'`);
    }

    return queryBuilder.build();
}
