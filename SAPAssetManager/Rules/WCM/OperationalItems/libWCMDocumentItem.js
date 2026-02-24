import CommonLibrary from '../../Common/Library/CommonLibrary';
import ProgressTrackerOnDataChanged from '../../TimelineControl/ProgressTrackerOnDataChanged';
import Caption from './Details/Caption';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import { WCMCertificateMobileStatuses } from '../SafetyCertificates/SafetyCertificatesLibrary';


export const OperationalCycleSpec = Object.freeze({
    TaggingCycleWithTemporaryUntaggingPhase: '',
    TestCycle: '1',
    TaggingCycleWithoutTemporaryUntaggingPhase: '2',
    NoItems: 'X',
});

export const OpItemMobileStatusCodes = Object.freeze({
    Tag: 'TAG',  // BTG
    TagPrinted: 'TAGPRINT',  // PTAG
    InitialTaggingStatus: 'INITIALTAG',  // ITG
    Untag: 'UNTAG',  // BUG
    Tagged: 'TAGGED',  // ETG
    UnTagged: 'UNTAGGED', // EUG
    UntagTemporarily: 'UNTAGT', //BTUG
    TestTagPrinted: 'TAGPRINTT', //PTST
    TemporaryUntagged: 'UNTAGGEDT', //ETUG
});

export const ItemCategories = Object.freeze({
    EquipmentCategory: 'E',
    FlocCategory: 'F',
    WithoutMasterData: 'N',
    Comment: 'C',
});

export const TagStates = Object.freeze({
    None: 1,
    SetTagged: 2,
    SetUntagged: 3,
});

const StatusesForUntaggingCondition = Object.freeze([OpItemMobileStatusCodes.Tagged, OpItemMobileStatusCodes.UntagTemporarily, OpItemMobileStatusCodes.TestTagPrinted, OpItemMobileStatusCodes.Untag]);

function ExpandOperationalItem(context, wcmDocumentItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', wcmDocumentItem['@odata.readLink'], [], '$expand=WCMDocumentHeaders($expand=WCMDocumentUsages,PMMobileStatus),PMMobileStatus($expand=PMMobileStatusHistory_Nav)').then(value => value.getItem(0));
}

/** @param {WCMDocumentItem} wcmDocumentItem  */
function HasRelatedCertificateChangeStatus(wcmDocumentItem) {
    return wcmDocumentItem.WCMDocumentHeaders.PMMobileStatus.MobileStatus === WCMCertificateMobileStatuses.Change;
}

function IsTaggingUntaggingNotAllowed(wcmDocumentItem) {
    return ![OperationalCycleSpec.TaggingCycleWithoutTemporaryUntaggingPhase, OperationalCycleSpec.TaggingCycleWithTemporaryUntaggingPhase].includes(wcmDocumentItem.WCMDocumentHeaders.WCMDocumentUsages.Specification) || HasRelatedCertificateChangeStatus(wcmDocumentItem);
}

function IsPrintTagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.PrintTag === 'X';
}

function IsPrintTagInHistory(operationalItem) {
    return operationalItem.PMMobileStatus.PMMobileStatusHistory_Nav?.some(h => h.MobileStatus === OpItemMobileStatusCodes.TagPrinted);
}

function IsTagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.Tag === 'X';
}

function IsTaggingCycleWithTemporaryUntaggingPhase(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.Specification === OperationalCycleSpec.TaggingCycleWithTemporaryUntaggingPhase;
}

function IsTaggingCycleWithoutTemporaryUntaggingPhase(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.Specification === OperationalCycleSpec.TaggingCycleWithoutTemporaryUntaggingPhase;
}

