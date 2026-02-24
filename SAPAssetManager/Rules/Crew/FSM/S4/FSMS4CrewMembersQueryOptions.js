import QueryBuilder from '../../../Common/Query/QueryBuilder';
import FSMCrewLibrary from '../../FSMCrewLibrary';

export default function FSMS4CrewMembersQueryOptions(context) {
    let query = new QueryBuilder();
    query.addExpandStatement('BusinessPartner_Nav,BusinessPartner_Nav/Address_Nav,BusinessPartner_Nav/Address_Nav/AddressCommunication');
    query.addExtra('orderby=TechnicianType');
    query.addFilter("CrewItemType eq 'BP'");

    let selectedDate = new Date();

    const sectionedTableControl = context.getPageProxy().getControl('SectionedTable');
    if (sectionedTableControl) {
        const calendarSection = sectionedTableControl.getSection('CalendarSection');
        selectedDate = calendarSection.getSelectedDate();
    }

    if (selectedDate) {
        query.addFilter(FSMCrewLibrary.getFSMCrewItemDateQuery(selectedDate));
    }

    return query.build();
}
