import EnableAttachmentCreate from '../../UserAuthorizations/Attachments/EnableAttachmentCreate';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsEditTechObjectFeatureEnabled from '../../UserFeatures/IsEditTechObjectFeatureEnabled';
import ODataLibrary from '../../OData/ODataLibrary';

/**
* Show/hide edit equipment button based on Persona or User Authorization 
* @param {IClientAPI} context
*/
export default function EquipmentEditButtonVisible(context) {
    if (PersonaLibrary.isWCMOperator(context) || CommonLibrary.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Edit') === 'N') {
        return false;
    }

    if (ODataLibrary.isLocal(context?.binding) || IsEditTechObjectFeatureEnabled(context)) {
        return true; //Allow local edits and tech object edit feature
    }

    return EnableAttachmentCreate(context); //Edit attachments on existing equipment
}
