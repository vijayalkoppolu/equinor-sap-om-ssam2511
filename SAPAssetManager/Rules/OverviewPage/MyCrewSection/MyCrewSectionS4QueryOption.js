import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import Logger from '../../Log/Logger';
import IsFSMS4CrewComponentEnabled from '../../ComponentsEnablement/IsFSMS4CrewComponentEnabled';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import FSMCrewLibrary from '../../Crew/FSMCrewLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import IsS4ServiceOrderFeatureDisabled from '../../ServiceOrders/IsS4ServiceOrderFeatureDisabled';

export default async function MyCrewSectionS4QueryOption(context) {
    if (!IsFSMS4CrewComponentEnabled(context) || IsS4ServiceOrderFeatureDisabled(context)) return Promise.resolve([]);

    const defaultDates = libWO.getActualDates(context);

    const crew = await FSMCrewLibrary.getFSMCrewByUserAndDates(context, defaultDates);
    if (!crew) return [];

    const filters = await getItemsFiltersByCrewDate(context, crew, defaultDates);
    if (filters.length === 0) return [];

    const queryOptions = new QueryBuilder();
    queryOptions.addExtra('orderby=ObjectID,ItemNo');
    queryOptions.addAllExpandStatements(['S4ServiceOrder_Nav','ItemCategory_Nav','ServiceType_Nav','Product_Nav','AccountingInd_Nav','ServiceProfile_Nav','RefObjects_Nav']);
    queryOptions.addAllExpandStatements(['S4ServiceErrorMessage_Nav','MobileStatus_Nav','MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav','TransHistories_Nav/S4ServiceContract_Nav']);
    queryOptions.addFilter(filters.join(' or '));

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', [], queryOptions.build())
        .then(result => result.length ? result.map(item => {
            item.CrewMemberType = crew[item.CrewID]?.type;
            return item;
        }) : [])
        .catch(error => {
            Logger.error(error);
            return Promise.resolve([]);
        });
}

export async function getItemsFiltersByCrewDate(context, crew, defaultDates) {
    const itemsByCrewDateActions = [];

    Object.keys(crew).forEach(crewId => {
        const crewStartDate = new Date(crew[crewId].startDate);
        const crewEndDate = new Date(crew[crewId].endDate);
        const crewDates = {
            lowerBound: crewStartDate > defaultDates.lowerBound ? crewStartDate : defaultDates.lowerBound,
            upperBound: crewEndDate < defaultDates.upperBound ? crewEndDate : defaultDates.upperBound,
        };
        itemsByCrewDateActions.push(S4ServiceLibrary.itemsDateFilter(context, crewDates, 'PlannedStartDate', `CrewID eq '${crewId}'`));
    });

    return Promise.all(itemsByCrewDateActions)
        .then(filters => {
            return filters.filter(filter => filter !== 'false');
        })
        .catch(error => {
            Logger.error('getItemsFiltersByCrewDate', error);
            return [];
        });
}
