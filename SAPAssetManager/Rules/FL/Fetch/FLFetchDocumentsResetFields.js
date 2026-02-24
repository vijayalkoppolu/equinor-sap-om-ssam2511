import FLSetDefaultPlant from './FLSetDefaultPlant';
import libCom from '../../Common/Library/CommonLibrary';
import { FLDocumentTypeValues } from '../Common/FLLibrary';

/**
 * Reset the fields in the Fetch Documents screen for the selected document type.
 * @param {*} context 
 */
export default function FLFetchDocumentsResetFields(context) {
    const sectionTableProxy = context.getPageProxy().getControl('SectionedTable');
    const defaultSection = sectionTableProxy.getSection('FetchDefaultSection');
    const plantLstPkr = defaultSection.getControl('PlantListPicker');
    const documentType = defaultSection.getControl('DocumentTypeListPicker').getValue()?.[0]?.ReturnValue;
    plantLstPkr.setValue(FLSetDefaultPlant());
    ResetSectionFields(sectionTableProxy, documentType);
    libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
}

function ResetSectionFields(sectionTableProxy, documentType) {
    switch (documentType) {
        case FLDocumentTypeValues.Voyage:
            ResetVoyageFields(sectionTableProxy.getSection('FetchVoyagesSection'));
            break;
        case FLDocumentTypeValues.Container:
        case FLDocumentTypeValues.Package:
            ResetContainerFields(sectionTableProxy.getSection('FetchContainersSection'));
            break;
        case FLDocumentTypeValues.WorkNetworkOrder:
            ResetWorkNetworkOrderFields(sectionTableProxy.getSection('FetchWorkNetworkOrderSection'));
            break;
        case FLDocumentTypeValues.ReturnsByProduct:
            ResetReturnsByProductFields(sectionTableProxy.getSection('FetchReturnsByProductSection'));
            break;
        case FLDocumentTypeValues.PackedPackages:
            ResetPackedPackagesFields(sectionTableProxy.getSection('FetchPackedPackagesSection'));
            break;
        case FLDocumentTypeValues.ReadyToPack:
            ResetReadyToPackFields(sectionTableProxy.getSection('FetchReadyToPackSection'));
            break;
        case FLDocumentTypeValues.PackedContainers:
            ResetPackedContainersFields(sectionTableProxy.getSection('FetchPackedContainersSection'));
            break;
        case FLDocumentTypeValues.HandlingUnit:
        case FLDocumentTypeValues.DeliveryItem:
            ResetHUDelItemsFields(sectionTableProxy.getSection('FetchHUDelItemsSection'));
            break;
    }
}

function ResetVoyageFields(section) {
    const [voyageNumber, voyageStatus, modeOfTransport, fromPlant, plannedArrivalDateStart, plannedArrivalDateEnd, receivingPoint, shippingPoint,  plannedArrivalDateSwitch] = ['VoyageNumber', 'VoyageStatus', 'ModeOfTransport', 'FromPlant', 'StartDateFilter', 'EndDateFilter', 'ReceivingPoint', 'ShippingPoint', 'PADateSwitch'].map(control => section.getControl(control));
    [voyageNumber, voyageStatus, modeOfTransport, fromPlant, receivingPoint, shippingPoint].map((control) => control.setValue(''));
    plannedArrivalDateSwitch.setValue(false);
    [plannedArrivalDateStart, plannedArrivalDateEnd].map((control) => control.setValue(new Date()));
}

function ResetContainerFields(section) {
    const [workOrdMaintOrd, product, wbsElementProject, kitID, containerID, containerStatus, voyageNumber,  dispatchDateSwitch, startDispatchDate, endDispatchDate, receivingPoint] = ['ContainerWorkOrdMaintOrd', 'ContainerProduct', 'ContainerWBSElementProject', 'KitID', 'ContainerID', 'ContainerStatus', 'ContainerVoyageNumber', 'ContainerDispatchDateSwitch', 'ContainerStartDateFilter', 'ContainerEndDateFilter', 'ContainerReceivingPoint'].map(control => section.getControl(control));
    [workOrdMaintOrd, product, wbsElementProject, kitID, containerStatus, voyageNumber, receivingPoint, containerID].map((control) => control.setValue(''));
    dispatchDateSwitch.setValue(false);
    [startDispatchDate, endDispatchDate].map((control) => control.setValue(new Date()));
}

