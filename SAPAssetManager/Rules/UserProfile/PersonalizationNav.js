/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function PersonalizationNav(clientAPI) {
    const page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/User/Personalization.page');
    if (page) {
        let actionBar = page.ActionBar;
        if (actionBar) {
            const cancelButton = {
                'Position': 'Left',
                'Text': '$(L,cancel)',
                'SystemItem': '/SAPAssetManager/Rules/UserPreferences/UserProfileCloseIcon.js',
				'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeCancel.js',
            };
            actionBar.Items.push(...[cancelButton]);
        }
        return clientAPI.executeAction({
            Name: '/SAPAssetManager/Actions/Common/GenericNav.action',
            Properties: {
                PageMetadata: page,
                ClearHistory: true,
                ModalPage: true,
            },
            Type: 'Action.Type.Navigation',
        });
    }
}
