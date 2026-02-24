import libConfirm from './ConfirmationScenariosLibrary';
import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default async function generateQRCodeOnLoaded(context) {
    libCom.removeStateVariable(context, 'QRCodeExpiredDisplayed'); //Clear the expired image flag
    let config = await libConfirm.readGlobalConfig(context);

    if (config) {
        let enableText = await libConfirm.getTextEnabled(context, config);
        if (enableText) { //Set up state variable that controls maximum text length if text entry is enabled
            let textMaxLength = await libConfirm.getTextMaxLength(context, config);
            libCom.setStateVariable(context, 'CooperationMaxTextLength', textMaxLength);
            context.getPageProxy().getControl('SectionedTable').getControl('LongText').setVisible(true); //Display the long text comment field
        } else {
            libCom.removeStateVariable(context, 'CooperationMaxTextLength');
        }
        return await libConfirm.generateQRCodeAndRefresh(context);
    } else {
        //Error reading global config
         Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Configuration read error in generateQRCodeOnLoaded');
         return false;
    }
}
