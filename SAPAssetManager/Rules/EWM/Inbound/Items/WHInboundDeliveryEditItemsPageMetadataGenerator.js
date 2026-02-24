import WHInboundDeliveryEditItemsGetEDT, { WHInboundDeliveryEditItemsGetSectionHeader } from './WHInboundDeliveryEditItemsGetEDT';
import SectionDescriptionHeight from '../../SectionDescriptionHeight';
import EDTHeight from '../../../Inventory/IssueOrReceipt/BulkUpdate/EDTConfigurations';
import { InboundDeliveryStatusValue } from '../../Common/EWMLibrary';

export default function WHInboundDeliveryEditItemsPageMetadataGenerator(context, binding = context.binding || context.getActionBinding()) {
    let page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/EWM/Inbound/WHInboundDeliveryEditAllItems.page');
    for (const item of binding.WarehouseInboundDeliveryItem_Nav) {
        if (item.GRStatusValue !== InboundDeliveryStatusValue.Completed) {
            const queryOptions = `$filter=GRStatusValue ne '${InboundDeliveryStatusValue.Completed}' and ItemID eq '${item.ItemID}'`;
            const title = getProductAndDesc(item);
            const description = '' + parseInt(item.ItemNumber);
            const headerHeight = SectionDescriptionHeight(context, 0);
            const header = WHInboundDeliveryEditItemsGetSectionHeader(context, headerHeight * 0.6, title, description, queryOptions);
            const edtHeight = EDTHeight(context);
            const edt = WHInboundDeliveryEditItemsGetEDT(edtHeight, queryOptions);
            
            page.Controls[0].Sections.push(header);
            page.Controls[0].Sections.push(edt);
        }
    }
    return page;
}

function getProductAndDesc(item) {
    const product = item.Product;
    const itemDesc = item.ProductDescription;
    const result = [product, itemDesc].filter(Boolean).join(' - ');
    
    return result || '-';
}
