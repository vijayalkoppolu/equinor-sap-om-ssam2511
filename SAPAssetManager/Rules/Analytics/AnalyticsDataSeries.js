import chartType from './ChartType';
import deviceType from '../Common/DeviceType';
import ODataLibrary from '../OData/ODataLibrary';

export default function AnalyticsDataSeries(context, binding = context.binding) {
    let data = [];

    //PRT Measuring Point Case
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        binding = binding.PRTPoint || {};
    }

    /**
     * Returns data depending on the type of chart
     */
    if (binding.MeasurementDocs?.length) {
        ///Sorting by  date
        binding.MeasurementDocs.sort(function(a, b) {
            return new Date(a.ReadingTimestamp) - new Date(b.ReadingTimestamp);
        });
        data = generateData(binding, context);
        data = limitDataPoints(data, binding, context);
        return [data];
    }

    return data;
}

function generateData(binding, context) {
    let data = [];
    switch (chartType(context)) {
        case 'valCode':
            ///Valuation code plots no data points
            break;
        case 'Line':
            ///Line chart plots reading values
            for (const measurementDoc of binding.MeasurementDocs) {
                data.push(measurementDoc.ReadingValue);
            }
            break;
        case 'Column':
            ///Column chart plots the difference
            for (const measurementDoc of binding.MeasurementDocs) {
                if (!ODataLibrary.isLocal(measurementDoc)) {
                    data.push(measurementDoc.CounterReadingDifference);
                }
            }
            break;
        default:
            break;
    }

    return data;
}

function limitDataPoints(data, binding, context) {
    const tabletMaxNumOfPoints = 7;
    const phoneMaxNumOfPoints = 4;

    switch (deviceType(context)) {
        ///return the last points depending on the device
        case 'Phone':
            if (binding.MeasurementDocs.length > phoneMaxNumOfPoints) {
                data = data.slice(-phoneMaxNumOfPoints);
            }
            break;
        case 'Tablet':
            if (binding.MeasurementDocs.length > tabletMaxNumOfPoints) {
                data = data.slice(-tabletMaxNumOfPoints);
            }
            break;
        default:
            break;
    }

    return data;
}
