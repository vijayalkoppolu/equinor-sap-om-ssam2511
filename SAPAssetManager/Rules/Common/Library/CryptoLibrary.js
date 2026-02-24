import isAndroid from '../IsAndroid';
import isIOS from '../IsIOS';
import logger from '../../Log/Logger';

/**
 * This library provides native encryption and decryption functionality using AES algorithm
 * Currently used for confirmation scenarios feature
 */

export default class {

    /**
     * Generate SHA-256 hash from the password to create a 32-byte AES key
     * @param {string} password - The password to hash
     * @returns {byte[]} - The generated key as a byte array
     */
    static generateKeyFromPasswordAndroid(password) {
        // Convert plaintext password to hex
        // eslint-disable-next-line no-undef
        let hexPassword = this.byteArrayToHexAndroid(new java.lang.String(password).getBytes('UTF-8'));
    
        // Convert hex string to Java byte array
        const passwordBytes = this.hexStringToJavaByteArrayAndroid(hexPassword);
    
        // Generate SHA-256 hash
        // eslint-disable-next-line no-undef
        const digest = java.security.MessageDigest.getInstance('SHA-256');
        digest.update(passwordBytes);
    
        return digest.digest(); // Returns a Java byte array (32 bytes)
    }
    
    // Convert hex string to byte array
    static hexStringToByteArrayAndroid(hex) {
        const byteArray = new Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            byteArray[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        // eslint-disable-next-line no-undef
        return java.nio.ByteBuffer.wrap(byteArray).array(); // Ensure it becomes a Java byte array
    }

    // Utility: Convert hex string to Java byte array
    static hexStringToJavaByteArrayAndroid(hex) {
        const bytes = Array.create('byte', hex.length / 2); // Native Java byte array
        for (let i = 0; i < hex.length; i += 2) {
            // eslint-disable-next-line no-undef
            bytes[i / 2] = java.lang.Byte.parseByte(hex.substr(i, 2), 16);
        }
        return bytes;
    }
    
    // Utility: Convert byte array to hex string (Android-compatible)
    static byteArrayToHexAndroid(byteArray) {
        let hexString = '';
        for (let i = 0; i < byteArray.length; i++) {
            let hex = (byteArray[i] & 0xff).toString(16); // Convert byte to hex
            if (hex.length === 1) {
                hex = '0' + hex; // Ensure two-digit format
            }
            hexString += hex;
        }
        return hexString.toUpperCase(); // Match standard hex formatting
    }
    
    /**
     * Encrypts a JSON string using AES-256 (CBC) with a generated key
     * @param {string} plainText - The plaintext to encrypt
     * @param {string} password - The password used for encryption
     * @param {*} context - The context to log errors
     * @returns {string|null} - The encrypted text or null if encryption fails
     */
    static encryptAESAndroid(plainText, password, context) {
        try {
            // Generate AES key
            const keyBytes = this.generateKeyFromPasswordAndroid(password);
            // eslint-disable-next-line no-undef
            const secretKey = new javax.crypto.spec.SecretKeySpec(keyBytes, 'AES');
            const ivHex = '7361705F6369706865725F696E69745F'; // Use the predefined IV (16-byte hex string)
            const ivBytes = this.hexStringToByteArrayAndroid(ivHex);
            // eslint-disable-next-line no-undef
            const iv = new javax.crypto.spec.IvParameterSpec(ivBytes);    
            
            // Initialize AES cipher
            // eslint-disable-next-line no-undef
            const cipher = javax.crypto.Cipher.getInstance('AES/CBC/PKCS5Padding');
            // eslint-disable-next-line no-undef
            cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, secretKey, iv);
            
            // Convert plaintext to bytes
            // eslint-disable-next-line no-undef
            const plainTextBytes = new java.lang.String(plainText).getBytes('UTF-8');
            
            // Encrypt
            const cipherText = cipher.doFinal(plainTextBytes);
        
            // Combine IV + ciphertext and encode in Base64
            // eslint-disable-next-line no-undef
            const combined = new java.io.ByteArrayOutputStream();
            combined.write(ivBytes);  // Append IV
            combined.write(cipherText); // Append Ciphertext
    
            // eslint-disable-next-line no-undef
            const encryptedBase64 = java.util.Base64.getEncoder().encodeToString(combined.toByteArray());
    
            return encryptedBase64;
        } catch (e) {
            logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrypto.global').getValue(), 'CryptoLibrary - Encryption error: ' + e.message);
            return '';
        }
    }

