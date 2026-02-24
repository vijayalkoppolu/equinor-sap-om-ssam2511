import CommonLibrary from './CommonLibrary';
import libVal from './ValidationLibrary';

export default class {

    /**
     * Returns the decimal separator for the passed in locale, or
     * the default for the device.
     * @param {String} locale - locale in the format 'xx-YY' where xx is the language code
     * and YY is the region such as 'en-US' or 'de-DE'
     * @returns {String} - the single character decimal separator
     */
    static getDecimalSeparator(context, locale='') {
        if (locale === '') {
            locale = context.getLanguage() + '-' + context.getRegion();
        }
    
        return (context.formatNumber(Number(1.1),locale)).substr(1,1);

    }

    /**
     * Tests whether the passed in string is a valid number for the
     * default locale
     * @param {ClientAPI} context 
     * @param {String} numString - Number in string format 
     * @param {String} separator - character to be used as decimal separator
     * @returns {Boolean} 
     */
    static isNumber(context, numString, locale='') {

        if (libVal.evalIsEmpty(numString)) return false;

        if (typeof numString === 'number') {
            return true;
        }

        let separator = this.getDecimalSeparator(context, locale);

        let euroReg = /^[+-]?(?:\d{1,3}(?:\.\d{3})*|\d+)?(?:,\d+)?$/;
        let usReg = /^[+-]?(?:\d{1,3}(?:,\d{3})*|\d+)?(?:\.\d+)?$/;
        let expReg = /^[+-]?\d?(?:\.\d+)?[Ee][-+]?\d+$/;
        let arabicReg = /^[+-]?(?:\d{1,3}(?:٬\d{3})*|\d+)?(?:٫\d+)?$/;
        let arabicExpReg = /^[+-]?\d?(?:\٫\d+)?[Ee][-+]?\d+$/;


        if (typeof numString === 'string') {
            numString = numString.trim();
        }
        if (separator === '.') {
            return (usReg.test(numString) || expReg.test(numString));
        } else if (separator === ',') {
            return (euroReg.test(numString) || expReg.test(numString));
        } else if (separator === '٫') {
            // Arabic (Qatar) decimal separator is ٫ (U+066B)
            return arabicReg.test(numString) || arabicExpReg.test(numString);
        }

        return false;
    }
    /**
    * Converts the passed in string to a valid number for the
    * specified or default locale
    * @param {ClientAPI} context 
    * @param {String} numString - Number in string format 
    * @param {String} separator - character to be used as decimal separator
    * @returns {Number} - String converted to a Number
    */
    static toNumber(context, numString, locale='', allowNaN=true) {
        let separator = this.getDecimalSeparator(context, locale);

        if (this.isNumber(context, numString, locale)) {
            if (typeof numString === 'string') {
                numString = numString.trim();
                let temp = '';
                if (separator === '.') {
                    temp = numString.replace(/,/g, '');
                } else if (separator === ',') {
                    temp = numString.replace(/\./g, '');
                    temp = temp.replace(',', '.');
                } else if (separator === '٫') {
                    //  Arabic (Qatar) decimal separator is ٫ (U+066B)
                    temp = numString.replace(/٬/g, '');
                    temp = temp.replace('٫', '.');
                } else {
                    return allowNaN === true ? Number(NaN) : '';
                }
                return Number(temp);
            } else if (typeof numString === 'number') {
                return numString;
            }
        }
        return allowNaN === true ? Number(NaN) : '';
    }
    
    /**
    * Converts the passed in string to a valid currency string for the specified or default locale
    * @param {ClientAPI} context 
    * @param {String} value - Number in string format 
    * @param {String} currencyCode - Currency
    * @param {Boolean} useSymbol - whether to replace currency code with a symbol or leave as is 
    * @param {Object} formatOptions - additional formatting options
    * @param {String} locale - locale to format to
    * @returns {String} - String formatted to a currency string in specified locale
    */
    static toCurrencyString(context, value, currencyCode, useSymbol = true, formatOptions = undefined, locale = context.getLanguage() + '-' + context.getRegion()) {
        if (libVal.evalIsNumeric(value)) {
            if (useSymbol) {
                return context.formatCurrency(value, currencyCode, locale, formatOptions);
            } else {
                return context.formatNumber(value, locale, formatOptions) + ' ' + currencyCode;
            }
        } else {
            return '-';
        }
    }

    static async formatBackendValueToNumber(context, value) {
        let backendDecimalSeparator = await this.getBackendDecimalSeparator(context);
    
        if (backendDecimalSeparator && backendDecimalSeparator === ',') {
            return value.replace('.', '').replace(',', '.');
        }

        return value;
    }

    static async formatNumberToBackendSupportedFormat(context, number) {
        let stringNumber = this.toNumber(context, number).toString();
        let backendDecimalSeparator = await this.getBackendDecimalSeparator(context);
    
        if (backendDecimalSeparator && backendDecimalSeparator === ',') {
            return stringNumber.replace('.', ',');
        }
    
        return stringNumber;
    }

    static async getBackendDecimalSeparator(context) {
        if (CommonLibrary.getStateVariable(context, 'BACKEND_DECIMAL_SEPARATOR') !== undefined) {
            return Promise.resolve(CommonLibrary.getStateVariable(context, 'BACKEND_DECIMAL_SEPARATOR'));
        }

        let backendDecimalFormat = await CommonLibrary.getUserSystemProperty(context, 'SYS.USER', 'DECIMALFORMAT');
    
        if (backendDecimalFormat) {
            let commaSeparatorReg = /^[+-]?(?:\d{1,3}(?:\.\d{3})*|\d+)?(?:,\d+)?$/; //1.234.567,89 or 1234567,89 
            let dotSeparatorReg = /^[+-]?(?:\d{1,3}(?:,\d{3})*|\d+)?(?:\.\d+)?$/; //1,234,567.89 
            
            if (commaSeparatorReg.test(backendDecimalFormat)) {
                CommonLibrary.setStateVariable(context, 'BACKEND_DECIMAL_SEPARATOR', ',');
                return ',';
            } else if (dotSeparatorReg.test(backendDecimalFormat)) {
                CommonLibrary.setStateVariable(context, 'BACKEND_DECIMAL_SEPARATOR', '.');
                return '.';
            }
        }

        CommonLibrary.setStateVariable(context, 'BACKEND_DECIMAL_SEPARATOR', '');
        return '';
    }
}
