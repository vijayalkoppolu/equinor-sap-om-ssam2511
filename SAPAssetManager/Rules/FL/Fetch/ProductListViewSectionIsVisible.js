import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function ProductListViewSectionIsVisible(context) {
return FLLibrary.isFetchOnlineSectionVisible(context, FLDocumentTypeValues.ReturnsByProduct);
}
