import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function PackedPackagesListViewSectionIsVisible(context) {
return FLLibrary.isFetchOnlineSectionVisible(context, FLDocumentTypeValues.PackedPackages);
}
