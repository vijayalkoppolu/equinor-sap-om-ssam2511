import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function PackedContainersListViewSectionIsVisible(context) {
return FLLibrary.isFetchOnlineSectionVisible(context, FLDocumentTypeValues.PackedContainers);
}
