import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FSMCrewSelectedDateCaption(context) {
    let selectedDate = new Date();

    const sectionedTableControl = context.getPageProxy().getControl('SectionedTable');
    if (sectionedTableControl) {
        const calendarSection = sectionedTableControl.getSection('CalendarSection');
        selectedDate = calendarSection.getSelectedDate();
    }

    return `${context.formatDate(selectedDate)} (${CommonLibrary.relativeDayOfWeek(selectedDate, context)})`;
}
