import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function ContainerListViewSectionIsVisible(context) {
    return FLLibrary.isFetchOnlineSectionVisible(context, FLDocumentTypeValues.Container);
}
