import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ItemCategories } from '../libWCMDocumentItem';
import { convertToBool, getTechnicalObjectPickerItems } from './OperationalItemCreateNav';

/** @param {{getPageProxy(): IPageProxy & {binding: WCMDocumentItem}} & IClientAPI} context  */
export default async function OperationalItemEditNav(context, showCancelButton = true, showDiscardButton = true) {
    if (!CommonLibrary.isEntityLocal(context.getPageProxy().binding)) {
        return Promise.resolve();
    }
    const opItem = await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}`, [], '$expand=WCMDocumentHeaders,WCMOpGroup_Nav,MyFunctionalLocations,MyEquipments')
        .then(results => results.getItem(0));
    opItem.ItemCategoryCC = opItem.ItemCategoryCC || ItemCategories.Comment;
    opItem.ItemCategory = opItem.ItemCategoryCC;
    context.setActionBinding({
        pageCaption: context.localizeText('edit_operational_item'),
        showCancelButton: showCancelButton,
        showDiscardButton: showDiscardButton,
        PlanningPlant: opItem.WCMDocumentHeaders.PlanningPlant,
        WCMDocument: opItem.WCMDocument,
        item: opItem,
        codeBehind: new OperationalItemCreateUpdateCodeBehind(context, opItem),
    });
    return context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemCreateNav.action');
}

export class OperationalItemCreateUpdateCodeBehind {
    constructor(context, opItem) {
        this.context = context;
        const itemCategory = opItem?.ItemCategoryCC;
        this.convertToBool = new Proxy(opItem || {}, {
            get(target, prop) {
                return convertToBool(target[prop]);
            },
        });
        this.isPropFilled = new Proxy(opItem || {}, {
            get(target, prop) {
                return prop.split('|').some(propName => (target[propName] ?? '') !== '');
            },
        });
        this.isPropFilledCommentType = new Proxy(this.isPropFilled, {
            get(target, prop) {
                return (itemCategory === ItemCategories.Comment) && target[prop];
            },
        });
        this.isPropFilledNotCommentType = new Proxy(this.isPropFilled, {
            get(target, prop) {
                return [ItemCategories.FlocCategory, ItemCategories.EquipmentCategory, ItemCategories.WithoutMasterData].includes(itemCategory) && target[prop];
            },
        });
        this.isPropFilledWOMasterDataType = new Proxy(this.isPropFilled, {
            get(target, prop) {
                return (itemCategory === ItemCategories.WithoutMasterData) && target[prop];
            },
        });
        this.isPropFilledFlocOrEquipmentType = new Proxy(this.isPropFilled, {
            get(target, prop) {
                return [ItemCategories.FlocCategory, ItemCategories.EquipmentCategory].includes(itemCategory) && target[prop];
            },
        });
        const [entitySet, displayValue, returnValue, queryOptions] = [ItemCategories.FlocCategory, ItemCategories.EquipmentCategory].includes(itemCategory) ? getTechnicalObjectPickerItems(opItem?.WCMDocumentHeaders?.PlanningPlant, itemCategory) : ['MyEquipments', '', '', '$filter=false'];  // dummy entityset and query to work around listpicker crashing the page
        this.TechnicalObjectControlPickerItems = {
            'DisplayValue': displayValue,
            'ReturnValue': returnValue,
            'EntitySet': entitySet,
            'QueryOptions': queryOptions,
        };
    }
}

function getEditPageBinding(context) {
    const currentPage = context.evaluateTargetPathForAPI('#Page:-Current');
    const actionBinding = currentPage.getActionBinding();
    const binding = currentPage.binding;
    return binding?.codeBehind?.TechnicalObjectControlPickerItems ? binding : actionBinding;
}

export function TechnicalObjectControlDisplayValue(context) {
    return getEditPageBinding(context)?.codeBehind.TechnicalObjectControlPickerItems.DisplayValue;
}

export function TechnicalObjectControlReturnValue(context) {
    return getEditPageBinding(context)?.codeBehind.TechnicalObjectControlPickerItems.ReturnValue;
}
