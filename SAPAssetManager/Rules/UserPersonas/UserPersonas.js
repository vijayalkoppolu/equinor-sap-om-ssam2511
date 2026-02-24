import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function UserPersonas(context) {
    const personaMT = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTPersonaName.global').getValue();
    const personaFST = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/FSTPersonaName.global').getValue();

    let personas = [];
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], '').then(function(userPersonasResults) {
        for (let i = 0; i < userPersonasResults.length; i++) {
            const personaRecord = userPersonasResults.getItem(i);

            const personaCode = personaRecord.PersonaCode;
            const persona = personaRecord.UserPersona;

            let displayValue = personaRecord.PersonaCodeDesc;
            if (personaCode === personaMT && personaRecord.FlagExternal === 'X') {
                displayValue = context.localizeText('external_technician');
            } else if (personaCode === personaFST && personaRecord.FlagExternal === 'X') {
                displayValue = context.localizeText('external_field_service');
            }

            personas.push({
                'DisplayValue': displayValue,
                'ReturnValue': persona,
            });
        }
        libCom.setStateVariable(context, 'UserPersonas', personas);
        libCom.setStateVariable(context, 'UserPersonasData', userPersonasResults);
        return personas;
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryUserPersona.global').getValue(),`UserPersonas(context) error: ${error}`);
        libCom.setStateVariable(context, 'UserPersonas', personas);
        return personas;
    });
}
