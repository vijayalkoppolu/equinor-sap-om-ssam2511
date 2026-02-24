import { updateSectionCaption } from './WHInboundDeliveryItemCaptionCount';
import { extractCommonUIState } from './WHInboundDeliveryItemUICommon';
import Logger from '../../../Log/Logger';

/**
 * Extracts UI state specific to selection mode handling
 * @param {Object} context - The context object
 * @returns {Object} Selection mode UI state object
 */
function extractSelectionModeUIState(context) {
    const commonState = extractCommonUIState(context);
    
    if (!commonState.hasValidSection) {
        return { ...commonState, hasValidControls: false };
    }

    try {
        const toolbar = commonState.pageProxy.getFioriToolbar();
        
        return {
            ...commonState,
            toolbar,
            selectionModeMultiple: commonState.section.getSelectionMode() === 'Multiple',
            hasValidControls: !!(commonState.section && toolbar),
        };
    } catch (error) {
        Logger.error('WHInboundDeliveryItemListOnSelectionModeChanged', `Error extracting selection mode UI state: ${error}`);
        return { ...commonState, hasValidControls: false };
    }
}

/**
 * Updates header items visibility (pure UI operation)
 * @param {Object} section - The section object
 * @param {boolean} selectionModeMultiple - Whether selection mode is multiple
 * @returns {void}
 */
function updateHeaderItemsVisibility(section, selectionModeMultiple) {
    setHeaderItemVisible(section, 'SelectItems', !selectionModeMultiple);
    setHeaderItemVisible(section, 'SelectAll', selectionModeMultiple);
    setHeaderItemVisible(section, 'DeselectAll', selectionModeMultiple);
}

/**
 * Updates toolbar items visibility with single iteration optimization
 * @param {Object} toolbar - The toolbar object
 * @param {boolean} selectionModeMultiple - Whether selection mode is multiple
 * @returns {void}
 */
function updateToolbarItemsVisibility(toolbar, selectionModeMultiple) {
    try {
        const items = toolbar.getItems();
        if (!items) return;
        
        // Update all toolbar items in a single iteration for O(n) complexity
        items.forEach(item => {
            if (item.getName() === 'CreateMixedHUButton') {
                item.setVisible(selectionModeMultiple);
            } else {
                item.setVisible(!selectionModeMultiple);
            }
        });
    } catch (error) {
        Logger.error('WHInboundDeliveryItemListOnSelectionModeChanged', `Error updating toolbar items: ${error}`);
    }
}

/**
 * Sets visibility of header items safely (pure UI operation)
 * @param {Object} section - The section object
 * @param {string} itemName - Name of the header item
 * @param {boolean} visible - Whether the item should be visible
 * @returns {void}
 */
export function setHeaderItemVisible(section, itemName, visible) {
    try {
        const headerItem = section.getHeader()?.getItem(itemName);
        if (headerItem) {
            headerItem.setVisible(visible);
        } else {
            // Use debug instead of warn as this might be expected behavior
            Logger.debug('WHInboundDeliveryItemListOnSelectionModeChanged', `Header item '${itemName}' not found`);
        }
    } catch (error) {
        Logger.error('WHInboundDeliveryItemListOnSelectionModeChanged', `Error setting header item visibility: ${error}`);
    }
}

/**
 * Handles selection mode change events (orchestration only)
 * @param {Object} context - The context object
 * @returns {void}
 */
export default function WHInboundDeliveryItemListOnSelectionModeChanged(context) {
    try {
        // 1. Extract UI state (pure UI access)
        const uiState = extractSelectionModeUIState(context);
        
        if (!uiState.hasValidControls) {
            Logger.error('WHInboundDeliveryItemListOnSelectionModeChanged', 'Invalid UI controls');
            return;
        }

        // 2. Update UI elements (pure UI operations)
        updateHeaderItemsVisibility(uiState.section, uiState.selectionModeMultiple);
        updateToolbarItemsVisibility(uiState.toolbar, uiState.selectionModeMultiple);

        // 3. Update caption (triggers separate UI update)
        updateSectionCaption(context);
        
    } catch (error) {
        Logger.error('WHInboundDeliveryItemListOnSelectionModeChanged', `Error in selection mode changed handler: ${error}`);
    }
}
