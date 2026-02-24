import MeasuringPointLibrary from '../MeasuringPointLibrary';
export default function MeasuringPointValuationCodeCaptionFDC(context) {
    let binding = context.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        binding = binding.PRTPoint;
    } else {
        binding = binding?.MeasuringPoint ? binding?.MeasuringPoint : context.binding;
    }
    let requiredFields = MeasuringPointLibrary.setRequiredFields(context.binding);
    let caption = (requiredFields.length>0 && requiredFields[0]?.Fields && requiredFields[0]?.Fields?.includes('ValuationCodeLstPkr')) ? `${context.localizeText('valuation_code')}*`:`${context.localizeText('valuation_code')}`; 
    return caption;
}
