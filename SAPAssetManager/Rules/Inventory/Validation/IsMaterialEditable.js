export default function IsMaterialEditable(context) {
    return context.binding?.['@odata.type'] !== '#sap_mobile.MaterialSLoc';
}
