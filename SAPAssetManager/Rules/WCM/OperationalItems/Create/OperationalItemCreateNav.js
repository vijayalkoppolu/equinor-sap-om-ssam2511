import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary, { IntegerDirectivePartial, MaxLengthDirectivePartial, RequiredDirectivePartial } from '../../../Common/Library/ValidationLibrary';
import { WCMCertificateMobileStatuses } from '../../SafetyCertificates/SafetyCertificatesLibrary';
import { ItemCategories } from '../libWCMDocumentItem';
import { OperationalItemCreateUpdateCodeBehind } from './OperationalItemEditNav';

/** only open the create page, if the certificate has 'change' mobile status
 * @param {IPageProxy & {binding: WCMDocumentHeader}} context  */
export default function OperationalItemCreateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/PMMobileStatus`, [], '')
        .then((/** @type {ObservableArray<PMMobileStatus>} */ status) => {
            const mobileStatus = !ValidationLibrary.evalIsEmpty(status) && status.getItem(0).MobileStatus;
            const opItem = {};
            if (mobileStatus === WCMCertificateMobileStatuses.Change) {
                context.setActionBinding({
                    pageCaption: context.localizeText('add_operational_item'),
                    showCancelButton: true,
                    showDiscardButton: false,
                    PlanningPlant: context.binding.PlanningPlant,
                    WCMDocument: context.binding.WCMDocument,
                    item: opItem,
                    codeBehind: new OperationalItemCreateUpdateCodeBehind(context, opItem),
                });
                return context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemCreateNav.action');
            }
            const errorMessage = context.localizeText(mobileStatus === WCMCertificateMobileStatuses.Prepared ?
                'cannot_add_operational_item_until_revoke_prepared' :
                'cannot_add_operational_item_since_certificate_beyond_prepared');
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                'Properties': {
                    'Title': context.localizeText('add_operational_item'),
                    'Message': errorMessage,
                    'OKCaption': context.localizeText('ok'),
                },
            });
        });
}

export class OperationalItemCreateCodeBehind {

    /** Validates the fields in the page,
     * then prepares a WCMDocumentItem from the control values (and the binding properties),
     * then creates the new WCMDocumentItem with links to the parent WCMDocumentHeader and to the technical object
     * @param {IPageProxy} context  */
    static async DoneButtonPressed(context) {
        const isValid = await ValidateFields(context).then(isValids => isValids.every(i => !!i));
        if (!isValid) {
            return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormValidationErrorBanner.action');
        }
        const isEdit = CommonLibrary.isEntityLocal(context.binding.item);
        const sectionedTable = GetSectionedTable(context);

        /** @type {WCMDocumentItem} */
        const opItem = {
            WCMDocument: context.binding.WCMDocument,
            Sequence: isEdit ? context.binding.item.Sequence : await GetLocalSequenceNumber(context, context.binding.WCMDocument),
            ...GetOpItemFromControls(sectionedTable),
        };

        if (ItemCategories.EquipmentCategory === opItem.ItemCategory) {
            opItem.Equipment = opItem.TechObject;
            opItem.FuncLoc = null;
            opItem.ShortText = await GetShortTextEquipment(context, opItem);
        } else if (ItemCategories.FlocCategory === opItem.ItemCategory) {
            opItem.Equipment = null;
            opItem.FuncLoc = opItem.TechObject;
            opItem.ShortText = await GetShortTextFloc(context, opItem);
        } else if (ItemCategories.WithoutMasterData === opItem.ItemCategory) {
            opItem.Equipment = null;
            opItem.FuncLoc = null;
            opItem.ShortText = '';  // nowhere to get description from
        }

        if ([ItemCategories.EquipmentCategory, ItemCategories.FlocCategory, ItemCategories.WithoutMasterData].includes(opItem.ItemCategory)) {
            await SetPrintFormat(context, context.binding.PlanningPlant, opItem);
        } else {  // comment category
            opItem.PrintFormatTag = null;
            opItem.PrintFormatUntag = null;
            opItem.Equipment = null;
            opItem.FuncLoc = null;
        }

        opItem.ItemCategoryCC = opItem.ItemCategory === ItemCategories.Comment ? '' : opItem.ItemCategory;  // Comment's categoryCC is ''
        opItem.ItemCategory = '';  // backend expects ItemCategory to be empty


        return (isEdit ? UpdateOperationalItem(context, opItem, context.binding.item) : CreateOperationalItem(context, opItem))
            .then(() => context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'))
            .then(() => context.executeAction({
                'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemCreateSuccessToast.action',
                'Properties': {
                    'Message': isEdit ? '$(L, item_successfully_updated)' : '$(L, item_successfully_created)',
                },
            }));

    }

    /** @param {IPageProxy} context  */
    static CancelPressed(context) {
        return context.executeAction(isPageUnchanged(context) ? '/SAPAssetManager/Actions/Page/CancelPage.action' : '/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    }

    static BackPressed(context) {
        return isPageUnchanged(context) ? true : context.executeAction({
            Name: '/SAPAssetManager/Actions/Page/ConfirmCancelPage.action',
            Properties: {
                OnOK: null,
            },
        }).then(result => result.data);
    }


    static OperationalItemDiscardPressed(context) {
        const readLink = context.binding.item['@odata.readLink'];
        const backToPage = context.evaluateTargetPath('#Page:-Previous').frame.backStack.reverse()
            .find(bsItem => bsItem.resolvedPage.context.binding['@odata.readLink'] !== context.binding.item['@odata.readLink']).resolvedPage.definition.name;
        return context.executeAction({
            Name: '/SAPAssetManager/Actions/Common/GenericDelete.action',
            Properties: {
                'Target': {
                    'EntitySet': 'WCMDocumentItems',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': readLink,
                },
            },
        })
            .then(() => context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'))
            .then(() => context.executeAction({
                Name: '/SAPAssetManager/Actions/Page/ClosePage.action',
                Properties: {
                    DismissModal: null,
                    CancelPendingActions: null,
                    NavigateBackToPage: backToPage,
                },
            }))
            .then(() => context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessageNoClosePage.action'));
    }

    /** @param {IControlProxy} context  */
    static ItemCategoryValues(context) {
        const allowedCategories = Object.values(ItemCategories);
        const terms = allowedCategories.map(c => `ItemCategory eq '${c}'`).join(' or ');
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMItemCategories', [], `$filter=${terms}`)
            .then(result => ValidationLibrary.evalIsEmpty(result) ? [] : Array.from(result, (/** @type {WCMItemCategory} */ x) => ({ DisplayValue: x.ItemCategoryText, ReturnValue: x.ItemCategory })));
    }

    /** @param {ISegmentedFormCellProxy} controlProxy  */
    static ItemCategoryControlOnChange(controlProxy) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        const itemCategory = controlProxy.getValue()[0].ReturnValue;

        let promise;
        if (itemCategory === ItemCategories.Comment) {
            promise = onCommentSelected(sectionedTable);
        } else if (itemCategory === ItemCategories.WithoutMasterData) {
            promise = onWithoutMasterDataSelected(sectionedTable);
        } else {  // Floc or Equipment
            promise = onFlocOrEquipmentSelected(sectionedTable, itemCategory);
        }
        return promise.then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }

    /** @param {IListPickerFormCellProxy} controlProxy  */
    static TechnicalObjectControlOnChange(controlProxy) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        /** @type {ISectionProxy} */
        const opGroupSection = sectionedTable.getSection('OperationalGroupFormCellSection');
        if (opGroupSection.getVisible()) {
            return setEditable(controlProxy, 'OperationalGroupControl', !ValidationLibrary.evalIsEmpty(controlProxy.getValue()))
                .then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
        }
        return Promise.resolve(opGroupSection.setVisible(true, true))
            .then(() => ResetControls(sectionedTable, ['OperationalGroupControl']))
            .then(() => setEditable(controlProxy, 'OperationalGroupControl', !ValidationLibrary.evalIsEmpty(controlProxy.getValue())))
            .then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }

    /** @param {ISegmentedFormCellProxy} controlProxy  */
    static OperationalGroupControlOnChange(controlProxy) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        /** @type {ISectionProxy} */
        const taggingCondSection = sectionedTable.getSection('TaggingConditionSection');
        if (taggingCondSection.getVisible()) {  // keep prev. form data
            return ResetControls(sectionedTable, ['TaggingConditionPicker', 'TaggingTypeControl', 'UntaggingConditionPicker', 'UntaggingTypeControl', 'TaggingSequenceNote', 'UntaggingSequenceNote', 'BlockingTypePicker', 'PhysicalBlockingRequiredSwitch'])
                .then(() => {
                    setConditionPickerItems(sectionedTable);
                });
        }
        return Promise.resolve(taggingCondSection.setVisible(true, true))
            .then(() => ResetControls(sectionedTable, ['TaggingConditionPicker', 'TaggingSequenceNote', 'TaggingCommentNote', 'TagRequiredSlider', 'LockNote']))
            .then(() => {
                setConditionPickerItems(sectionedTable);
            })
            .then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }

    static TagUntagConditionTypeValues(controlProxy) {
        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WCMSwitchingDatas', [], `$filter=PlanningPlant eq '${controlProxy.getPageProxy().binding.PlanningPlant}'`)
            .then(results => [...new Set(Array.from(results, (/** @type {WCMSwitchingData}*/ x) => [x.UntaggingType, x.TaggingType]).flat())])
            .then(results => results.map(x => ({ DisplayValue: x, ReturnValue: x })));
    }

    /** @param {IListPickerFormCellProxy} controlProxy  */
    static TaggingConditionPickerItems(controlProxy) {
        return OperationalItemCreateCodeBehind.GetWCMSwitchingDataTagUntagCondPickerItems(controlProxy, 'TaggingCond');
    }

    /** @param {IListPickerFormCellProxy} controlProxy  */
    static GetWCMSwitchingDataTagUntagCondPickerItems(controlProxy, propName) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        const binding = controlProxy.getPageProxy().getActionBinding() || controlProxy.getPageProxy().binding;  // edit scenario
        const opGroup = ValidationLibrary.evalIsEmpty(sectionedTable) ? binding?.item.OpGroup : GetControlValue(sectionedTable.getControl('OperationalGroupControl'));

        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WCMSwitchingDatas', [], `$filter=OpGroup eq '${opGroup}' and PlanningPlant eq '${binding.PlanningPlant}'`)
            .then(results => [...new Set(results.map((/** @type {WCMSwitchingData}*/ x) => x[propName]))])
            .then(taggingConditions => taggingConditions.map(tc => `OpCondition eq '${tc}'`).join(' or '))
            .then(filterTerm => controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WCMOpConditions', [], `$filter=${filterTerm}&$orderby=OpConditionText`))
            .then(results => [...new Map(results.map((/** @type {WCMOpCondition} */ x) => [x.OpCondition, { DisplayValue: x.OpConditionText, ReturnValue: x.OpCondition }])).values()]);
    }

    /** @param {IListPickerFormCellProxy} controlProxy  */
    static TaggingConditionPickerOnChange(controlProxy) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        const opGroup = GetControlValue(sectionedTable.getControl('OperationalGroupControl'));
        const untaggingCondSection = sectionedTable.getSection('UntaggingConditionSection');
        let promise = untaggingCondSection.getVisible() ? Promise.resolve() :  // keep prev. form data
            Promise.all(['UntaggingConditionSection', 'BlockingSection'].map(name => sectionedTable.getSection(name).setVisible(true, true)))
                .then(() => ResetControls(sectionedTable, ['UntaggingConditionPicker', 'UntaggingSequenceNote', 'UntaggingCommentNote', 'BlockingTypePicker', 'PhysicalBlockingRequiredSwitch']));

        if (ValidationLibrary.evalIsEmpty(controlProxy.getValue())) {
            promise = promise.then(() => ResetControls(sectionedTable, ['TagRequiredSlider', 'TaggingTypeControl', 'UntaggingTypeControl']));
        } else {
            promise = promise
                .then(() => controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WCMSwitchingDatas', [], `$filter=TaggingCond eq '${GetControlValue(controlProxy)}' and OpGroup eq '${opGroup}' and PlanningPlant eq '${controlProxy.getPageProxy().binding.PlanningPlant}'`))
                .then(result => {
                    /** @type {WCMSwitchingData} */
                    const switchingData = result.getItem(0);
                    const [ttype, uttype, tagRequired] = ['TaggingTypeControl', 'UntaggingTypeControl', 'TagRequiredSlider'].map(controlName => sectionedTable.getControl(controlName));
                    [ttype, uttype].forEach((/** @type {IControlProxy} */ i) => i.setVisible(true));
                    return Promise.all([
                        sectionedTable.getControl('UntaggingConditionPicker').setValue(switchingData.UntagCond),
                        ttype.setValue(switchingData.TaggingType),
                        uttype.setValue(switchingData.UntaggingType),
                        tagRequired.setValue(switchingData.TagRequired === 'X'),
                    ]);
                });
        }

        return promise.then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }

    /** @param {ISimplePropertyFormCellProxy | INoteFormCellProxy} controlProxy  */
    static ValidateControlOnChange(controlProxy) {
        return runValidatorsForControl(controlProxy, GetValidatorsForControl(controlProxy));
    }

    static WOMasterDataTechnicalObjectNameControlChange(controlProxy) {
        return setEditable(controlProxy, 'OperationalGroupControl')
            .then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }
}

/** @param {IPageProxy} context  */
function isPageUnchanged(context) {
    const sectionedTable = GetSectionedTable(context);
    const controlsOpItem = GetOpItemFromControls(sectionedTable);
    const prop2ControlName = GetProp2ControlName(GetControlValue(sectionedTable.getControl('ItemCategoryControl')));
    const opItem = CommonLibrary.ObjectFromEntries(prepareValues(Object.entries(context.binding.item).filter(([key]) => key in prop2ControlName)));
    const isUnchanged = Object.entries(controlsOpItem).every(([k, v]) => opItem[k] === v);
    return isUnchanged;
}

function setEditable(context, controlName, editable = true) {
    return Promise.resolve(GetSectionedTable(context.getPageProxy()).getControl(controlName).setEditable(editable));
}

const CommentCategoryControls = Object.freeze(['CommentDescriptionControl', 'CommentTaggingSequenceNote', 'CommentUntaggingSequenceNote']);

function onCommentSelected(/** @type {ISectionedTableProxy} */ sectionedTable) {
    const itemCategoryControlName = 'ItemCategoryControl';
    const allowedControls = new Set([itemCategoryControlName, ...CommentCategoryControls]);
    return ResetControls(sectionedTable, sectionedTable.getControls().filter(c => c.visible).map(c => c.getName()).filter(name => !allowedControls.has(name)), false)
        .then(() => ResetControls(sectionedTable, CommentCategoryControls))
        .then(() => sectionedTable.getSections().filter(s => s.getVisible() && s.getName() !== 'FormCellSection').forEach(s => s.setVisible(false, true)));
}

function onFlocOrEquipmentSelected(sectionedTable, itemCategory) {
    /** @type {IListPickerFormCellProxy} */
    const techObjectControl = sectionedTable.getControl('TechnicalObjectControl');
    let promise = ResetControls(sectionedTable, [...CommentCategoryControls, ...WOMasterDataCategoryControls], false)
        .then(() => ResetControls(sectionedTable, ['TechnicalObjectControl']));
    if (!sectionedTable.getControl('SwitchingLocationControl').visible) {  // this is the very first pick
        promise = promise.then(() => ResetControls(sectionedTable, ['SwitchingLocationControl', 'PhysicalLocationControl']));
    }
    return promise.then(() => {
        const planningPlant = sectionedTable.getPageProxy().binding.PlanningPlant;
        const [entitySet, displayValue, returnValue, queryOptions] = getTechnicalObjectPickerItems(planningPlant, itemCategory);
        const targetSpec = TechnicalObjectTargetSpecifier(techObjectControl.getTargetSpecifier(), entitySet, displayValue, returnValue, queryOptions);
        techObjectControl.setTargetSpecifier(targetSpec, true);
    });
}

const WOMasterDataCategoryControls = Object.freeze(['WOMasterDataTechnicalObjectNameControl']);

export function getTechnicalObjectPickerItems(planningPlant, itemCategory) {
    return {
        [ItemCategories.EquipmentCategory]: ['MyEquipments', '{EquipDesc} ({EquipId})', '{EquipId}', `$filter=PlanningPlant eq '${planningPlant}'&$orderby=EquipDesc`],
        [ItemCategories.FlocCategory]: ['MyFunctionalLocations', '{FuncLocDesc} ({FuncLocId})', '{FuncLocIdIntern}', `$filter=PlanningPlant eq '${planningPlant}'&$orderby=FuncLocDesc`],
    }[itemCategory];
}

function onWithoutMasterDataSelected(sectionedTable) {
    /** @type {ISectionProxy} */
    const opGroupSection = sectionedTable.getSection('OperationalGroupFormCellSection');
    const opGrp = opGroupSection.getVisible() ? null : Promise.resolve(opGroupSection.setVisible(true, true)).then(() => ResetControls(sectionedTable, ['OperationalGroupControl']));
    let promise = Promise.all([
        opGrp,
        ResetControls(sectionedTable, [...CommentCategoryControls, 'TechnicalObjectControl'], false),
        ResetControls(sectionedTable, WOMasterDataCategoryControls),
    ]);
    if (!sectionedTable.getControl('SwitchingLocationControl').visible) {  // this is the very first pick
        return promise.then(() => ResetControls(sectionedTable, ['SwitchingLocationControl', 'PhysicalLocationControl'])).then(() => sectionedTable.getControl('OperationalGroupControl').setEditable(false));
    }
    return promise;
}

function GetOpItemFromControls(sectionedTable) {
    const propName2value = Object.entries(GetProp2ControlName(GetControlValue(sectionedTable.getControl('ItemCategoryControl'))))
        .map(([propName, controlName]) => ([propName, sectionedTable.getControl(controlName)]))
        .filter(([, control]) => control.visible || control.isVisible?.())
        .map(([propName, control]) => ([propName, GetControlValue(control)]));
    return CommonLibrary.ObjectFromEntries(prepareValues(propName2value));
}

/** @return {WCMDocumentItem} */
function GetProp2ControlName(itemCategory) {
    return {
        ItemCategory: 'ItemCategoryControl',
        TechObject: itemCategory === ItemCategories.WithoutMasterData ? 'WOMasterDataTechnicalObjectNameControl' : 'TechnicalObjectControl',
        SwitchingLoc: 'SwitchingLocationControl',
        Location: 'PhysicalLocationControl',
        OpGroup: 'OperationalGroupControl',
        TaggingCond: 'TaggingConditionPicker',
        TaggingType: 'TaggingTypeControl',
        TagSequence: itemCategory === ItemCategories.Comment ? 'CommentTaggingSequenceNote' : 'TaggingSequenceNote',
        TaggingComment: 'TaggingCommentNote',
        TagRequired: 'TagRequiredSlider',
        LockNumber: 'LockNote',
        UntagCond: 'UntaggingConditionPicker',
        UntaggingType: 'UntaggingTypeControl',
        UntSequence: itemCategory === ItemCategories.Comment ? 'CommentUntaggingSequenceNote' : 'UntaggingSequenceNote',
        UntagComment: 'UntaggingCommentNote',
        BlockingType: 'BlockingTypePicker',
        PhysBlocking: 'PhysicalBlockingRequiredSwitch',
        ShortText: 'CommentDescriptionControl',
    };
}

/** converts true values to X, falses to '', then removes every falsy or empty valued tuple
 * @param {Array<[string, string | number | boolean]>} propName2value  */
function prepareValues(propName2value) {
    return propName2value
        .map(([propName, value]) => ([propName, convertBool(value)]))
        .filter(([, controlValue]) => !ValidationLibrary.evalIsEmpty(controlValue));
}

/** @param {string | number | boolean} value could be anything, this'll convert trues to 'X' and falses to '' */
function convertBool(value) {
    if (value === true) {
        return 'X';
    } else if (value === false) {
        return '';
    }
    return value;
}

export function convertToBool(value) {
    return value === 'X' || value === true;
}

/** @param {IClientAPI} context  */
function GetLocalSequenceNumber(context, WCMDocumentId) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `WCMDocumentHeaders('${WCMDocumentId}')/WCMDocumentItems`, [], '$orderby=Sequence desc')
        .then(result => ValidationLibrary.evalIsEmpty(result) ? 10 : Number(result.getItem(0).Sequence) + 10)  // sequences are incremented by 10
        .then(lastSequence => lastSequence.toString().padStart(6, '0'));  // sequences are 0 padded to be of length 6
}

/** @param {IListPickerFormCellTargetProxy} context  */
function TechnicalObjectTargetSpecifier(context, entitySet, displayValue, returnValue, queryOptions) {
    context.setEntitySet(entitySet);
    context.setDisplayValue(displayValue);
    context.setReturnValue(returnValue);
    context.setQueryOptions(queryOptions);
    context.setService('/SAPAssetManager/Services/AssetManager.service');
    return context;
}

/** @param {WCMDocumentItem} opItem */
function SetPrintFormat(context, planningPlant, opItem) {
    const tag2PrintFormat = {
        PrintCategoryTag: '4',
        PrintCategoryUntag: '5',
    };
    if (opItem.TagRequired) {
        return Promise.all(
            [tag2PrintFormat.PrintCategoryTag, tag2PrintFormat.PrintCategoryUntag]
                .map(printCategory => context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMPrintFormatTags', [], `$filter=PrintCategory eq '${printCategory}' and PlanningPlant eq '${planningPlant}'`)
                    .then((/** @type {WCMPrintFormatTag} */ res) => res.getItem(0).PrintFormat)),
        ).then(([printFormatTag, printFormatUntag]) => {
            opItem.PrintFormatTag = printFormatTag;
            opItem.PrintFormatUntag = printFormatUntag;
        });
    }
    return Promise.resolve();
}

/**
 * @param {IClientAPI} context
 * @param {WCMDocumentItem} opItem
 */
function GetShortTextEquipment(context, opItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${opItem.Equipment}')`, ['EquipDesc'], '').then(res => res.getItem(0).EquipDesc);
}

