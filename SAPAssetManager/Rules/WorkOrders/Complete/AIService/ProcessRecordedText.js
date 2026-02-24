import ProcessFreeText from './ProcessFreeText';
import { getFirstRelatedOperationNo, isOperationNumberRelated } from './GetRelatedOperations';
import ParseAIResponseToCompletePage from './ParseAIResponseToCompletePage';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import updateButtonStateMachine from './UpdateButtonState';
import Logger from '../../../Log/Logger';
import TelemetryLibrary from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
export default async function ProcessRecordedText(context) {
    const currentTranscription = context.getPageProxy().getControl('SectionedTable').getControl('FreeTextControl').getValue();
    if (currentTranscription) {
        try {
            // Process the free text input using AI
            const aiResponse = await ProcessFreeText(context, currentTranscription);
    
            // Check if AI response is empty
            if (isEmpty(aiResponse)) {
               Logger.error ('AI response is empty');
               throw new Error('AI response is empty');
            }
            if (['Header'].includes(CommonLibrary.getWorkOrderAssnTypeLevel(context))) {
                    // If operation is not specified by AI, try to use the default
                    if (!aiResponse.operation) {
                        aiResponse.operation = {}; // Ensure operation object exists
                    }
                    aiResponse.operation.id = aiResponse.operation?.id || context.binding?.OperationNo || context.binding?.Operation;
                    const isValidOperation = await isOperationNumberRelated(context, aiResponse.operation.id);
                    if (!isValidOperation) {
                        aiResponse.operation.id = await getFirstRelatedOperationNo(context);
                    }


            }
            TelemetryLibrary.logUserEvent(context,
                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AIJobComplete.global').getValue(),
                TelemetryLibrary.EVENT_TYPE_SAVE);            
            await ParseAIResponseToCompletePage(context, aiResponse);
            updateButtonStateMachine(context, 're_record');
            context.dismissActivityIndicator();
        } catch (error) {
            Logger.error('Processing Recorded Text', error);
            context.dismissActivityIndicator();
            TelemetryLibrary.logSystemEvent(context,
                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AIJobComplete.global').getValue(),
                TelemetryLibrary.SYSTEM_TYPE_FAIL, error); 
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
                'Properties': {
                    'Message': context.localizeText('ai_processing_error'),
                },
            });          
        }
    }
}
/**
 * Checks if an object is empty
 * @param {Object} obj - The object to check
 * @returns {boolean} True if the object is empty, false otherwise
 */

function isEmpty(obj) {
    return !Object.keys(obj).length;
}
