import CommonLibrary from '../../../Common/Library/CommonLibrary';
import {ProductListFilterAndSearchQuery} from '../ReturnsByProductOnLoadQuery';

export default function FLIsSelectItemsButtonActive(clientAPI) {
  const countQueryOptions = ProductListFilterAndSearchQuery(clientAPI, true);

  return CommonLibrary.getEntitySetCount(
    clientAPI,
    'FldLogsInitRetProducts',
    countQueryOptions,
  )
    .then((count) => {
      if (count > 0) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      throw error;
    });
}
