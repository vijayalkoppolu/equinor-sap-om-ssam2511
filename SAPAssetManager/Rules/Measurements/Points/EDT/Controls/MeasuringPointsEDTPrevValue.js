
import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import EDTHelper from '../MeasuringPointsEDTHelper';

export default async function MeasuringPointsEDTPrevValue(context) {
    const binding = context.binding;
    const cachedSectionsBindings = CommonLibrary.getStateVariable(context, 'EDTSectionBindings')?.flat() || [];
    const cachedPointBinding = cachedSectionsBindings.find(b => b.Point === binding.Point);
    const latestDoc = EDTHelper.getLatestMeasurementDoc(context, cachedPointBinding);
    let value = '-';

    if (latestDoc?.PrevReadingValue || latestDoc?.PrevValuationCode) {
        const valuationCode = latestDoc.PrevValuationCode ? `${latestDoc.PrevValuationCode} - ${latestDoc.PrevCodeShortText}` : null;
        value = [latestDoc.PrevReadingValue, valuationCode].filter(item => CommonLibrary.isDefined(item)).join(', ');
    }

    return {
        'Type': 'Text',
        'Name': 'PrevReading',
        'IsMandatory': false,
        'IsReadOnly': true,
        'Property': 'PrevReading',
        'OnValueChange': '',
        'Parameters': {
            'Value': value,
        },
    };
}
