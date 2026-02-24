import libPersona from '../../Persona/PersonaLibrary';

/**
 * Format the work order label for the confirmation screen
 * @param {IClientAPI} context
 * @returns {string} The localized work order label
 */
export default function ConfirmationCreateWorkOrderLabel(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return context.localizeText('service_order') + '*';
    }
    return context.localizeText('workorder') + '*';
}