    /**
     * Decrypts an AES-256 (CBC) encrypted Base64 string
     * @param {string} encryptedBase64 - The Base64 encoded encrypted string
     * @param {string} password - The password used for encryption
     * @param {*} context - The context to log errors
     * @returns {string|null} - The decrypted string or null if decryption fails
     */
    static decryptAESAndroid(encryptedBase64, password, context) {
        try {
            const keyBytes = this.generateKeyFromPasswordAndroid(password);
            // eslint-disable-next-line no-undef
            const secretKey = new javax.crypto.spec.SecretKeySpec(keyBytes, 'AES');

            // Decode Base64
            // eslint-disable-next-line no-undef
            const encryptedBytes = java.util.Base64.getDecoder().decode(encryptedBase64);

            // Extract IV (first 16 bytes)
            // eslint-disable-next-line no-undef
            const ivBytes = java.util.Arrays.copyOfRange(encryptedBytes, 0, 16);
            // eslint-disable-next-line no-undef
            const iv = new javax.crypto.spec.IvParameterSpec(ivBytes);

            // Extract Ciphertext
            // eslint-disable-next-line no-undef
            const cipherTextBytes = java.util.Arrays.copyOfRange(encryptedBytes, 16, encryptedBytes.length);
            // eslint-disable-next-line no-undef
            const cipher = javax.crypto.Cipher.getInstance('AES/CBC/PKCS5Padding');
            // eslint-disable-next-line no-undef
            cipher.init(javax.crypto.Cipher.DECRYPT_MODE, secretKey, iv);

            // Decrypt
            const decryptedBytes = cipher.doFinal(cipherTextBytes);

            // Convert decrypted bytes to string
            // eslint-disable-next-line no-undef
            const decryptedString = new java.lang.String(decryptedBytes, 'UTF-8').toString();

            return decryptedString;
        } catch (e) {
            logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrypto.global').getValue(), 'CryptoLibrary - Decryption error: ' + e.message);
            return '';
        }
    }

    /**
     * Generate SHA-256 hash from the password to create a 32-byte AES key (iOS)
     * @param {string} password - The password to hash
     * @returns {NSData} - The generated key as NSData
     */
    static generateKeyFromPasswordIOS(password) {
        // Convert password to NSData
        // eslint-disable-next-line no-undef
        let passwordData = NSString.stringWithString(password).dataUsingEncoding(NSUTF8StringEncoding);

        // Create SHA-256 hash
        // eslint-disable-next-line no-undef
        let hash = NSMutableData.dataWithLength(32);
        // eslint-disable-next-line no-undef
        CC_SHA256(passwordData.bytes, passwordData.length, hash.mutableBytes);

        return hash;
    }

    // Convert hex string to NSData (iOS)
    static hexStringToNSDataIOS(hexString) {
        if (!hexString || hexString.length % 2 !== 0) {
            throw new Error('Invalid hex string!');
        }
    
        // eslint-disable-next-line no-undef
        let data = NSMutableData.alloc().init();
        let byteArray = new Uint8Array(hexString.length / 2); // Create a proper byte buffer
    
        for (let i = 0; i < hexString.length; i += 2) {
            let hexByte = hexString.substring(i, i + 2);
            let byteValue = parseInt(hexByte, 16);
            byteArray[i / 2] = byteValue; // Assign directly to Uint8Array
        }
    
        // Properly pass a raw byte buffer
        data.appendBytesLength(byteArray.buffer, byteArray.length);
        
        return data;
    }

