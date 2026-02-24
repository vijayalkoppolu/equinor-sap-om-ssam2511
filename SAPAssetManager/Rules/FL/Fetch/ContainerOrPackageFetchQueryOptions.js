import ODataDate from '../../Common/Date/ODataDate';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import { ContainerStatus } from '../Common/FLLibrary';

export default function ContainerOrPackageFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getContainerFilters(context).join(' and ');
    queryBuilder.filter(`(${filtersArray})`);
    return queryBuilder;
}

export function getContainerFilters(context) {
    const filters = [];
    const plant = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:PlantListPicker').getValue());
    const [workOrdMaintOrd, product, wbsElementProject, kitID, containerID, voyageNumber,  dispatchDateSwitch, startDispatchDate, endDispatchDate, receivingPoint] = ['ContainerWorkOrdMaintOrd', 'ContainerProduct', 'ContainerWBSElementProject', 'KitID', 'ContainerID', 'ContainerVoyageNumber', 'ContainerDispatchDateSwitch', 'ContainerStartDateFilter', 'ContainerEndDateFilter', 'ContainerReceivingPoint'].map(control => {
        return context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue();
    });
    const [startDate, endDate] = [startDispatchDate, endDispatchDate].map(date => new ODataDate(date));
    const containerStatus = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:ContainerStatus').getValue());

    if (!libVal.evalIsEmpty(plant)) {
        filters.push(`DestinationPlant eq '${plant}'`);
    }
    if (!libVal.evalIsEmpty(containerID)) {
        filters.push(`ContainerID eq '${containerID}'`);
    }
    if (!libVal.evalIsEmpty(containerStatus)) {
        filters.push(`ContainerStatus eq '${containerStatus}'`);
    } else {
        filters.push(`ContainerStatus ne '${ContainerStatus.Received}'`);
    }
    if (!libVal.evalIsEmpty(voyageNumber)) {
        filters.push(`VoyageNumber eq '${voyageNumber}'`);
    }
    if (dispatchDateSwitch && !libVal.evalIsEmpty(startDate) && !libVal.evalIsEmpty(endDate)) {
        filters.push(`(DispatchDate ge datetime'${startDate.toDBDateString(context)}' and DispatchDate le datetime'${endDate.toDBDateString(context)}')`);
    }
    if (!libVal.evalIsEmpty(receivingPoint)) {
        filters.push(`ReceivingPoint eq '${receivingPoint}'`);
    }
    if (!libVal.evalIsEmpty(wbsElementProject)) {
        filters.push(`WBSElementExternalID eq '${wbsElementProject}'`);
    }
    if (!libVal.evalIsEmpty(kitID)) {
        filters.push(`FieldLogisticsKitIdentifier eq '${kitID}'`);
    }
    if (!libVal.evalIsEmpty(workOrdMaintOrd)) {
        filters.push(`MaintenanceOrder eq '${workOrdMaintOrd}'`);
    }
    if (!libVal.evalIsEmpty(product)) {
        filters.push(`Material eq '${product}'`);
    }
    return filters;
}
