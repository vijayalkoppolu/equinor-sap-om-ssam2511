import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import FilterLibrary from '../../../Filter/FilterLibrary';

/**
 * Collect filter + sort values from AssignToVoyageFilter page
 * @param {IClientAPI} context
 */
export default function AssignToVoyageFilterResults(context) {
    const fc = context.getControl('FormCellContainer');
    const clientData = context.evaluateTargetPath('#Page:AssignToVoyagePage/#ClientData');

    const sortFilterValue = fc.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);

    const filterResults = [];

    const voyageNumber = fc.getControl('VoyageNumberInput').getValue();
    clientData.VoyageNumberInput = voyageNumber;
    if (voyageNumber && ValidationLibrary.evalIsNotEmpty(voyageNumber)) {
        filterResults.push(
            context.createFilterCriteria(
                context.filterTypeEnum.Filter,
                'VoyageNumber',
                context.localizeText('fl_voyage_number'),
                [String(voyageNumber)],
                false,
            ),
        );
    }

    const voyageTypeArr = fc.getControl('VoyageTypeFilter').getValue();
    clientData.VoyageTypeFilter = voyageTypeArr;
    let voyageType = '';
    if (Array.isArray(voyageTypeArr) && voyageTypeArr.length > 0) {
        voyageType = voyageTypeArr[0].ReturnValue || '';
    }
    if (ValidationLibrary.evalIsNotEmpty(voyageType)) {
        filterResults.push(
            context.createFilterCriteria(
                context.filterTypeEnum.Filter,
                'VoyageTypeCode',
                context.localizeText('fl_voyage_type'),
                [voyageType],
                false,
            ),
        );
    }

    const fromShipping = fc.getControl('FromShippingPointInput').getValue();
    clientData.FromShippingPointInput = fromShipping;
    if (fromShipping && ValidationLibrary.evalIsNotEmpty(fromShipping)) {
        filterResults.push(
            context.createFilterCriteria(
                context.filterTypeEnum.Filter,
                'SourceStage',
                context.localizeText('fl_from_shipping_point'),
                [String(fromShipping)],
                false,
            ),
        );
    }

    const toReceiving = fc.getControl('ToReceivingPointInput').getValue();
    clientData.ToReceivingPointInput = toReceiving;
    if (toReceiving && ValidationLibrary.evalIsNotEmpty(toReceiving)) {
        filterResults.push(
            context.createFilterCriteria(
                context.filterTypeEnum.Filter,
                'DestinationStage',
                context.localizeText('fl_to_receiving_point'),
                [String(toReceiving)],
                false,
            ),
        );
    }

    const destinationPlantArr = fc.getControl('DestinationPlantFilter').getValue();
    clientData.DestinationPlantFilter = destinationPlantArr;
    let destinationPlant = '';
    if (Array.isArray(destinationPlantArr) && destinationPlantArr.length > 0) {
        destinationPlant = destinationPlantArr[0].ReturnValue || '';
    }
    if (ValidationLibrary.evalIsNotEmpty(destinationPlant)) {
        filterResults.push(
            context.createFilterCriteria(
                context.filterTypeEnum.Filter,
                'DestinationPlant',
                context.localizeText('destination_plant'),
                [destinationPlant],
                false,
            ),
        );
    }

    filterResults.push(sortFilterValue);

    return filterResults;
}
