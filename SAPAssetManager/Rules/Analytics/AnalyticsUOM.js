
export default function AnalyticsUOM(context, binding = context.binding) {
    //PRT Measuring Point Case
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
       binding = binding.PRTPoint || {};
    }

    if (binding.MeasurementDocs?.length) {
        return binding.UoM;
    } else {
        return '';
    }
}
