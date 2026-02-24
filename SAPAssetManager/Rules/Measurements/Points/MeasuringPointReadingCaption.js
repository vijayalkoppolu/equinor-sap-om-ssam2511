import MeasuringPointLibrary from '../MeasuringPointLibrary';
export default function MeasuringPointReading(context) {
    let requiredFields = MeasuringPointLibrary.setRequiredFields(context.binding);
    let caption = (requiredFields.length>0 && requiredFields[0]?.Fields && requiredFields[0]?.Fields?.includes('ReadingSim'))  ? `${context.localizeText('reading')}*`:`${context.localizeText('reading')}`; 
    return caption;
}