export async function IsTaggingActive(context, wcmDocumentItem) {
    const operationalItem = await ExpandOperationalItem(context, wcmDocumentItem || context.binding);

    if (IsTaggingUntaggingNotAllowed(operationalItem)) {
        return false;
    }

    const isDownlineSeqChecked = CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue());

    if (await isDownlineSeqChecked) {
        const [printTagChecked, printTagInHistory, tagChecked] = [
            IsPrintTagChecked(operationalItem),
            IsPrintTagInHistory(operationalItem),
            IsTagChecked(operationalItem),
        ];

        switch (operationalItem.PMMobileStatus?.MobileStatus) {
            case OpItemMobileStatusCodes.TagPrinted:
                // cover both specifications TaggingCycleWithTemporaryUntaggingPhase and TaggingCycleWithoutTemporaryUntaggingPhase
                return !printTagChecked;
            case OpItemMobileStatusCodes.InitialTaggingStatus:
                // cover both specifications TaggingCycleWithTemporaryUntaggingPhase and TaggingCycleWithoutTemporaryUntaggingPhase
                return tagChecked && printTagChecked;
            case OpItemMobileStatusCodes.Tag:
                // cover both specifications TaggingCycleWithTemporaryUntaggingPhase and TaggingCycleWithoutTemporaryUntaggingPhase
                return !tagChecked && (printTagChecked || printTagInHistory);
            case OpItemMobileStatusCodes.TemporaryUntagged:
                return IsTaggingCycleWithTemporaryUntaggingPhase(operationalItem)
                    && tagChecked
                    && (printTagChecked || printTagInHistory);
            default:
                return false;
        }
    }

    return false;
}

function IsUntagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.Untag === 'X';
}

