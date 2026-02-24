import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCom from '../../Common/Library/CommonLibrary';
import isWindows from '../../Common/IsWindows';
import fsmFormIOSAndroidImplementation from './FSMFormPageNav';
import fsmFormWindowsImplementation from './FSMFormPageNavWindows';
import FSMSmartFormsLibrary from './FSMSmartFormsLibrary';

export default function FSMFormPageNavWrapper(context, customBinding) {
    ApplicationSettings.remove(context, 'XMLTemplateParsed');
    libCom.removeStateVariable(context, ['FSMToastMessage']);
    FSMSmartFormsLibrary.resetSmartFormsFlags(context);
    return isWindows(context) ? fsmFormWindowsImplementation(context) : fsmFormIOSAndroidImplementation(context, customBinding);
}
