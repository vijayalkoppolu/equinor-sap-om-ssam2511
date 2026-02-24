import { GlobalVar as globals } from '../Common/Library/GlobalCommon';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import QueryBuilder from '../Common/Query/QueryBuilder';
import PersonaLibrary from '../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default async function TimeSheetWorkOrderFilter(context) {
	const queryBuilder = new QueryBuilder();
	queryBuilder.addExtra('orderby=OrderId asc');

	try {
		// If autorelease is off, or we can't do local MobileStatuses, filter out local work orders
		if (globals.getAppParam().WORKORDER.AutoRelease !== 'Y' || globals.getAppParam().MOBILESTATUS.EnableOnLocalBusinessObjects !== 'Y') {
			queryBuilder.addFilter("not startswith(OrderId, 'LOCAL_W')");
		}
	} catch (exc) {
		// App parameter can't be fetched. Assume no autorelease and no local MobileStatus
		queryBuilder.addFilter("not startswith(OrderId, 'LOCAL_W')");
	}

	if (PersonaLibrary.isFieldServiceTechnician(context)) {
        const fsmQueryOptions = await WorkOrdersFSMQueryOption(context);
		if (!ValidationLibrary.evalIsEmpty(fsmQueryOptions)) {
			queryBuilder.addFilter(fsmQueryOptions);
		}
    }

	return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryBuilder.build());
}
