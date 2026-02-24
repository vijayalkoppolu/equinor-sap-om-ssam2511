
export default async function FSMCrewMemberTechnicianType(context) {
    return context.binding.TechnicianType === 'LEADER' ? context.localizeText('lead') : context.localizeText('member');
}
