import libCom from '../../Common/Library/CommonLibrary';
import GetSAPUserId from '../../MobileStatus/GetSAPUserId';
import { DocumentTypes } from '../Common/EWMLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/


export default function FetchDocumentsResetFields(context) {
    const sectionTableProxy = context.getPageProxy().getControl('SectionedTable');
    const defaultSection = sectionTableProxy.getSection('FetchDefaultSection');
    const documentType = defaultSection.getControl('DocumentTypeListPicker').getValue()?.[0].ReturnValue;

    ResetSectionFields(sectionTableProxy,documentType);

    libCom.setStateVariable(context,'DownloadEWMDocsStarted',false);
}

function ResetSectionFields(sectionTableProxy,documentType) {
    switch (documentType) {
        case DocumentTypes.WarehouseOrder:
            ResetWarehouseOrderFields(sectionTableProxy.getSection('FetchEWMOrderSection'));
            break;
        case DocumentTypes.WarehouseTask:
            ResetWarehouseTaskFields(sectionTableProxy.getSection('FetchEWMTaskSection'));
            break;
        case DocumentTypes.WarehousePhysicalInventoryItem:
            ResetWarehousePhysicalInventoryFields(sectionTableProxy.getSection('FetchEWMPhysicalInventorySection'));
            break;
        case DocumentTypes.WarehouseInboundDelivery:
            ResetWarehouseInboundDeliveryFields(sectionTableProxy.getSection('FetchEWMInboundDeliverySection'));
            break;
    }
}

function ResetWarehouseOrderFields(section) {
    const [warehouseOrder,queue,activityArea,warehouseProcessType,createdBy,creationDateSwitch,creationStartDate,creationEndDate,refDocNumber] = ['WarehouseOrder','QueueListPicker','ActivityAreaListPicker','ProcessTypeListPicker','CreatedByListPicker','CreationDateRangeSwitch','CreationStartDate','CreationEndDate','RefDocNumber'].map(control => section.getControl(control));
    [warehouseOrder,queue,activityArea,warehouseProcessType,refDocNumber].map((control) => control.setValue(''));
    createdBy.setValue(GetSAPUserId(section));
    creationDateSwitch.setValue(false);
    [creationStartDate,creationEndDate].map((control) => control.setValue(new Date()));
}

function ResetWarehouseTaskFields(section) {
    const [ewmWarehouseTask,ewmWarehouseOrder,ewmActivityArea,ewmQueueList,ewmProcessCategory,product,ewmUnit,ewmSourceBin,ewmDestinationBin,refDocNumber]=['EWMWarehouseTask','EWMWarehouseOrder','EWMActivityAreaListPicker','EWMQueueListPicker','EWMProcessCategoryListPicker','Product','EWMUnit','SourceBin','DestinationBin','EWMRefDocNumber'].map(control => section.getControl(control));
    [ewmWarehouseTask,ewmWarehouseOrder,ewmActivityArea,ewmQueueList,ewmProcessCategory,product,ewmUnit,ewmSourceBin,ewmDestinationBin,refDocNumber].map((control)=>control.setValue(''));
}

function ResetWarehousePhysicalInventoryFields(section) {
    const [
        PhysInvDocumentYear,
        PhysInvDocument,
        PhysInvWarehouseOrder,
        PhysInvStorageType,
        PhysInvStorageBin,
        PlannedCountDateRangeSwitch,
        PlannedCountStartDate,
        PlannedCountEndDate,
        PhysicalInventoryProcedureListPicker,
        PhysInvReason,
        PhysInvPriority,
    ] = [
        'PhysInvDocumentYear',
        'PhysInvDocument',
        'PhysInvWarehouseOrder',
        'PhysInvStorageType',
        'PhysInvStorageBin',
        'PlannedCountDateRangeSwitch',
        'PlannedCountStartDate',
        'PlannedCountEndDate',
        'PhysicalInventoryProcedureListPicker',
        'PhysInvReason',
        'PhysInvPriority',
    ].map(control => section.getControl(control));

    [
        PhysInvDocument,
        PhysInvWarehouseOrder,
        PhysInvStorageType,
        PhysInvStorageBin,
        PhysicalInventoryProcedureListPicker,
        PhysInvReason,
        PhysInvPriority,
    ].forEach((control) => control.setValue(''));

    PhysInvDocumentYear.setValue(new Date().getFullYear().toString());
    PlannedCountDateRangeSwitch.setValue(false);
    [PlannedCountStartDate,PlannedCountEndDate].forEach((control) => control.setValue(new Date()));
}

function ResetWarehouseInboundDeliveryFields(section) {
    const [
        EWMDeliveryNum,
        INBRefDocNumber,
        PlannedDeliveryDateRangeSwitch,
        PlannedDeliveryStartDate,
        PlannedDeliveryEndDate,
        InboundDeliveryDoorNumber,
        HUNumber,
        InboundDeliveryVendorListPicker,
    ] = [
        'EWMDeliveryNum',
        'INBRefDocNumber',
        'PlannedDeliveryDateRangeSwitch',
        'PlannedDeliveryStartDate',
        'PlannedDeliveryEndDate',
        'InboundDeliveryDoorNumber',
        'HUNumber',
        'InboundDeliveryVendorListPicker',
    ].map(control => section.getControl(control));
        
    [
        EWMDeliveryNum,
        INBRefDocNumber,
        InboundDeliveryDoorNumber,
        HUNumber,
        InboundDeliveryVendorListPicker,
    ].forEach((control) => control.setValue(''));

    PlannedDeliveryDateRangeSwitch.setValue(false);
    [PlannedDeliveryStartDate,PlannedDeliveryEndDate].forEach((control) => control.setValue(new Date()));

}
