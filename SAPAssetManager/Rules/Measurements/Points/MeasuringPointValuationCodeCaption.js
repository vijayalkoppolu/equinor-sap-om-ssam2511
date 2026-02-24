import MeasuringPointLibrary from '../MeasuringPointLibrary';
export default function MeasuringPointValuationCodeCaption(context) {
    let requiredFields = MeasuringPointLibrary.setRequiredFields(context.binding);
    let caption = (requiredFields.length>0 && requiredFields[0]?.Fields && requiredFields[0]?.Fields?.includes('ValuationCodeLstPkr')) ? `${context.localizeText('valuation_code')}*`:`${context.localizeText('valuation_code')}`; 
    return caption;
}
