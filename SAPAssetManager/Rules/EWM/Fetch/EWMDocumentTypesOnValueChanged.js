import { DocumentTypes } from '../Common/EWMLibrary';
import FetchDocumentsResetFields from './FetchDocumentsResetFields';

/** Sets the visibility of different fetch sections based on the value of the DocumentTypeListPicker
 * @param {*} context
 */

export default function EWMDocumentTypesOnValueChanged(context) {
    const sectionTableProxy = context.getPageProxy().getControl('SectionedTable');
    const documentTypeValue = sectionTableProxy.getSection('FetchDefaultSection').getControl('DocumentTypeListPicker').getValue()?.[0]?.ReturnValue;


    sectionTableProxy.getSection('FetchEWMOrderSection').setVisible(documentTypeValue === DocumentTypes.WarehouseOrder);
    sectionTableProxy.getSection('FetchEWMTaskSection').setVisible(documentTypeValue === DocumentTypes.WarehouseTask);
    sectionTableProxy.getSection('FetchEWMPhysicalInventorySection').setVisible(documentTypeValue === DocumentTypes.WarehousePhysicalInventoryItem);
    sectionTableProxy.getSection('FetchEWMInboundDeliverySection').setVisible(documentTypeValue === DocumentTypes.WarehouseInboundDelivery);

    FetchDocumentsResetFields(context);
}
