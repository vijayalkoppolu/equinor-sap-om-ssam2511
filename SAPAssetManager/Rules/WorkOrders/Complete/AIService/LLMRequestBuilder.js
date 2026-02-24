import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import Logger from '../../../Log/Logger';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';
import NotificationItemPartGroupPickerItems from '../../../Notifications/Item/CreateUpdate/NotificationItemPartGroupPickerItems';
import NotificationItemDamageGroupQuery from '../../../Notifications/Item/NotificationItemDamageGroupQuery';
import NotificationItemPartCodeQuery from '../../../Notifications/Item/NotificationItemPartCodeQuery';
import NotificationItemPartGroupQuery from '../../../Notifications/Item/NotificationItemPartGroupQuery';
import NotificationItemDamageCodeQuery from '../../../Notifications/Item/NotificationItemDamageCodeQuery';
import NotificationItemCauseCodeQuery from '../../../Notifications/Item/Cause/CreateUpdate/NotificationItemCauseCodeQuery';
import NotificationItemCauseGroupQuery from '../../../Notifications/Item/Cause/NotificationItemCauseGroupQuery';
import self from './LLMRequestBuilder';
/**
Objects have limitations on nesting depth and size
A schema may have up to 100 object properties total, with up to 5 levels of nesting.

In a schema, total string length of all property names, definition names, enum values, and const values cannot exceed 15,000 characters.

A schema may have up to 500 enum values across all enum properties.

For a single enum property with string values, the total string length of all enum values cannot exceed 7,500 characters when there are more than 250 enum values.
*/
export default class {
    static async getNotificationItemPartGroupEnum(context) {
        const partGroups = await NotificationItemPartGroupPickerItems (context, 'CatTypeObjectParts', NotificationItemPartGroupQuery);
        const parts = await self.NotificationItemPartDamageCausePickerItems (context, 'PMCatalogCodes', NotificationItemPartCodeQuery, partGroups);
        return parts.map(group => ({
            'properties': {
                'partGroup': { 
                    'enum': [group.Group],
                },
                'part': { 
                    'enum': group.Codes.map(code => code.DisplayValue),
                },
            },
        }));
    }

    static async getNotificationItemDamageGroupEnum(context) {
        const damageGroups = await NotificationItemPartGroupPickerItems (context, 'CatTypeDefects', NotificationItemDamageGroupQuery);
        const damages = await self.NotificationItemPartDamageCausePickerItems (context, 'PMCatalogCodes', NotificationItemDamageCodeQuery, damageGroups);
        return damages.map(damage => ({
            'properties': {
                'damageGroup': { 
                    'enum': [damage.Group],
                },
                'damage': { 
                    'enum': damage.Codes.map(code => code.DisplayValue),
                },
            },
        }));
    }

    static async getNotificationItemCauseGroupEnum(context) {
        const causeGroups = await NotificationItemPartGroupPickerItems(context, 'CatTypeCauses', NotificationItemCauseGroupQuery);
        const causes = await self.NotificationItemPartDamageCausePickerItems(context, 'PMCatalogCodes', NotificationItemCauseCodeQuery, causeGroups);
        return causes.map(cause => ({
            'properties': {
                'causeGroup': { 
                    'enum': [cause.Group], 
                },
                'cause': { 
                    'enum': cause.Codes.map(code => code.DisplayValue),
                },
            },
        }));
    }
    static async NotificationItemPartDamageCausePickerItems(controlProxy, entitySet, queryOptionsRule, groups) {
        let resultJson = [];
        let pageProxy = controlProxy.getPageProxy();
        try {
            WorkOrderCompletionLibrary.getInstance().setBinding(pageProxy, pageProxy.binding);
            pageProxy._context.binding = WorkOrderCompletionLibrary.getStepData(pageProxy, 'notification');
        
            let queryOptions = await queryOptionsRule(pageProxy);
        
            for (const group of groups) {
                // Ensure queryOptions follows the "else" format before modifying
                const catalogMatch = queryOptions.match(/\$filter=Catalog eq '([^']+)'/);
                if (catalogMatch) {
                    let catalog = catalogMatch[1];
                    queryOptions = `$filter=Catalog eq '${catalog}' and CodeGroup eq '${group.ReturnValue}'&$orderby=Code,CodeGroup,Catalog`;
                }
                
                const displayValue = 'CodeDescription';
                const returnValue = 'Code';
                
                const catalogs = await pageProxy.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions);
                
                if (!ValidationLibrary.evalIsEmpty(catalogs)) {
                    let groupObject = {
                        Group: group.DisplayValue,
                        Codes: catalogs._array.map(item => ({
                            DisplayValue: `${item[returnValue]} - ${item[displayValue]}` || '-',
                        })),
                    };
                    
                    resultJson.push(groupObject);
                }
            }
        } catch (error) {
            Logger.error('NotificationItemPartDamageCausePickerItems', error);
            pageProxy._context.binding = WorkOrderCompletionLibrary.getInstance().getBinding(controlProxy);
            throw new Error(error);
        }
        pageProxy._context.binding = WorkOrderCompletionLibrary.getInstance().getBinding(controlProxy);
        return resultJson;
    }
}

