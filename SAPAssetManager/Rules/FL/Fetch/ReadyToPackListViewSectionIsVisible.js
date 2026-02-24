import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function ReadyToPackListViewSectionIsVisible(context) {
return FLLibrary.isFetchOnlineSectionVisible(context, FLDocumentTypeValues.ReadyToPack);
}
