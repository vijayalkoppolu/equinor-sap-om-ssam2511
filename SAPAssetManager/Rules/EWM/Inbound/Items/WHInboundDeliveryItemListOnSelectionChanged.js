import { setHeaderItemVisible } from './WHInboundDeliveryItemListOnSelectionModeChanged';
import { updateSectionCaption } from './WHInboundDeliveryItemCaptionCount';
import { extractCommonUIState, validateNumericInput } from './WHInboundDeliveryItemUICommon';
import libCommon from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

/**
 * Fetches total count for selection logic (pure data access)
 * @param {Object} context - The context object
 * @param {string} readLink - The OData read link
 * @param {string} filterQuery - The filter query
 * @returns {Promise<number>} Total count
 */
async function fetchTotalCount(context, readLink, filterQuery) {
    return libCommon.getEntitySetCount(context, `${readLink}/WarehouseInboundDeliveryItem_Nav`, filterQuery);
}

/**
 * Extracts UI state specific to selection handling
 * @param {Object} context - The context object
 * @returns {Object} Selection-specific UI state object
 */
function extractSelectionUIState(context) {
    const commonState = extractCommonUIState(context);
    
    if (!commonState.hasValidSection) {
        return { ...commonState, hasValidControls: false };
    }

    try {
        const button = commonState.pageProxy.getFioriToolbar()?.getItem('CreateMixedHUButton');
        const binding = commonState.pageProxy.binding;
        
        return {
            ...commonState,
            button,
            selectedItemsCount: commonState.section.getSelectedItemsCount() || 0,
            filterQuery: commonState.sectionedTable.getFilterActionResult() || '',
            readLink: binding?.['@odata.readLink'],
            hasValidControls: !!(commonState.section && commonState.sectionedTable && binding),
        };
    } catch (error) {
        Logger.error('WHInboundDeliveryItemListOnSelectionChanged', `Error extracting selection UI state: ${error}`);
        return { ...commonState, hasValidControls: false };
    }
}

/**
 * Determines if create button should be enabled with input validation
 * @param {Array} selectedItems - Array of selected items
 * @returns {boolean} True if button should be enabled
 */
function shouldEnableCreateButton(selectedItems) {
    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
        return false;
    }
    
    return selectedItems.every((item) => 
        item && item.binding && typeof item.binding.OpenPackableQuantity === 'number' && item.binding.OpenPackableQuantity > 0,
    );
}

/**
 * Determines header button visibility with input validation
 * @param {number} selectedItemsCount - Number of selected items
 * @param {number} totalCount - Total number of items
 * @returns {Object} Visibility state for buttons
 */
function determineButtonVisibility(selectedItemsCount, totalCount) {
    if (!validateNumericInput(selectedItemsCount, 'selectedItemsCount') || !validateNumericInput(totalCount, 'totalCount')) {
        Logger.debug('WHInboundDeliveryItemListOnSelectionChanged', 'Invalid input for button visibility');
        return { showSelectAll: false, showDeselectAll: false };
    }
    
    return {
        showSelectAll: selectedItemsCount !== totalCount,
        showDeselectAll: selectedItemsCount === totalCount,
    };
}

/**
 * Updates UI elements based on state (pure UI operations)
 * @param {Object} uiState - UI state object
 * @param {Object} buttonVisibility - Button visibility state
 * @param {boolean} buttonEnabled - Whether create button should be enabled
 * @returns {void}
 */
function updateUIElements(uiState, buttonVisibility, buttonEnabled) {
    try {
        // Update create button
        if (uiState.button) {
            uiState.button.setEnabled(buttonEnabled);
        }

        // Update header buttons
        setHeaderItemVisible(uiState.section, 'SelectAll', buttonVisibility.showSelectAll);
        setHeaderItemVisible(uiState.section, 'DeselectAll', buttonVisibility.showDeselectAll);
    } catch (error) {
        Logger.error('WHInboundDeliveryItemListOnSelectionChanged', `Error updating UI elements: ${error}`);
    }
}

/**
 * Handles selection change events (orchestration only)
 * @param {Object} context - The context object
 * @returns {Promise<void>}
 */
export default async function WHInboundDeliveryItemListOnSelectionChanged(context) {
    try {
        // 1. Extract UI state (pure UI access)
        const uiState = extractSelectionUIState(context);
        
        if (!uiState.hasValidControls) {
            Logger.error('WHInboundDeliveryItemListOnSelectionChanged', 'Invalid UI controls');
            return;
        }

        // 2. Fetch data (pure data access with error handling)
        const totalCount = await fetchTotalCount(context, uiState.readLink, uiState.filterQuery)
            .catch(error => {
                Logger.error('WHInboundDeliveryItemListOnSelectionChanged', `Error fetching total count: ${error}`);
                return 0;
            });

        // 3. Apply business logic (pure business logic)
        const selectedItems = uiState.section.getSelectedItems();
        const buttonEnabled = shouldEnableCreateButton(selectedItems);
        const buttonVisibility = determineButtonVisibility(uiState.selectedItemsCount, totalCount);

        // 4. Update UI (pure UI operations)
        updateUIElements(uiState, buttonVisibility, buttonEnabled);

        // 5. Update caption (triggers separate UI update)
        updateSectionCaption(context);
        
    } catch (error) {
        Logger.error('WHInboundDeliveryItemListOnSelectionChanged', `Error in selection changed handler: ${error}`);
    }
}

/**
 * Legacy function for backward compatibility
 * @param {Object} section - The section object
 * @returns {boolean} True if button should be enabled
 */
export function isCreateButtonEnabled(section) {
    try {
        const selectedItems = section.getSelectedItems();
        return shouldEnableCreateButton(selectedItems);
    } catch (error) {
        Logger.error('WHInboundDeliveryItemListOnSelectionChanged', `Error in isCreateButtonEnabled: ${error}`);
        return false;
    }
}
