
export default function FSMCrewSelectedDateChanged(context) {
    const sectionedTableControl = context.getPageProxy().getControl('SectionedTable');
    const crewMembersSection = sectionedTableControl.getSection('CrewMembers');
    if (crewMembersSection) {
        crewMembersSection.redraw(true);
    }
}