    // Convert NSData to hex string (iOS)
    static nsDataToHexStringIOS(nsData) {
        if (!nsData || nsData.length === 0) {
            return '';
        }
    
        let hexArray = [];
        let rawBytes = new Uint8Array(nsData.length);
        nsData.getBytesLength(rawBytes, nsData.length);
    
        for (let i = 0; i < rawBytes.length; i++) {
            let hex = rawBytes[i].toString(16).padStart(2, '0'); // Ensure 2-digit hex
            hexArray.push(hex);
        }
    
        return hexArray.join('');
    }

    /**
     * Encrypt a string using AES-256-CBC (iOS)
     * @param {string} plainText - The plaintext to encrypt
     * @param {string} password - The password used for encryption
     * @param {*} context - The context to log errors
     * @returns {string|null} - The encrypted string or null if encryption fails
     */
    static encryptAESIOS(plainText, password, context) {
        try {
            let keyData = this.generateKeyFromPasswordIOS(password);
            let keyBytesBuffer = new ArrayBuffer(keyData.length);
            let keyBytesView = new Uint8Array(keyBytesBuffer);

            keyData.getBytesLength(keyBytesView, keyData.length);
            // eslint-disable-next-line no-undef
            let keyBytes = NSData.dataWithBytesLength(keyBytesView, keyBytesView.length);
            // eslint-disable-next-line no-undef
            let ivHex = '7361705F6369706865725F696E69745F'; //Use predefined IV (16-byte hex string)
            let ivData = this.hexStringToNSDataIOS(ivHex);
    
            // eslint-disable-next-line no-undef
            let plainData = NSString.stringWithString(plainText).dataUsingEncoding(NSUTF8StringEncoding); //Convert plaintext to NSData
            let encryptedData = this.aesEncryptIOS(plainData, keyBytes, ivData);  //Perform AES encryption

            // Combine IV + ciphertext and encode in Base64
            // eslint-disable-next-line no-undef
            let combinedData = NSMutableData.alloc().init();
            combinedData.appendData(ivData);
            combinedData.appendData(encryptedData);
            let encryptedBase64 = combinedData.base64EncodedStringWithOptions(0);
           
            return encryptedBase64;
        } catch (e) {
            logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrypto.global').getValue(), 'CryptoLibrary - Encryption error: ' + e.message);
            return '';
        }
    }

    /** 
     * Decrypt a Base64 encoded string using AES-256-CBC (iOS)
     * @param {string} encryptedBase64 - The Base64 encoded encrypted string
     * @param {string} password - The password used for decryption
     * @param {*} context - The context to log errors
     * @returns {string|null} - The decrypted string or null if decryption fails
    */
    static decryptAESIOS(encryptedBase64, password, context) {
        try {
            let keyData = this.generateKeyFromPasswordIOS(password); //Generate Key
            // eslint-disable-next-line no-undef
            let keyBytes = new Uint8Array(interop.bufferFromData(keyData));
            // eslint-disable-next-line no-undef
            let encryptedData = NSData.alloc().initWithBase64EncodedStringOptions(encryptedBase64, 0); //Decode Base64
            let ivData = encryptedData.subdataWithRange({ location: 0, length: 16 }); //Extract IV (first 16 bytes)
            let cipherTextData = encryptedData.subdataWithRange({ location: 16, length: encryptedData.length - 16 }); //Extract Ciphertext (rest)
            let decryptedData = this.aesDecryptIOS(cipherTextData, keyBytes, ivData); //Decrypt
            // eslint-disable-next-line no-undef
            let decryptedString = NSString.alloc().initWithDataEncoding(decryptedData, NSUTF8StringEncoding); //Convert to String

            return decryptedString.toString();
        } catch (e) {
            logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrypto.global').getValue(), 'CryptoLibrary - Decryption error: ' + e.message);
            return '';
        }
    }

