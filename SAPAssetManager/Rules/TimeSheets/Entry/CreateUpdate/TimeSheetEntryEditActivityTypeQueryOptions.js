import QueryBuilder from '../../../Common/Query/QueryBuilder';
import { TimeSheetLibrary } from '../../TimeSheetLibrary';

export default async function TimeSheetEntryEditActivityTypeQueryOptions(context) {
    let query = new QueryBuilder();
    query.addExtra('orderby=ActivityType');

    let woId = context.binding.RecOrder;
    if (woId) {
        let workCenterId = await TimeSheetLibrary.GetWorkCenterFromObject(context, `MyWorkOrderHeaders('${woId}')`);
        const filterQuery = !workCenterId || typeof workCenterId === 'string' ? `$filter=WorkCenterId eq '${workCenterId}'` : `$filter=ExternalWorkCenterId eq '${workCenterId.mainWorkCenter}' and PlantId eq '${workCenterId.mainWorkCenterPlant}'`;
        
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filterQuery).then(result => {
            let workCenter = result.length ? result.getItem(0) : null;

            if (workCenter?.CostCenter) {
                query.addFilter(`CostCenter eq '${workCenter.CostCenter}'`);
            }

            if (workCenter?.ControllingArea) {
                query.addFilter(`ControllingArea eq '${workCenter.ControllingArea}'`);
            }
            
            return query.build();
        });
    }

    return query.build();
}
