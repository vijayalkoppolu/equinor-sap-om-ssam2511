import CommonLibrary from '../../Common/Library/CommonLibrary';
import { DocumentTypes } from '../Common/EWMLibrary';

const SECTIONS_MAPPING = {
    [DocumentTypes.WarehouseOrder]: 'EWMOrderOnlineDocumentsListViewSection',
    [DocumentTypes.WarehouseTask]: 'EWMTaskOnlineDocumentListViewSection',
    [DocumentTypes.WarehousePhysicalInventoryItem]: 'EWMPhysicalInventoryOnlineDocumentsListViewSection',
    [DocumentTypes.WarehouseInboundDelivery]: 'EWMInboundDeliveryOnlineDocumentsListViewSection',
};

export default function FetchDocumentsOnlinePageMetadata(clientAPI) {
    const visibleSectionName = SECTIONS_MAPPING[CommonLibrary.getListPickerValue(clientAPI.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue())];
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/EWM/Fetch/FetchDocumentsOnline.page');

    page.Controls[0].Sections = page.Controls[0].Sections.filter(section => section._Name === visibleSectionName);

    return page;
}
