import ODataDate from '../../Common/Date/ODataDate';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

const NOT_STARTED_VOYAGE = '04';
export default function VoyageFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getVoyageFilters(context).join(' and ');
    queryBuilder.filter(`(${filtersArray})`);
    return queryBuilder;
}


export function getVoyageFilters(context) {
    const filters = [];
    const plant = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:PlantListPicker').getValue());
    const [voyageNumber, plannedArrivalDateStart, plannedArrivalDateEnd, receivingPoint, shippingPoint,  plannedArrivalDateSwitch] = ['VoyageNumber', 'StartDateFilter', 'EndDateFilter', 'ReceivingPoint', 'ShippingPoint', 'PADateSwitch'].map(control => {
        return context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue();
    });
    const [startDate, endDate] = [plannedArrivalDateStart, plannedArrivalDateEnd].map(date => new ODataDate(date));
    const [voyageStatus, modeOfTransport, fromPlant] = ['VoyageStatus', 'ModeOfTransport', 'FromPlant'].map(control => {
        return libCom.getListPickerValue(context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue());
    });
    if (!libVal.evalIsEmpty(plant)) {
        filters.push(`DestinationPlant eq '${plant}'`);
    }
    if (!libVal.evalIsEmpty(voyageNumber)) {
        filters.push(`VoyageNumber eq '${voyageNumber}'`);
    }
    if (!libVal.evalIsEmpty(voyageStatus)) {
        filters.push(`VoyageStatusCode eq '${voyageStatus}'`);
    } else {
        //Add default filter to prevent download of "Not Started" voyages
        filters.push(`VoyageStatusCode ne '${NOT_STARTED_VOYAGE}'`);
    }
    if (!libVal.evalIsEmpty(modeOfTransport)) {
        filters.push(`VoyageTypeCode eq '${modeOfTransport}'`);
    }
    if (plannedArrivalDateSwitch && !libVal.evalIsEmpty(startDate) && !libVal.evalIsEmpty(endDate)) {
        filters.push(`(PlannedArrivalDate ge datetime'${startDate.toDBDateString(context)}' and PlannedArrivalDate le datetime'${endDate.toDBDateString(context)}')`);
    }
    if (!libVal.evalIsEmpty(receivingPoint)) {
        filters.push(`DestinationStage eq '${receivingPoint}'`);
    }
    if (!libVal.evalIsEmpty(fromPlant)) {
        filters.push(`SourcePlant eq '${fromPlant}'`);
    }
    if (!libVal.evalIsEmpty(shippingPoint)) {
        filters.push(`SourceStage eq '${shippingPoint}'`);
    }
    return filters;
}
