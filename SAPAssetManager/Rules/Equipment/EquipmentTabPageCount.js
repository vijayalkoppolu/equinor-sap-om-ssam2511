import { setEquipmentCaptionWithCount } from './OnEquipmentFilterSuccess';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function EquipmentTabPageCount(clientAPI) {
    let queryOption = CommonLibrary.getQueryOptionFromFilter(clientAPI);
    return setEquipmentCaptionWithCount(clientAPI, 'MyEquipments', queryOption);
}
