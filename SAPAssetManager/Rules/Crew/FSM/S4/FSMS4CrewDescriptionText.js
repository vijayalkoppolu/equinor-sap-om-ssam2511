
export default function FSMS4CrewDescriptionText(context) {
    let items = context.binding.CrewListItems || [];
    items = items.filter(item => item.CrewItemType === 'BP');
    return context.localizeText('crew_members_x', [items.length]);
}
