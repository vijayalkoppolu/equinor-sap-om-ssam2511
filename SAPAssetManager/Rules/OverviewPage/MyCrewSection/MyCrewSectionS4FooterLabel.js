import QueryBuilder from '../../Common/Query/QueryBuilder';
import IsFSMS4CrewComponentEnabled from '../../ComponentsEnablement/IsFSMS4CrewComponentEnabled';
import FSMCrewLibrary from '../../Crew/FSMCrewLibrary';
import Logger from '../../Log/Logger';
import { WorkOrderLibrary } from '../../WorkOrders/WorkOrderLibrary';
import { getItemsFiltersByCrewDate } from './MyCrewSectionS4QueryOption';

export default async function MyCrewSectionS4FooterLabel(context) {
    if (!IsFSMS4CrewComponentEnabled(context)) return 0;

    const defaultDates = WorkOrderLibrary.getActualDates(context);

    const crew = await FSMCrewLibrary.getFSMCrewByUserAndDates(context, defaultDates);
    if (!crew) return 0;

    const filters = await getItemsFiltersByCrewDate(context, crew, defaultDates);
    if (filters.length === 0) return 0;

    const queryOptions = new QueryBuilder();
    queryOptions.addFilter(filters.join(' or '));
    
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', queryOptions.build())
        .catch(error => {
            Logger.error(error);
            return Promise.resolve(0);
        });
}
