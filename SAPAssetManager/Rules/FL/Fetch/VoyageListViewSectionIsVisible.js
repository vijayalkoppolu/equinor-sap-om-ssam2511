import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function VoyageListViewSectionIsVisible(context) {
    return FLLibrary.isFetchOnlineSectionVisible(context, FLDocumentTypeValues.Voyage);
}