function ResetWorkNetworkOrderFields(section) {
    const [workOrder, product] = ['WorkNetworkOrder', 'WONOProduct'].map(control => section.getControl(control));
    [workOrder, product].map((control) => control.setValue(''));
}

function ResetReturnsByProductFields(section) {
    const [returnStatus, supplyProcess, recommendedAction, referenceDocNumber, product, OutBoundDelivery, dispatchDatePeriod, startDispatchDate, endDispatchDate, requestedDeliveryDateSwitch, requestedDeliveryDate] = ['ReturnStatus', 'SupplyProcess', 'RecommendedAction', 'ReferenceDocumentNumber', 'Product', 'OutboundDelivery', 'DispatchPeriodSwitch', 'DispatchedStartDate', 'DispatchedEndDate', 'RequestedDeliveryDateSwitch', 'RequestedDeliveryDate'].map(control => section.getControl(control));
    [returnStatus, supplyProcess, recommendedAction, referenceDocNumber, product, OutBoundDelivery].map((control) => control.setValue(''));
    dispatchDatePeriod.setValue(false);
    requestedDeliveryDateSwitch.setValue(false);
    [startDispatchDate, endDispatchDate, requestedDeliveryDate].map((control) => control.setValue(new Date()));
}

function ResetReadyToPackFields(section) {
    const [readyToPackPlant, itemStatus, handlingUnit, deliveryDocument, deliveryDueDateSwitch, deliveryDueDateStartDate, deliveryDueDateEndDate] = [
        'FLReadyToPackPlantListPicker',
        'ItemStatus',
        'HandlingUnitExternalId',
        'DeliveryDocument',
        'DeliveryDueDateSwitch',
        'DeliveryDueDateStartDate',
        'DeliveryDueDateEndDate',
    ].map(control => section.getControl(control));
    [readyToPackPlant, itemStatus, handlingUnit, deliveryDocument].map(control => control.setValue(''));
    deliveryDueDateSwitch.setValue(false);
    [deliveryDueDateStartDate, deliveryDueDateEndDate].map(control => control.setValue(new Date()));
}

function ResetHUDelItemsFields(section) {
    const [workOrdMaintOrd, product, wbsElementProject, kitID, handlingUnit, referenceDocNumber, huDiStatus, voyageNumber,  dispatchDateSwitch, startDispatchDate, endDispatchDate, receivingPoint] = ['HUDelItemsWorkOrdMaintOrd', 'HUDelItemsProduct', 'HUDelItemsWBSElementProject', 'HUDelItemsKitID', 'HandlingUnit', 'ReferenceDocNumber', 'HUDelItemsStatus', 'HUDelItemsVoyageNumber', 'HUDelItemsDispatchDateSwitch', 'HUDelItemsStartDateFilter', 'HUDelItemsEndDateFilter', 'HUDelItemsReceivingPoint'].map(control => section.getControl(control));
    [workOrdMaintOrd, product, wbsElementProject, kitID, handlingUnit, referenceDocNumber, huDiStatus, voyageNumber, receivingPoint].map((control) => control.setValue(''));
    dispatchDateSwitch.setValue(false);
    [startDispatchDate, endDispatchDate].map((control) => control.setValue(new Date()));
}

function ResetPackedContainersFields(section) {
    const [packedContainersPlant, itemStatus] = [
        'FLPackedContainersPlantListPicker',
        'ContainerPackingStatus',
    ].map(control => section.getControl(control));
    [packedContainersPlant, itemStatus].map(control => control.setValue(''));
}

function ResetPackedPackagesFields(section) {
    const [packedPackagesPlant, itemStatus, containerID] = [
        'FLPackPackagePlantListPicker',
        'PKGItemStatus',
        'FLContainerID',
    ].map(control => section.getControl(control));
    [packedPackagesPlant, itemStatus, containerID].map(control => control.setValue(''));
}
