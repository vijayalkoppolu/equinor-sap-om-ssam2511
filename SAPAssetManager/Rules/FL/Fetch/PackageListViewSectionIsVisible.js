import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function PackageListViewSectionIsVisible(context) {
    return FLLibrary.isFetchOnlineSectionVisible(context, FLDocumentTypeValues.Package);
}
