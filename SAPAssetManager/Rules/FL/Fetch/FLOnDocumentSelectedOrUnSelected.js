import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function FLOnDemandObjectOnDocumentSelectedOrUnSelectedType(context) {
    const documentType = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DocumentTypeListPicker').getValue());
    const documentSection = {
        VOY: 'VoyageListViewSection',
        CTN: 'ContainerListViewSection',
        PKG: 'PackageListViewSection',
        WNO: 'WorkNetworkOrderListViewSection',
        RTP: 'ReturnsByProductListViewSection',
        PCT: 'ReadyToPackListViewSection',
        HU: 'HUDelItemsListViewSection',
        DI: 'HUDelItemsListViewSection',
        PPKG: 'PackedPackagesListViewSection',
        PCTN: 'PackedContainersListViewSection',
    }[documentType];

    const objectTable  = context.getPageProxy()?.getControl('SectionedTable')?.getSection(documentSection);
    if (!libVal.evalIsEmpty(objectTable)) {
        let item = objectTable.getSelectionChangedItem();
        let documents = libCom.getStateVariable(context, 'Documents');
        if (libVal.evalIsEmpty(documents)) {
            documents = [];
        }

        if (item.selected) {
            let document = FLLibrary.getDocumentData(item.binding, documentType);
            documents.push(document);
            libCom.setStateVariable(context, 'Documents', documents);
        } else {
            handleUnselectedItem(documents, item, context, documentType);
        }
    }
    return true;
}

function handleUnselectedItem(documents, item, context, documentType) {
    let newDocuments = [];
    if (documents.length > 0) {
        newDocuments = documents.filter(doc => (documentType === FLDocumentTypeValues.Voyage && doc.ObjectId !== item.binding.VoyageStageUUID) ||
                                               (documentType === FLDocumentTypeValues.Container && doc.ObjectId !== item.binding.ContainerID) || 
                                               (documentType === FLDocumentTypeValues.Package && doc.ObjectId !== item.binding.ContainerID) ||
                                               (documentType === FLDocumentTypeValues.WorkNetworkOrder && doc.ObjectId !== item.binding.ObjectId) ||
                                               (documentType === FLDocumentTypeValues.ReturnsByProduct && doc.ObjectId !== item.binding.ObjectId) ||
                                               (documentType === FLDocumentTypeValues.ReadyToPack && doc.ObjectId !== item.binding.ObjectId) ||
                                               (documentType === FLDocumentTypeValues.PackedPackages && doc.ObjectId !== item.binding.ObjectId) ||
                                               (documentType === FLDocumentTypeValues.PackedContainers && doc.ObjectId !== item.binding.ObjectId) ||
                                               ([FLDocumentTypeValues.HandlingUnit, FLDocumentTypeValues.DeliveryItem].includes(documentType) && (doc.ObjectId !== `${item.binding.DispatchLoc}${item.binding.DispatchDate}${item.binding.ReferenceDocNumber}`)));
    }
    libCom.setStateVariable(context, 'Documents', newDocuments);
}