/**
 * @param {IClientAPI} context
 * @param {WCMDocumentItem} opItem
 */
function GetShortTextFloc(context, opItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${opItem.FuncLoc}')`, ['FuncLocDesc'], '').then(res => res.getItem(0).FuncLocDesc);
}

function GetReadLinkObj(property, entitySet, readLink) {
    return {
        'Property': property,
        'Target':
        {
            'EntitySet': entitySet,
            'ReadLink': readLink,
        },
    };
}

/**
 * @param {WCMDocumentItem} opItem
 */
function GetOdataLinks(opItem) {
    const createLinks = [GetReadLinkObj('WCMDocumentHeaders', 'WCMDocumentHeaders', `WCMDocumentHeaders('${opItem.WCMDocument}')`)];
    if (opItem.ItemCategoryCC !== '') { // is not comment category
        createLinks.push(GetReadLinkObj('WCMOpGroup_Nav', 'WCMOpGroups', `WCMOpGroups('${opItem.OpGroup}')`));
    }
    if (opItem.Equipment) {
        createLinks.push(GetReadLinkObj('MyEquipments', 'MyEquipments', `MyEquipments('${opItem.Equipment}')`));
    }
    if (opItem.FuncLoc) {
        createLinks.push(GetReadLinkObj('MyFunctionalLocations', 'MyFunctionalLocations', `MyFunctionalLocations('${opItem.FuncLoc}')`));
    }
    return createLinks;
}

