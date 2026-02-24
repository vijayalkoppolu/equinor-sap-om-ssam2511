import libVal from './ValidationLibrary';
import libCommon from './CommonLibrary';
import OffsetODataDate from '../Date/OffsetODataDate';

export default class {

    /**
     * Format the display value for a list picker
     * @param {*} key 
     * @param {*} description 
     */
    static formatListPickerDisplayValue(context, key, description) {
        let keyValue = key;

        if (libVal.evalIsEmpty(key)) {
            keyValue = libCommon.getAppParam(context,'APPLICATION', 'LocalIdentifier');
        }
        if (libVal.evalIsEmpty(description)) {
            return keyValue;
        } else {
            //Format is currently "Code - Description"
            return `${keyValue} - ${description}`;
        }
    }

    /**
     * Format the display value for a detail screen header
     * @param {*} key 
     * @param {*} description 
     */
    static formatDetailHeaderDisplayValue(context, key, description) {
        let keyValue = key;
        if (libVal.evalIsEmpty(key)) {
            keyValue = libCommon.getAppParam(context,'APPLICATION', 'LocalIdentifier');
        }
        if (libVal.evalIsEmpty(description)) {
            return keyValue;
        } else {
            //Format is currently "Description Code"
            return `${description} ${keyValue}`;
        }
    }

    /**
     * Return a formatted string for key/description pairs to be displayed on screen
     * @param {*} key 
     * @param {*} description 
     */
    static getFormattedKeyDescriptionPair(context, key, description) {

        let keyValue = key;

        if (libVal.evalIsEmpty(key)) {
            keyValue = libCommon.getAppParam(context,'APPLICATION', 'LocalIdentifier');
        }
        if (libVal.evalIsEmpty(description)) {
            return keyValue;
        } else {
            //Format is currently "Description (Code)"
            return `${description} (${keyValue})`;
        }
    }

    static formatDateTimeToShortFormatWithOffset(context, date, time, emptyPlaceholder = '-') {
        if (!date) return emptyPlaceholder;

        let odataDate = new OffsetODataDate(context, date, time);
        return context.formatDatetime(odataDate.date(), '', '', {'format': 'short'});
    }

    static formatDateToShortFormatWithOffset(context, date, emptyPlaceholder = '-') {
        if (!date) return emptyPlaceholder;

        let odataDate = new OffsetODataDate(context, date);
        return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
    }
}
