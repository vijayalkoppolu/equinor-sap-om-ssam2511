import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function UserProfileRequiredFields(context) {
    const userPersonaLogCategory = context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryUserPersona.global').getValue();
    let personaLstPkrValue = undefined;
    try {
        // When a user switches accounts, if there is a network disconnect and the user restarts the app after the network is restored,  
        // the active persona may be blank, and the persona list picker will be hidden.  
        // In this scenario, we should skip the user persona required field check.
        personaLstPkrValue = context.evaluateTargetPath('#Control:SwitchPersonaLstPkr/#SelectedValue');
    } catch (error) {
        Logger.error(userPersonaLogCategory, `UserProfileRequiredFields(context) error: ${error}`);
    }
    if (libCom.isDefined(personaLstPkrValue)) {
        return context.executeAction('/SAPAssetManager/Actions/User/UserProfileRequiredFields.action');
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
