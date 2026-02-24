import libPersona from '../Persona/PersonaLibrary';

export default function SmartFormsDetailImage(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? undefined : '$(PLT, /SAPAssetManager/Images/DetailImages/Smartforms.png, /SAPAssetManager/Images/DetailImages/Smartforms.android.png)';
}
