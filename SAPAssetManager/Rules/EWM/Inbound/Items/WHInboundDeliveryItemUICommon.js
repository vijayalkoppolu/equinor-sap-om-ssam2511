import Logger from '../../../Log/Logger';

/**
 * Extracts common UI elements with proper validation
 * @param {Object} context - The context object
 * @returns {Object} Common UI state object
 */
export function extractCommonUIState(context) {
    try {
        const pageProxy = context.getPageProxy();
        const controls = pageProxy.getControls();
        
        // Explicit validation instead of optional chaining with indices
        const sectionedTable = controls && controls.length > 0 ? controls[0] : null;
        const sections = sectionedTable?.getSections();
        const section = sections && sections.length > 0 ? sections[0] : null;
        
        return {
            pageProxy,
            sectionedTable,
            section,
            hasValidSection: !!section,
        };
    } catch (error) {
        Logger.error('WHInboundDeliveryItemUICommon', `Error extracting common UI state: ${error}`);
        return {
            pageProxy: null,
            sectionedTable: null,
            section: null,
            hasValidSection: false,
        };
    }
}

/**
 * Validates numeric inputs for business logic functions
 * @param {number} value - Value to validate
 * @param {string} paramName - Parameter name for logging
 * @returns {boolean} True if valid
 */
export function validateNumericInput(value, paramName) {
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
        Logger.debug('WHInboundDeliveryItemUICommon', `Invalid ${paramName}: ${value}`);
        return false;
    }
    return true;
}

/**
 * Safe localization with consistent fallback pattern
 * @param {Object} context - The context object
 * @param {string} key - Localization key
 * @param {Array} params - Parameters for localization
 * @param {string} fallback - Fallback text
 * @returns {string} Localized text or fallback
 */
export function safeLocalize(context, key, params, fallback) {
    try {
        return context.localizeText(key, params) || fallback;
    } catch (error) {
        Logger.error('WHInboundDeliveryItemUICommon', `Error localizing ${key}: ${error}`);
        return fallback;
    }
}
