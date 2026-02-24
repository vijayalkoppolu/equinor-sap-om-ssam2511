import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function FSMS4CrewDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Crew/FSMS4CrewMemberDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'CrewMemberDetailsSection');
}
