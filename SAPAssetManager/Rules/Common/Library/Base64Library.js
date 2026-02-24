/*
 * Convert A String to Base64 String or Vice-Versa  
 */


export default class {
    /*
     * Convert A String to Base64 String  
    */
   //eslint-disable
    static transformStringToBase64(isAndroid, textString) {
        // eslint-disable-next-line no-undef
        if (isAndroid) {
          // eslint-disable-next-line no-undef
          const text = new java.lang.String(textString);
          const data = text.getBytes('UTF-8');
          // eslint-disable-next-line no-undef
          const base64String = android.util.Base64.encodeToString(data,android.util.Base64.DEFAULT);
          return base64String;
        } else  {
          // eslint-disable-next-line no-undef
          const text = NSString.stringWithString(textString);
          // eslint-disable-next-line no-undef
          const data = text.dataUsingEncoding(NSUTF8StringEncoding);
          // eslint-disable-next-line no-undef
          const base64String = data.base64EncodedStringWithOptions(0);
          return base64String;
        }
      }
      
      /*
       * Convert A Base64 String to String  
       */
       static transformBase64ToString(isAndroid, base64String) {
        if (isAndroid) {
          // eslint-disable-next-line no-undef
          const data = android.util.Base64.decode(base64String,android.util.Base64.DEFAULT);
          // eslint-disable-next-line no-undef
          const decodedString = new java.lang.String(data,java.nio.charset.StandardCharsets.UTF_8);
          return decodedString;
        } else {
          // eslint-disable-next-line no-undef
          const decodedData = NSData.alloc().initWithBase64EncodedStringOptions(base64String,0);
          // eslint-disable-next-line no-undef
          return NSString.alloc().initWithDataEncoding(decodedData,NSUTF8StringEncoding);
        }
      }
      
      static transformBinaryToBase64(isAndroid, binarySource) {
        if (isAndroid) {
          // eslint-disable-next-line no-undef
          return android.util.Base64.encodeToString(binarySource, android.util.Base64.NO_WRAP);
        } else {
          return binarySource.base64EncodedStringWithOptions(0);
        }
      }
    //eslint-enable

    /**
     * @param {boolean} isAndroid 
     * @param {string} base64String 
     * @returns {Uint8Array} resulting data
     */
    // eslint-disable-next-line no-unused-vars
    static transformBase64ToBinary(isAndroid, base64String) {
      if (isAndroid) {
        // eslint-disable-next-line no-undef
        const decodedData = android.util.Base64.decode(base64String,android.util.Base64.DEFAULT);
        // eslint-disable-next-line no-undef
        return new Uint8Array(decodedData);
      } else {
        // eslint-disable-next-line no-undef
        const decodedData = NSData.alloc().initWithBase64EncodedStringOptions(base64String,0);
        // eslint-disable-next-line no-undef
        return new Uint8Array(interop.bufferFromData(decodedData));
      }
    }

    /**
     * convert the -_ of urlencoded b64 to normal +/ characters
     * @param {string} base64String 
     * @returns {string} base64 urlencoded string
     */
    static convertFromURLEncoding(base64String) {
      return base64String.replace(/-/g, '+').replace(/_/g, '/');
    }

    /**
     * convert the +/ of base64 to the urlencoded -_ characters
     * @param {string} base64URLEncodedString 
     * @returns {string} base64 encoded string
     */
    static convertToURLEncoding(base64URLEncodedString) {
      return base64URLEncodedString.replace(/\+/g, '-').replace(/\//g, '_');
    }

    /**
     * base64 decode may fail if the string length is not divisible by 4, add padding to a multiple of 4
     * throw if the string looks invalid (remainder of 1)
     * @param {string} base64String 
     * @returns {string} base64 encoded string
     * @throws if string.length % 4 = 1
     */
    static addPadding(base64String) {
      let padding = '';
      switch (base64String.length % 4) {
        case 1:
          throw new Error('invalid b64. string.length % 4 = 1');
        case 2:
          padding = '==';
          break;
        case 3:
          padding = '=';
          break;
      }
      
      const paddedString = base64String + padding;
      return paddedString;
    }
}
