import Logger from '../../../Log/Logger';
import LLMRequestBuilder from './LLMRequestBuilder';

export default class {
    
    static async getNotificationItemSchema(context) {
        try {
            return {
                'notificationItem': {
                    'type': 'object',
                    'properties': {
                        'partAndGroup': await (async () => {
                            try {
                                return {
                                    'type': 'object',
                                    'description': 'Select the affected part and its classification.',
                                    'oneOf': await LLMRequestBuilder.getNotificationItemPartGroupEnum(context),
                                };
                            } catch (error) {
                                Logger.error('Error fetching partAndGroup:', error);
                                return { 'type': 'object', 'description': 'Part information could not be retrieved.' };
                            }
                        })(),
                        'damageAndGroup': await (async () => {
                            try {
                                return {
                                    'type': 'object',
                                    'description': 'Select the damage type and its category.',
                                    'oneOf': await LLMRequestBuilder.getNotificationItemDamageGroupEnum(context),
                                };
                            } catch (error) {
                                Logger.error('Error fetching damageAndGroup:', error);
                                return { 'type': 'object', 'description': 'Damage information could not be retrieved.' };
                            }
                        })(),
                        'causeAndGroup': await (async () => {
                            try {
                                return {
                                    'type': 'object',
                                    'description': 'Select the cause group and specific cause.',
                                    'oneOf': await LLMRequestBuilder.getNotificationItemCauseGroupEnum(context),
                                };
                            } catch (error) {
                                Logger.error('Error fetching causeAndGroup:', error);
                                return { 'type': 'object', 'description': 'Cause information could not be retrieved.' };
                            }
                        })(),
                    },
                    'required': ['actionType', 'itemShortText', 'partAndGroup', 'damageAndGroup'], 
                },
            };
            
        } catch (error) {
            Logger.error('Error in getNotificationItemSchema: ', error);
            return {};
        }
    }
}
