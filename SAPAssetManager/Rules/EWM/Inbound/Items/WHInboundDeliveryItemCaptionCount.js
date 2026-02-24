import ComLib from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import { WHInboundDeliveryItemFilterAndSearchQuery } from './WHInboundDeliveryItemListQuery';
import { extractCommonUIState, validateNumericInput, safeLocalize } from './WHInboundDeliveryItemUICommon';

/**
 * Fetches item count using navigation property (pure data access)
 * @param {Object} context - The context object
 * @param {string} readLink - The OData read link
 * @param {string} filterQuery - The filter query to apply
 * @returns {Promise<number>} The count of items
 */
function fetchNavigationItemCount(context, readLink, filterQuery = '') {
    return ComLib.getEntitySetCount(context, `${readLink}/WarehouseInboundDeliveryItem_Nav`, filterQuery);
}

/**
 * Fetches standard item counts (pure data access)
 * @param {Object} context - The context object
 * @returns {Promise<{count: number, totalCount: number}>} Object with count and totalCount
 */
function fetchStandardItemCounts(context) {
    const totalCountQueryOptions = WHInboundDeliveryItemFilterAndSearchQuery(context);
    const countQueryOptions = WHInboundDeliveryItemFilterAndSearchQuery(context, true, true);

    const totalCountPromise = ComLib.getEntitySetCount(context, 'WarehouseInboundDeliveryItems', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(context, 'WarehouseInboundDeliveryItems', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise])
        .then(([count, totalCount]) => ({ count, totalCount }));
}

/**
 * Extracts UI state specific to caption logic
 * @param {Object} context - The context object
 * @returns {Object} UI state object
 */
function extractCaptionUIState(context) {
    const commonState = extractCommonUIState(context);
    
    if (!commonState.hasValidSection) {
        return {
            ...commonState,
            isSelectionMode: false,
            selectedCount: 0,
            filterQuery: '',
        };
    }

    return {
        ...commonState,
        isSelectionMode: commonState.section.getSelectionMode() === 'Multiple',
        selectedCount: commonState.section.getSelectedItemsCount() || 0,
        filterQuery: commonState.sectionedTable.getFilterActionResult() || '',
    };
}

/**
 * Generates selection mode caption text with validation
 * @param {Object} context - The context object
 * @param {number} selectedCount - Number of selected items
 * @param {number} totalCount - Total number of items
 * @returns {string} The caption text
 */
function generateSelectionCaptionText(context, selectedCount, totalCount) {
    if (!validateNumericInput(selectedCount, 'selectedCount') || !validateNumericInput(totalCount, 'totalCount')) {
        return safeLocalize(context, 'selected_items_x_x', [0, 0], 'Selected (0/0)');
    }
    
    return safeLocalize(
        context, 
        'selected_items_x_x', 
        [selectedCount, totalCount], 
        `Selected (${selectedCount}/${totalCount})`,
    );
}

/**
 * Generates normal mode caption text with validation
 * @param {Object} context - The context object
 * @param {number} count - Current count
 * @param {number} totalCount - Total count
 * @returns {string} The caption text
 */
function generateNormalCaptionText(context, count, totalCount) {
    if (!validateNumericInput(count, 'count') || !validateNumericInput(totalCount, 'totalCount')) {
        return safeLocalize(context, 'items_x', [0], 'Items (0)');
    }
    
    if (count === totalCount) {
        return safeLocalize(context, 'items_x', [totalCount], `Items (${totalCount})`);
    }
    
    return safeLocalize(context, 'items_x_x', [count, totalCount], `Items (${count}/${totalCount})`);
}

/**
 * Handles caption generation for selection mode with error propagation
 * @param {Object} context - The context object
 * @param {number} selectedCount - Number of selected items
 * @param {string} filterQuery - The filter query
 * @param {string} readLink - The OData read link
 * @returns {Promise<string>} The caption text
 */
function handleSelectionModeCaption(context, selectedCount, filterQuery, readLink) {
    if (!readLink) {
        Logger.debug('WHInboundDeliveryItemCaptionCount', 'No read link available for selection mode');
        return Promise.resolve(generateSelectionCaptionText(context, selectedCount, 0));
    }

    return fetchNavigationItemCount(context, readLink, filterQuery)
        .then(totalCount => generateSelectionCaptionText(context, selectedCount, totalCount))
        .catch(error => {
            Logger.error('WHInboundDeliveryItemCaptionCount', `Error fetching selection mode count: ${error}`);
            return generateSelectionCaptionText(context, selectedCount, 0);
        });
}

/**
 * Handles caption generation for normal mode with error propagation
 * @param {Object} context - The context object
 * @returns {Promise<string>} The caption text
 */
function handleNormalModeCaption(context) {
    return fetchStandardItemCounts(context)
        .then(({ count, totalCount }) => generateNormalCaptionText(context, count, totalCount))
        .catch(error => {
            Logger.error('WHInboundDeliveryItemCaptionCount', `Error fetching normal mode counts: ${error}`);
            return generateNormalCaptionText(context, 0, 0);
        });
}

/**
 * Generates the appropriate caption text based on current state
 * @param {Object} context - The context object
 * @param {Object} [binding] - Optional binding object
 * @returns {Promise<string>} The caption text
 */
export default function WHInboundDeliveryItemCaptionCount(context, binding) {
    try {
        // Use nullish coalescing to avoid unnecessary evaluation
        const actualBinding = binding ?? context.getPageProxy()?.binding;
        
        // 1. Extract UI state (pure UI access)
        const uiState = extractCaptionUIState(context);
        
        if (!uiState.hasValidSection) {
            return Promise.resolve(generateNormalCaptionText(context, 0, 0));
        }

        // 2. Business logic decision and data fetching
        if (uiState.isSelectionMode) {
            const readLink = actualBinding?.['@odata.readLink'];
            return handleSelectionModeCaption(context, uiState.selectedCount, uiState.filterQuery, readLink);
        }
        
        // 3. Handle normal mode
        return handleNormalModeCaption(context);
        
    } catch (error) {
        Logger.error('WHInboundDeliveryItemCaptionCount', `Unexpected error: ${error}`);
        return Promise.resolve(generateNormalCaptionText(context, 0, 0));
    }
}

/**
 * Updates the section caption by triggering a redraw (pure UI operation)
 * @param {Object} context - The context object
 * @returns {void}
 */
export function updateSectionCaption(context) {
    try {
        const { section } = extractCommonUIState(context);
        
        if (section) {
            section.redraw();
        } else {
            Logger.debug('WHInboundDeliveryItemCaptionCount', 'Could not find section to update');
        }
    } catch (error) {
        Logger.error('WHInboundDeliveryItemCaptionCount', `Error updating section caption: ${error}`);
    }
}
