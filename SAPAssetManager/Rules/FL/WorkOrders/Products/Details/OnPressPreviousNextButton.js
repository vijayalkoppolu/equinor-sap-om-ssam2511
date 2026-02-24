import logger from '../../../../Log/Logger';
import {IsFirst, IsLast } from './GetNextPreviousProduct';
import GetNextPreviousProduct from './GetNextPreviousProduct';

/**
 * Handler for the Next/Previous product buttons
 * @param {ToolBarItemProxy} toolBarItemProxy 
 */
export default function OnPressPreviousNextButton(toolBarItemProxy) {
    const isNext = toolBarItemProxy._control && toolBarItemProxy._control.name === 'NextProduct';
    return GeNextPreviousProduct(toolBarItemProxy, isNext);
}

async function GeNextPreviousProduct(toolBarItemProxy, next = true) {
    const pageProxy = toolBarItemProxy.getPageProxy();
    try {
        pageProxy.showActivityIndicator();
        const currentProduct = pageProxy.binding;
        const newProduct = GetNextPreviousProduct(pageProxy, currentProduct.Product, next);
        if (!newProduct) {
            return null;
        }
        const entitySet = 'FldLogsWoProducts';
        // Use both Order and Product for unique identification
        const queryOptions = `$filter=Order eq '${newProduct.Order}' and Product eq '${newProduct.Product}'`;
        const result = await pageProxy.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions);
        const productData = result.getItem(0);
        const toolbar = pageProxy.getToolbar();
        const toolbarControls = toolbar.getToolbarItems();
        // update prev/next buttons state
        const buttonPrevious = toolbarControls.find(item => item._control && item._control.name === 'PreviousProduct');
        const buttonNext = toolbarControls.find(item => item._control && item._control.name === 'NextProduct');
        await buttonPrevious._item.setEnabled(!IsFirst(pageProxy, productData.Product));
        await buttonNext._item.setEnabled(!IsLast(pageProxy, productData.Product));
        const sectionedTable = pageProxy.getControl('SectionedTable');
        // update to new product binding
        pageProxy._context.binding = productData;
        pageProxy.setActionBinding(productData);
        sectionedTable._context.binding = productData;
        toolbar._context.binding = productData;
        toolbarControls.forEach(item => {
            if (item._context) {
                item._context.binding = productData;
                item.redraw();
            }
        });
        await sectionedTable.redraw();
        const actionBar = pageProxy.evaluateTargetPathForAPI('#Page:FLProductDetailsPage').getActionBar();
        actionBar._context.binding = productData;
        await actionBar.reset();
        // Use executeAction to re-navigate to the details page with new binding
        await pageProxy.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/NavigateToFLProductDetails.action');
    } catch (error) {
        logger.error('FL Product Details - GeNextPreviousProduct error: ' + error);
        return null;
    } finally {
        setTimeout(() => {
            pageProxy.dismissActivityIndicator();
        }, 200);
    }
}
