import IsFSMS4CrewComponentEnabled from '../../ComponentsEnablement/IsFSMS4CrewComponentEnabled';
import FSMCrewLibrary from '../../Crew/FSMCrewLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import { WorkOrderLibrary } from '../../WorkOrders/WorkOrderLibrary';
import { getItemsFiltersByCrewDate } from './MyCrewSectionS4QueryOption';

export default async function MyCrewSectionS4SeeAll(context) {
    if (!IsFSMS4CrewComponentEnabled(context)) return Promise.resolve();
   
    const defaultDates = WorkOrderLibrary.getActualDates(context);

    const crew = await FSMCrewLibrary.getFSMCrewByUserAndDates(context, defaultDates);
    if (!crew) return Promise.resolve();

    const filters = await getItemsFiltersByCrewDate(context, crew, defaultDates);
    if (filters.length === 0) return Promise.resolve();

    const actionBinding = { isInitialFilterNeeded: true };
    actionBinding.filter = `$filter=(${filters.join(' or ')})`;
    actionBinding.displayCrewQuickFilter = Object.values(crew)
        .reduce((crewQuickFilter, crewMember, index, crewList) => {
            return crewQuickFilter + crewMember.name + (index >= crewList.length - 1 ? '' : ', ');
        }, '');

    context.getPageProxy().setActionBinding(actionBinding);
    S4ServiceLibrary.setServiceItemsFilterCriterias(context, []);

    return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action');
    });
}
