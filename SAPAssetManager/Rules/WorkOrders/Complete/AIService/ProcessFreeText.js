import ConfirmationsIsEnabled from '../../../Confirmations/ConfirmationsIsEnabled';
import AnalyticsLibrary from '../../../Extensions/EventLoggers/Analytics/AnalyticsLibrary';
import Logger from '../../../Log/Logger';
import TimeSheetsIsEnabled from '../../../TimeSheets/TimeSheetsIsEnabled';
import SetWOExpenseVisible from '../Expenses/SetWOExpenseVisible';
import SetWOMileageVisible from '../Mileage/SetWOMileageVisible';
import SetWONoteVisible from '../Note/SetWONoteVisible';
import SetWONotificationVisible from '../Notification/SetWONotificationVisible';
import { getRelatedOperationsTitles, getFirstOperationNoFromTitles } from './GetRelatedOperations';
import LLMSchemaBuilder from './LLMSchemaBuilder'; 
// Generates a message containing information about work order operations
// This helps provide context to the AI for more accurate parsing
async function generateOperationInfoMessage(context) {
    const operationTitles = await getRelatedOperationsTitles(context);
    const firstOpNo = getFirstOperationNoFromTitles(operationTitles);
    let message = 'Work order operations:\n';
    message += operationTitles;
    return { message, firstOpNo };
}

export default async function ProcessFreeText(context, inputText) {
    const { operationInfoMessage, firstOpNo } = await generateOperationInfoMessage(context); 
    const aiInput = operationInfoMessage + ' ' + inputText;
    try {
        context.showActivityIndicator(context.localizeText('processing'));
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/AIService/SendAIRequest.action',
            'Properties': {
                'Target': {
                    'RequestProperties': {
                        'Body': {
                            'userMessage': aiInput,
                            'schemas': await buildSchemas(context),
                            'businessContext': context.binding.OrderId + '-' + (context.binding.OperationNo || firstOpNo),
                        },
                    },
                },
            },
        }).then(async response => {
            const result = response.data.actions[0];
            Logger.info('Successful response from server:\n', result);
            AnalyticsLibrary.aiJobCompletion();
            return result;
        }).catch(error => {
            Logger.error('AI POST request error: ', error);
            return '';
        }).finally(() => {
            context.dismissActivityIndicator();
        });
    } catch (error) {
        Logger.error('An error occurred:', error);
        return '';
    }
}
async function buildSchemas(context) {
    const notificationItemSchema = await LLMSchemaBuilder.getNotificationItemSchema(context);
    const schemas = [];
    const properties = notificationItemSchema?.notificationItem?.properties;

    // Always include operation
    schemas.push({ name: 'operation' });

    if (SetWOMileageVisible(context)) {
        schemas.push({ name: 'mileage' });
    }
    if (SetWOExpenseVisible(context)) {
        schemas.push({ name: 'expense' });
    }
    if (ConfirmationsIsEnabled(context) || TimeSheetsIsEnabled(context)) {
        schemas.push({ name: 'time' });
    }
    if (SetWONoteVisible(context)) {
        schemas.push({ name: 'note' });
    }
    if (SetWONotificationVisible(context)) {
        const partAndGroupMap = {};
        const damageAndGroupMap = {};
        const causeAndGroupMap = {};

        const partAndGroupOneOf = properties?.partAndGroup?.oneOf || [];
        partAndGroupOneOf.forEach(entry => {
            const partGroup = entry.properties?.partGroup?.enum?.[0];
            const parts = entry.properties?.part?.enum || [];
            if (partGroup) partAndGroupMap[partGroup] = parts;
        });

        const damageAndGroupOneOf = properties?.damageAndGroup?.oneOf || [];
        damageAndGroupOneOf.forEach(entry => {
            const damageGroup = entry.properties?.damageGroup?.enum?.[0];
            const damages = entry.properties?.damage?.enum || [];
            if (damageGroup) damageAndGroupMap[damageGroup] = damages;
        });

        const causeAndGroupOneOf = properties?.causeAndGroup?.oneOf || [];
        causeAndGroupOneOf.forEach(entry => {
            const causeGroup = entry.properties?.causeGroup?.enum?.[0];
            const causes = entry.properties?.cause?.enum || [];
            if (causeGroup) causeAndGroupMap[causeGroup] = causes;
        });

        schemas.push({
            name: 'notificationItem',
            partAndGroup: partAndGroupMap,
            damageAndGroup: damageAndGroupMap,
            causeAndGroup: causeAndGroupMap,
        });
    }
    return schemas;
}