function GetDeleteUpdateLinks(opItem, oldOpItem) {
    const [newLinks, oldLinks] = [opItem, oldOpItem].map(o => new Map(GetOdataLinks(o).map(l => [l.Property, l])));
    const navProps = [...new Set([...newLinks.keys(), ...oldLinks.keys()])];
    return navProps.map(p => ([newLinks.get(p), oldLinks.get(p)])).reduce(([del, upd, crt], [newlink, oldlink]) => {
        if (newlink && !oldlink) {
            crt.push(newlink);
        } else if (oldlink && !newlink) {
            del.push(oldlink);
        } else if (oldlink.Target.ReadLink !== newlink.Target.ReadLink) {
            upd.push(newlink);
        }
        return [del, upd, crt];
    }, [[], [], []]);
}

/**
 * @param {IClientAPI} context
 * @param {WCMDocumentItem} opItem
 */
function CreateOperationalItem(context, opItem) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'Target': {
                'EntitySet': 'WCMDocumentItems',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Properties': {
                ...opItem,
            },
            'RequestOptions': {
                'TransactionID': opItem.WCMDocument,
                'RemoveCreatedEntityAfterUpload': true,
            },
            'CreateLinks': GetOdataLinks(opItem),
        },
    });
}


function UpdateOperationalItem(context, opItem, oldOpItem) {
    const [deleteLinks, updateLinks, createLinks] = GetDeleteUpdateLinks(opItem, oldOpItem);
    Object.keys(GetProp2ControlName('')).forEach(k => {
        if (oldOpItem[k] && !opItem[k]) {  // explicit clearing of properties
            opItem[k] = '';
        }
    });
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        'Properties': {
            'Target': {
                'EntitySet': 'WCMDocumentItems',
                'ReadLink': oldOpItem['@odata.readLink'],
            },
            'Properties': {
                ...opItem,
            },
            'CreateLinks': createLinks,
            'UpdateLinks': updateLinks,
            'DeleteLinks': deleteLinks,
        },
    });
}

