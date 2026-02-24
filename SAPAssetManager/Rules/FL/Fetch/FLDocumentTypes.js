import { FLDocumentTypeValues } from '../Common/FLLibrary';
/**
 * 
 * @param {*} context 
 * @returns List of Documents supported for fetching
 */
export default function FLDocumentTypes(context) {
    return [
        {DisplayValue: context.localizeText('fld_voyages'), ReturnValue: FLDocumentTypeValues.Voyage},
        {DisplayValue: context.localizeText('fld_containers'), ReturnValue: FLDocumentTypeValues.Container},
        {DisplayValue: context.localizeText('fld_packages'), ReturnValue: FLDocumentTypeValues.Package},
        {DisplayValue: context.localizeText('fld_handling_units'), ReturnValue: FLDocumentTypeValues.HandlingUnit},
        {DisplayValue: context.localizeText('fld_delivery_items'), ReturnValue: FLDocumentTypeValues.DeliveryItem},
        {DisplayValue: context.localizeText('fld_work_network_orders'), ReturnValue: FLDocumentTypeValues.WorkNetworkOrder},
        {DisplayValue: context.localizeText('products'), ReturnValue: FLDocumentTypeValues.ReturnsByProduct},
        {DisplayValue: context.localizeText('ready_to_pack'), ReturnValue: FLDocumentTypeValues.ReadyToPack},
        {DisplayValue: context.localizeText('fld_packed_packages'), ReturnValue: FLDocumentTypeValues.PackedPackages},
        {DisplayValue: context.localizeText('packed_containers'), ReturnValue: FLDocumentTypeValues.PackedContainers},
    ];
}
