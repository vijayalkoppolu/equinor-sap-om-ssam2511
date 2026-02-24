import { IsUntaggingActive } from '../libWCMDocumentItem';

export default async function SetTaggedButtonType(clientAPI) {
    const isUntaggingActive = await IsUntaggingActive(clientAPI);
    return isUntaggingActive ? 'Secondary' : 'Primary';
}