function setConditionPickerItems(sectionedTable) {
    return Promise.all([
        SetTaggingConditionPickerItems(sectionedTable),
        SetUntaggingConditionPickerItems(sectionedTable),
        SetTaggingUnTaggingTypePickerItems(sectionedTable, 'TaggingTypeControl'),
        SetTaggingUnTaggingTypePickerItems(sectionedTable, 'UntaggingTypeControl'),
    ]);
}

async function SetTaggingConditionPickerItems(sectionedTable) {
    /** @type {IListPickerFormCellProxy} */
    const taggingCondpicker = sectionedTable.getControl('TaggingConditionPicker');
    return taggingCondpicker.setPickerItems(await OperationalItemCreateCodeBehind.TaggingConditionPickerItems(taggingCondpicker));
}

async function SetTaggingUnTaggingTypePickerItems(sectionedTable, controlName) {
    /** @type {IListPickerFormCellProxy} */
    const taggingTypeControl = sectionedTable.getControl(controlName);
    return taggingTypeControl.setPickerItems(await OperationalItemCreateCodeBehind.TagUntagConditionTypeValues(taggingTypeControl));
}

async function SetUntaggingConditionPickerItems(sectionedTable) {
    /** @type {IListPickerFormCellProxy} */
    const untaggingCondpicker = sectionedTable.getControl('UntaggingConditionPicker');
    return untaggingCondpicker.setPickerItems(await OperationalItemCreateCodeBehind.GetWCMSwitchingDataTagUntagCondPickerItems(untaggingCondpicker, 'UntagCond'));
}

