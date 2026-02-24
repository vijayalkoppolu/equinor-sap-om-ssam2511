import { IsUntaggingActive } from '../libWCMDocumentItem';

export default async function SetTaggedSemantic(clientAPI) {
    const isUntaggingActive = await IsUntaggingActive(clientAPI);
    return isUntaggingActive ? 'Normal' : 'Tint';
}
