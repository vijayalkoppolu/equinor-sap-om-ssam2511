import CommonLibrary from '../Common/Library/CommonLibrary';
export default function SideDrawerFLProductsCount(context) {
    return CommonLibrary.getEntitySetCount(context, 'FldLogsInitRetProducts')
        .then(count => {
            return context.localizeText('return_by_product_x', [count]);
        });
}
