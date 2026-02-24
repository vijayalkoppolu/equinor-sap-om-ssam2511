import libPersona from '../Persona/PersonaLibrary';

export default function IsDownloadFLVisible(clientAPI) {
    return libPersona.isEnableFieldLogisticsOperator(clientAPI) && !clientAPI.isDemoMode();
}
