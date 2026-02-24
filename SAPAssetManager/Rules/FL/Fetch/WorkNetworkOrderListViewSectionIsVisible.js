import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function WorkNetworkOrderListViewSectionIsVisible(context) {
    return FLLibrary.isFetchOnlineSectionVisible(context, FLDocumentTypeValues.WorkNetworkOrder);
}