    /**
     * AES Encryption Helper (iOS)
     * @param {NSData} plainData - The plaintext data to encrypt
     * @param {NSData} keyBytes - The AES key as NSData
     * @param {NSData} ivData - The initialization vector as NSData
     * @returns {NSData} - The encrypted data as NSData
     */
    static aesEncryptIOS(plainData, keyBytes, ivData) {
        // Convert NSData to Uint8Array
        let keyBytesBuffer = new ArrayBuffer(keyBytes.length);
        let keyBytesView = new Uint8Array(keyBytesBuffer);
        keyBytes.getBytesLength(keyBytesView, keyBytes.length);

        let ivBytesBuffer = new ArrayBuffer(ivData.length);
        let ivBytesView = new Uint8Array(ivBytesBuffer);
        ivData.getBytesLength(ivBytesView, ivData.length);

        let plainTextBuffer = new ArrayBuffer(plainData.length);
        let plainTextView = new Uint8Array(plainTextBuffer);
        plainData.getBytesLength(plainTextView, plainData.length);

        // Prepare output buffer
        // eslint-disable-next-line no-undef
        let bufferSize = plainData.length + kCCBlockSizeAES128;
        let encryptedBuffer = new ArrayBuffer(bufferSize);
        let encryptedView = new Uint8Array(encryptedBuffer);
        // eslint-disable-next-line no-undef
        let encryptedLength = new interop.Reference(0);

        // Perform AES encryption
        // eslint-disable-next-line no-undef
        let status = CCCrypt(
            // eslint-disable-next-line no-undef
            kCCEncrypt,                   // Encrypt operation
            // eslint-disable-next-line no-undef
            kCCAlgorithmAES,              // AES algorithm
            // eslint-disable-next-line no-undef
            kCCOptionPKCS7Padding,        // PKCS7 Padding
            keyBytesView,                 // Key as Uint8Array
            keyBytesView.length,          // Key length (256-bit)
            ivBytesView,                  // IV as Uint8Array
            plainTextView,                // Input data as Uint8Array
            plainTextView.length,         // Input length
            encryptedView,                // Output buffer as Uint8Array
            encryptedView.length,         // Output buffer size
            encryptedLength,              // Output length
        );
        // eslint-disable-next-line no-undef
        if (status !== kCCSuccess) throw new Error('Error encrypting data');

        // eslint-disable-next-line no-undef
        let encryptedData = NSData.dataWithBytesLength(encryptedView, encryptedLength.value); //Convert Uint8Array back to NSData

        return encryptedData;
    }

    /**
     * AES Decryption Helper (iOS)
     * @param {NSData} cipherTextData - The ciphertext data to decrypt
     * @param {NSData} keyBytes - The AES key as NSData
     * @param {NSData} ivData - The initialization vector as NSData
     * @returns {NSData} - The decrypted data as NSData
     */
    static aesDecryptIOS(cipherTextData, keyBytes, ivData) {
        // eslint-disable-next-line no-undef
        let ivBytes = new Uint8Array(interop.bufferFromData(ivData)); //Convert ivData (NSData) to Uint8Array
        // eslint-disable-next-line no-undef
        let cipherTextBytes = new Uint8Array(interop.bufferFromData(cipherTextData)); // Convert cipherTextData (NSData) to Uint8Array
        // eslint-disable-next-line no-undef
        let decryptedData = NSMutableData.dataWithLength(cipherTextBytes.length + kCCBlockSizeAES128); // Allocate output buffer for decrypted data
        // eslint-disable-next-line no-undef
        let decryptedLength = new interop.Reference();

        // Perform AES Decryption using CCCrypt
        // eslint-disable-next-line no-undef
        let status = CCCrypt(
            // eslint-disable-next-line no-undef
            kCCDecrypt,                   // Operation: Decrypt
            // eslint-disable-next-line no-undef
            kCCAlgorithmAES,              // Algorithm: AES
            // eslint-disable-next-line no-undef
            kCCOptionPKCS7Padding,        // Padding: PKCS7
            keyBytes,                     // Key (Uint8Array)
            32,                           // Key length (256-bit)
            ivBytes,                      // IV (Uint8Array)
            cipherTextBytes,              // Ciphertext (Uint8Array)
            cipherTextBytes.length,       // Ciphertext length
            decryptedData.mutableBytes,   // Output buffer
            decryptedData.length,         // Output buffer size
            decryptedLength,              // Output length reference
        );
        // eslint-disable-next-line no-undef
        if (status !== kCCSuccess) throw new Error('Error decrypting data');

        decryptedData.length = decryptedLength.value; //Trim decrypted data to actual output size

        return decryptedData;
    }

