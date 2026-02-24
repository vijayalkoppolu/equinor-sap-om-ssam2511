/**
 * Toggles the visibility of AI-related sections on the page.
 * 
 * This function retrieves the 'SectionedTable' control from the page proxy and toggles the visibility
 * of the 'AIRecordSection', 'UseAIPromptSectionHide', and 'UseAIPromptSection' sections.
 * 
 * @param {IClientAPI} clientAPI - The client API instance used to interact with the page.
 * @throws {Error} Throws an error if the 'SectionedTable' control or any of the specified sections are not found.
*/

export default function ToggleAIPromptSection(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const sectionedTable = pageProxy.getControl('SectionedTable');
    if (!sectionedTable) {
        throw new Error('SectionedTable control not found');
    }
    const aiRecordSection = sectionedTable.getSection('AIRecordSection');
    const aiPromptSectionHide = sectionedTable.getSection('UseAIPromptSectionHide');
    const aiPromptSectionShow = sectionedTable.getSection('UseAIPromptSection');
    if (!aiRecordSection || !aiPromptSectionHide || !aiPromptSectionShow) {
        throw new Error('One or more sections not found');
    }

    const isVisible = aiRecordSection.getVisible();

    aiRecordSection.setVisible(!isVisible);

    aiPromptSectionHide.setVisible(!aiPromptSectionHide.getVisible());

    aiPromptSectionShow.setVisible(!aiPromptSectionShow.getVisible());

}