function IsAllRelatedWorkPermitClosed(context, operationalItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${operationalItem['@odata.readLink']}/WCMDocumentHeaders/WCMApplicationDocuments`, [], '$expand=WCMApplications')
        .then(wcmApplicationDocuments => Array.from(wcmApplicationDocuments, wcmApplicationDocument => wcmApplicationDocument.WCMApplications))
        .then(wcmApplications => {
            const closedStatus = context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Closed.global').getValue();
            return wcmApplications.every(wcmApplication => wcmApplication.ActualSystemStatus === closedStatus);
        });
}

export async function IsUntaggingActive(context, wcmDocumentItem) {
    const operationalItem = await ExpandOperationalItem(context, wcmDocumentItem || context.binding);

    if (IsTaggingUntaggingNotAllowed(operationalItem)) {
        return false;
    }

    const isDownlineSeqChecked = CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/UntaggedParameterName.global').getValue());

    if (await isDownlineSeqChecked) {
        const [
            untagChecked,
            headerSpecificationWithoutTemporaryUntagging,
            headerSpecificationWithTemporaryUntagging,
        ] = [
                IsUntagChecked(operationalItem),
                IsTaggingCycleWithoutTemporaryUntaggingPhase(operationalItem),
                IsTaggingCycleWithTemporaryUntaggingPhase(operationalItem),
            ];


        switch (operationalItem.PMMobileStatus?.MobileStatus) {
            case OpItemMobileStatusCodes.Untag:
                return !untagChecked;
            case OpItemMobileStatusCodes.Tagged:
                return headerSpecificationWithoutTemporaryUntagging
                    && untagChecked
                    && await IsAllRelatedWorkPermitClosed(context, operationalItem);
            case OpItemMobileStatusCodes.TemporaryUntagged:
                return headerSpecificationWithTemporaryUntagging;
            default:
                return false;
        }
    }

    return false;
}

/**
 *  @param {IClientAPI} context
 *  @param {WCMDocumentItem} operationalItem
 *  @param {string} status */
export async function CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, status) {
    const isTaggedStatus = status === context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue();
    const seqProperty = isTaggedStatus ? 'TagSequence' : 'UntSequence';
    const currentSeqNumber = isTaggedStatus ? +operationalItem.TagSequence : +operationalItem.UntSequence;

    for (const seqNum of [...Array(currentSeqNumber).keys()].reverse()) {
        const downlineSeqString = String(seqNum).padStart(5, '0');
        const prevSeqItems = await context.read('/SAPAssetManager/Services/AssetManager.service', `${operationalItem['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, [], `$expand=PMMobileStatus&$filter=${seqProperty} eq '${downlineSeqString}'`);
        if (ValidationLibrary.evalIsEmpty(prevSeqItems) || prevSeqItems.every((/** @type {WCMDocumentItem} */ item) => item.ItemCategoryCC === '')) {  // '' == Comment, Comments aren't taggable
            continue;  // check next downline sequence if no operational items
        }
        return !prevSeqItems.filter(item => item.ItemCategoryCC !== '').some((/** @type {WCMDocumentItem} */ item) => item.PMMobileStatus?.MobileStatus !== status);
    }
    return true;  // there weren't any previous items that needed (un)tagging
}

function GetQueryOptionsForPrevNextItem(binding, next = true) {
    return `$orderby=Sequence ${next ? 'asc' : 'desc'}&$filter=Sequence ${next ? 'gt' : 'lt'} '${binding.Sequence}'`;
}

export function IsPrevNextButtonEnabled(context, next = true) {
    const binding = context.binding;
    const query = GetQueryOptionsForPrevNextItem(binding, next);
    return CommonLibrary.getEntitySetCount(context, `${binding['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, query)
        .then(count => !!count);
}

/*
    Handles Next/Previous toolbar button on press action
    @param {FioriToolbarItemButtonControlProxy} toolbarButtonProxy
    @returns {Promise}
**/
export function PrevNextItemButtonOnPress(toolbarButtonProxy) {
    const next = toolbarButtonProxy.getName() === 'NextItem';

    if (!toolbarButtonProxy.getEnabled()) {
        return Promise.reject();
    }

    const pageProxy = toolbarButtonProxy.getPageProxy();
    pageProxy.showActivityIndicator();
    const binding = pageProxy.binding;
    return GetAndUpdateOperationalItem(pageProxy, `${binding['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, GetQueryOptionsForPrevNextItem(binding, next));
}

export async function GetAndUpdateOperationalItem(context, entitySet, query = '') {
    const toolbar = context.getFioriToolbar();
    const pageProxy = context.getPageProxy();
    const sectionedTable = pageProxy.getControl('SectionedTable');

    const queryOptions = `${query}${query ? '&' : ''}$expand=WCMDocumentHeaders,WCMOpGroup_Nav,PMMobileStatus`;
    const result = await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions);

    // rewrite binding in current context, page level, sectioned table, toolbar and progress tracker extension
    const newBinding = result.getItem(0);
    context._context.binding = newBinding;
    pageProxy._context.binding = context._context.binding;
    sectionedTable._context.binding = pageProxy._context.binding;
    toolbar._context.binding = pageProxy._context.binding;

    // redraw controls with new binding
    await toolbar.reset();
    sectionedTable.redraw();
    ProgressTrackerOnDataChanged(context);

    pageProxy.setCaption(await Caption(context));
    context.dismissActivityIndicator();
}

export function IsOperationalItemInUntagging(context) {
    const binding = context.binding;
    return (ValidationLibrary.evalIsEmpty(binding.PMMobileStatus) ? context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/PMMobileStatus`, [], '').then(result => result.getItem(0)) : Promise.resolve(binding.PMMobileStatus)).then(status => {
        if (ValidationLibrary.evalIsEmpty(status)) {
            return false;
        }
        return StatusesForUntaggingCondition.includes(status.MobileStatus);
    });
}

/** @param {WCMDocumentItem} wcmDocumentItem  */
export function GetOperationalItemTechObjectId(context, wcmDocumentItem) {
    const itemCategory = wcmDocumentItem.ItemCategory || wcmDocumentItem.ItemCategoryCC;
    if (itemCategory === ItemCategories.EquipmentCategory) {
        return Promise.resolve(wcmDocumentItem.Equipment);
    } else if (itemCategory === ItemCategories.FlocCategory) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${wcmDocumentItem['@odata.readLink']}/MyFunctionalLocations`, ['FuncLocId'], '')
            .then(floc => ValidationLibrary.evalIsEmpty(floc) ? '' : floc.getItem(0).FuncLocId);
    } else if (itemCategory === ItemCategories.WithoutMasterData) {
        return Promise.resolve(wcmDocumentItem.TechObject);
    }

    return Promise.resolve('-');
}


export const WCMDocumentItemMobileStatusType = 'WCMDOCITEM';