    /**
     * Generate a base 64 encoded SHA-256 hash of a string
     * This is used currently for looking up static cooperation data after a scan
     * @param {*} context - The context to determine the OS
     * @param {*} value - The string to hash
     * @returns {string|null} - The base 64 encoded hash or null if hashing fails
     */
    static hash256Base64(context, value) {
        try {
            if (isAndroid(context)) {
                // eslint-disable-next-line no-undef
                const MessageDigest = java.security.MessageDigest;
                // eslint-disable-next-line no-undef
                const Base64 = android.util.Base64;
                const digest = MessageDigest.getInstance('SHA-256');
                // eslint-disable-next-line no-undef
                const textBytes = new java.lang.String(value).getBytes('UTF-8');
                digest.update(textBytes);
                const hash = digest.digest();
        
                const base64Hash = Base64.encodeToString(hash, Base64.NO_WRAP);
                
                return base64Hash;
            } else if (isIOS(context)) {
                // eslint-disable-next-line no-undef
                const data = NSString.stringWithString(value).dataUsingEncoding(NSUTF8StringEncoding);
                // eslint-disable-next-line no-undef
                const hashBuffer = interop.alloc(32); // SHA-256 = 32 bytes

                // eslint-disable-next-line no-undef
                CC_SHA256(data.bytes, data.length, hashBuffer);
                // eslint-disable-next-line no-undef
                const hashData = NSData.dataWithBytesLength(hashBuffer, 32);
                const base64 = hashData.base64EncodedStringWithOptions(0);

                return base64;
            }
        } catch (e) {
            logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrypto.global').getValue(), 'CryptoLibrary - Hashing error: ' + e.message);
            return '';
        }
        return undefined; // Unsupported platform
    }

    /**
     * Convert a Base64 encoded string to a hex string
     * @param {*} base64 
     * @returns 
     */
    static base64ToHex(base64) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const lookup = new Uint8Array(256);

        for (let i = 0; i < chars.length; i++) {
            lookup[chars.charCodeAt(i)] = i;
        }

        const output = [];
        let buffer = 0;
        let bits = 0;

        for (let i = 0; i < base64.length; i++) {
            const c = base64.charCodeAt(i);
            if (base64[i] === '=') break;

            const val = lookup[c];
            if (val === undefined) continue;

            buffer = (buffer << 6) | val;
            bits += 6;

            if (bits >= 8) {
                bits -= 8;
                const byte = (buffer >> bits) & 0xFF;
                output.push(byte.toString(16).padStart(2, '0'));
            }
        }

        return output.join('').toUpperCase();
    }

    /**
     * Wrapper to redirect to correct routine depending on OS
     * Encrypts a JSON string using AES-256 (CBC) with a generated key
     * @param {*} context - The context to determine the OS
     * @param {*} plainText - The text to be encrypted
     * @param {*} password - The password used for encryption
     * @returns {string|null} - The encrypted text or null if encryption fails
     */
    static encryptAESWrapper(context, plainText, password) {
        if (isAndroid(context)) {
            return this.encryptAESAndroid(plainText, password, context);
        } else if (isIOS(context)) {
            return this.encryptAESIOS(plainText, password, context);
        }
        return ''; // Fallback if neither platform
    }

     /**
     * Wrapper to redirect to correct routine depending on OS
     * Decrypts an AES-256 (CBC) encrypted Base64 string
     * @param {*} context - The context to determine the OS
     * @param {*} encryptedBase64 - The Base64 encoded encrypted string
     * @param {*} password - The password used for decryption
     * @returns {string|null} - The decrypted string or null if decryption fails
     */
    static decryptAESWrapper(context, encryptedBase64, password) {
        if (isAndroid(context)) {
            return this.decryptAESAndroid(encryptedBase64, password, context);
        } else if (isIOS(context)) {
            return this.decryptAESIOS(encryptedBase64, password, context);
        }
        return ''; // Fallback if neither platform
    }

}
