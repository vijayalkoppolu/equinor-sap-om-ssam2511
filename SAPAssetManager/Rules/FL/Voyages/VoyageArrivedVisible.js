import { VoyageStatus } from '../Common/FLLibrary';

export default function VoyageArrivedVisible(context) {
    const binding = context.binding || context.getPageProxy().getActionBinding();
    return binding.VoyageStatusCode === VoyageStatus.InTransit;
}
