import ConfirmationEntryCreateVisible from '../Confirmations/CreateUpdate/ConfirmationEntryCreateVisible';
import PersonaLibrary from '../Persona/PersonaLibrary';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import IsAddConfirmationButtonVisible from './IsAddConfirmationButtonVisible';
import { GlobalVar as globals } from '../Common/Library/GlobalCommon';
import ODataLibrary from '../OData/ODataLibrary';

export default async function IsAddConfirmationButtonVisibleOnOperationDetails(context) {
    const isAutoReleaseOn = globals.getAppParam().WORKORDER.AutoRelease === 'Y'; //Only relevant for local operations
    const isEnabledOnLocal = globals.getAppParam().MOBILESTATUS.EnableOnLocalBusinessObjects === 'Y'; //Only relevant for local operations
    const isLocal = ODataLibrary.isLocal(context.binding);
    let allowCheck;

    if (isLocal) {
        allowCheck = isAutoReleaseOn && isEnabledOnLocal && PersonaLibrary.isMaintenanceTechnician(context) && IsAddConfirmationButtonVisible(context);
    } else {
        allowCheck = PersonaLibrary.isMaintenanceTechnician(context) && IsAddConfirmationButtonVisible(context);
    }

    if (allowCheck) {
        if (await EnableWorkOrderEdit(context)) {
            return ConfirmationEntryCreateVisible(context);
        }
    } 

    return false;
}
