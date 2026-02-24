import partsIssueEDTCounts from './PartsIssueEDTCounts';

export default async function PartsIssueEDTCaption(context) {
    const counts = await partsIssueEDTCounts(context);
    return context?.localizeText('parts_x', [counts]);
}
