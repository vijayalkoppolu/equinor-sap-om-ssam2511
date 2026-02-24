import libCom from '../Common/Library/CommonLibrary';
import LocationTrackingToggle from './LocationTrackingToggle';
import personaLib from '../Persona/PersonaLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function CheckForChangesBeforeCancel(context) {
    let persona = personaLib.getActivePersona(context) ?? '';
    let personaCode = personaLib.getActivePersonaCode(context) ?? '';
    let isOn = libCom.getStateVariable(context, 'LocationTrackingSwitch') ?? false;
    const length = libCom.getStateVariable(context, 'UserPersonas').length;
    const pageProxy = context.getPageProxy();

    libCom.removeStateVariable(context, 'LocationTrackingSwitch');

    if (libVal.evalIsEmpty(personaCode) || length === 0) { //No personas
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
    const sectionedTable = pageProxy.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const selectedPersona = sectionedTable.getControl('SwitchPersonaLstPkr').getValue()[0].ReturnValue;
    const locationSwitchValue = sectionedTable.getControl('LocationTrackingSwitch').getValue();
    if (selectedPersona !== persona || locationSwitchValue !== isOn) {
        return LocationTrackingToggle(context, personaCode, isOn).then(function() {
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
