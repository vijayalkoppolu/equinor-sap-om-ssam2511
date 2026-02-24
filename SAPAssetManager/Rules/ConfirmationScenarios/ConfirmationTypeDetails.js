/**
 * Return the confirmation type
 * Used for display on confirmation details and list screens
 * @param {*} context 
 * @returns 
 */
export default function ConfirmationTypeDetails(context) {
    const coopScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
    const doubleScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();

    switch (context.binding?.ConfirmationScenario) {
        case coopScenario:
            return context.localizeText('confirmation_type_cooperation');
        case doubleScenario:
            return context.localizeText('confirmation_type_double_check');
        default:
            return context.localizeText('confirmation_type_time');
    }
}