/**
 * @param {IListPickerFormCellProxy | IFormCellProxy} control
 * @returns {null | undefined | string} */
function GetControlValue(control) {
    const cType = control.getType();
    if (['Control.Type.FormCell.SegmentedControl', 'Control.Type.FormCell.ListPicker'].includes(cType)) {
        const value = control.getValue();
        return ValidationLibrary.evalIsEmpty(value) ? undefined : value[0].ReturnValue;
    }
    return control.getValue();
}

/**
 * @param {IControlProxy} controlProxy */
function GetValidatorsForControl(controlProxy) {
    return fieldName2Validators[controlProxy.getName()]?.(controlProxy) || [];
}

/**
 * @param {IPageProxy} context */
function GetValidators(context) {
    const sectionedTable = GetSectionedTable(context.getPageProxy());
    const validators = {};
    Object.entries(fieldName2Validators).forEach(([controlName, factory]) => {
        validators[controlName] = factory(sectionedTable.getControl(controlName));
    });
    return validators;
}

const fieldName2Validators = Object.freeze({
    SwitchingLocationControl: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 40)]),
    PhysicalLocationControl: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 40)]),
    WOMasterDataTechnicalObjectNameControl: (controlProxy) => ([
        MaxLengthDirectivePartial(controlProxy, 40),
        RequiredDirectivePartial(controlProxy, (objNameCtrl) => IsSelectedItemCategoryEqualTo(objNameCtrl, ItemCategories.WithoutMasterData)),
    ]),
    CommentDescriptionControl: (controlProxy) => ([
        MaxLengthDirectivePartial(controlProxy, 40),
        RequiredDirectivePartial(controlProxy, (commentDescr) => IsSelectedItemCategoryEqualTo(commentDescr, ItemCategories.Comment)),
    ]),
    TaggingSequenceNote: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 5), IntegerDirectivePartial(controlProxy)]),
    CommentTaggingSequenceNote: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 5), IntegerDirectivePartial(controlProxy)]),
    TaggingCommentNote: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 40)]),
    LockNote: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 5)]),
    UntaggingSequenceNote: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 5), IntegerDirectivePartial(controlProxy)]),
    CommentUntaggingSequenceNote: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 5), IntegerDirectivePartial(controlProxy)]),
    UntaggingCommentNote: (controlProxy) => ([MaxLengthDirectivePartial(controlProxy, 40)]),
    ItemCategoryControl: (controlProxy) => ([RequiredDirectivePartial(controlProxy)]),
    TechnicalObjectControl: (controlProxy) => ([RequiredDirectivePartial(controlProxy, (techObjectControl) => IsSelectedItemCategoryEqualTo(techObjectControl, ItemCategories.FlocCategory, ItemCategories.EquipmentCategory))]),
    OperationalGroupControl: (controlProxy) => ([RequiredDirectivePartial(controlProxy, (opgrp) => IsSelectedItemCategoryEqualTo(opgrp, ItemCategories.FlocCategory, ItemCategories.EquipmentCategory, ItemCategories.WithoutMasterData))]),
    TaggingConditionPicker: (controlProxy) => ([RequiredDirectivePartial(controlProxy, (tcpicker) => IsSelectedItemCategoryEqualTo(tcpicker, ItemCategories.FlocCategory, ItemCategories.EquipmentCategory, ItemCategories.WithoutMasterData))]),
});

function IsSelectedItemCategoryEqualTo(controlProxy, ...categoryValues) {
    return categoryValues.includes(GetControlValue(GetSectionedTable(controlProxy.getPageProxy()).getControl('ItemCategoryControl')));
}

/** @param {IPageProxy} context */
function ValidateFields(context) {
    const sectionedTable = GetSectionedTable(context.getPageProxy());
    const validators = GetValidators(context);
    return Promise.all(Object.entries(validators).map(([controlName, directives]) => runValidatorsForControl(sectionedTable.getControl(controlName), directives)));
}

/** @param {DirectiveBase[]} directives  */
function runValidatorsForControl(control, directives) {
    return directives.reduce((promiseChain, currentValidator) => promiseChain.then(isValid => isValid ? currentValidator.applyError() : false), Promise.resolve(true))
        .then(isValid => {
            if (isValid) {
                CommonLibrary.clearValidationOnInput(control);
            }
            return isValid;
        });
}

/** @return {ISectionedTableProxy} */
function GetSectionedTable(pageProxy) {
    return pageProxy.getControl('FormCellContainer');
}

/** @param {ISectionedTableProxy} sectionedTable  */
function ResetControls(sectionedTable, controlNames, visible = true) {
    const controlEmptyValues = {
        'Control.Type.FormCell.SegmentedControl': '',
        'Control.Type.FormCell.ListPicker': '',
        'Control.Type.FormCell.SimpleProperty': '',
        'Control.Type.FormCell.Note': '',
        'Control.Type.FormCell.Switch': false,
    };
    return Promise.all(
        controlNames
            .map(n => sectionedTable.getControl(n))
            .map((/** @type {IControlProxy} */ control) => Promise.all([control.setVisible(visible, true), control.setValue(controlEmptyValues[control.getType()], visible)])),  // note: the onchange will be invoked if setting the control to visible
    );
}
